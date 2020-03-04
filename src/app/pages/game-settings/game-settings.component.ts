import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerModel } from 'src/app/models/player.model';
import { CarriageColorEnum } from 'src/app/models/enum/carriage-color.enum';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { GameModel } from 'src/app/models/game.model';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { GameboardComponent } from 'src/app/pages/gameboard/gameboard.component';
import { GameResultService } from 'src/app/services/game-result.service';
import { GameStatusEnum } from 'src/app/models/enum/game-status.enum';
import { PlayerGameItemModel } from 'src/app/models/player-game-item.model';

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameSettingsComponent implements OnInit, OnDestroy {

  player: PlayerModel;

  srcListOfColorTrain: Array<{ label: string, value: string }>;
  listOfColorTrain: Array<{ label: string, value: string }>;

  public gameForm: FormGroup;
  gameTime: boolean;
  finishGameTime: boolean;
  savedFinishGame: boolean;
  public winnerPlayer: PlayerGameItemModel;
  private oldData: GameModel;
  public readonly MIN_PLAYER: number = 3;
  public readonly MAX_PLAYER: number = 5;

  constructor(private fb: FormBuilder, private router: Router, private gameService: GameService, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private modalService: NzModalService, private gameResultService: GameResultService, private message: NzMessageService) {
  }

  ngOnInit(): void {
    this.srcListOfColorTrain = CarriageColorEnum.ALL.map(data => ({value: data.colorHash, label: data.colorHash}));
    this.listOfColorTrain = [...this.srcListOfColorTrain];

    this.gameForm = this.fb.group({
      playerInfos: this.fb.array([]),
      createdDate: [''],
      winnerResult: undefined,
      id: ['']
    });
    this.initRouteParams();
    this.initGameInfo();
  }

  private restoreInformation(oldData: GameModel) {
    this.oldData = oldData;
    this.savedFinishGame = oldData.status === GameStatusEnum.COMPLETE.value;
    this.finishGameTime = !!oldData.winnerResult;
    this.initPlayersInfo(this.oldData.playerInfos.length - this.MIN_PLAYER);
    if (this.finishGameTime) {
      this.winnerPlayer = this.oldData.playerInfos.filter(data => data.winner)[0];
    }

  }

  initRouteParams() {

    this.route.params.pipe(
      take(1),
      filter(data => data.id),
      switchMap((param) => {
        return this.gameService.getGameById(param.id).then((data: GameModel) => {
          this.restoreInformation(data);
          this.gameForm.patchValue(data);
          this.cdr.detectChanges();
        }).catch(err => {
          console.log('err ->', err);
          this.gameTime = false;
          this.cdr.detectChanges();
          this.router.navigate(['/game-setting']);
        });
      })
    ).subscribe();

    this.route.params.pipe(
      untilDestroyed(this),
      filter(data => data.id),
      tap(data => {
        if (data.id) {
          this.gameTime = true;
          this.cdr.detectChanges();
        }
      })
    ).subscribe();
  }

  get playerInfoList(): FormArray {
    return this.gameForm.get('playerInfos') as FormArray;
  }

  private initGameInfo() {
    this.gameForm.patchValue({createdDate: new Date()});
    this.initPlayersInfo(this.MIN_PLAYER);
  }

  private initPlayersInfo(countPlayers: number) {
    for (let i = 0; i < countPlayers; i++) {
      this.playerInfoList.push(this.newPlayerInfo());
    }
  }

  newPlayerInfo(): FormGroup {
    return this.fb.group({
      player: this.fb.group({
        colorTrains: ['', Validators.required],
        name: ['', Validators.required]
      }),
      result: undefined,
      winner: undefined
    });
  }

  async submitGameForm() {
    if (this.gameForm.valid) {
      const gameSetting: GameModel = this.gameForm.value;
      const id = await this.gameService.startGame(gameSetting);
      this.gameForm.patchValue({id});
      this.gameForm.patchValue({status: GameStatusEnum.CURRENT.value});
      await this.router.navigate(['/game-setting', {id: id}]);
    } else {
      this.gameForm.updateValueAndValidity();
      this.gameForm.markAllAsTouched();
      this.message.error('Fill all required fields');
    }

  }

  finishGame() {
    if (this.gameForm.valid && this.finishGameTime) {
      Object.assign(this.oldData, {status: GameStatusEnum.COMPLETE.value});
      this.updateGameInfoById();
      this.router.navigateByUrl('/dashboard');
    } else {
      this.message.error('Fill results for players!');
    }
  }

  private updateGameInfoById() {
    const req = {...this.oldData, ...this.gameForm.value};
    this.gameService.updateGameInfoById(this.gameForm.value.id, req);

  }

  private checkAllFillResult(): boolean {
    const gameModel: GameModel = this.gameForm.value;
    const filledResultList = gameModel.playerInfos.filter(data => !!data.result?.totalValueRoutes);
    return gameModel.playerInfos.length === filledResultList.length;
  }

  private checkResult() {
    const gameModel: GameModel = this.gameForm.value;
    this.finishGameTime = this.checkAllFillResult();
    if (this.finishGameTime) {

      let winnerResult = gameModel?.playerInfos[0]?.result?.totalValue;
      let winnerControl = this.playerInfoList.controls[0];

      for (const control of this.playerInfoList.controls) {
        // Удалить предыдущего победителя
        winnerControl.patchValue({winner: false, winnerResult: null});
        if (control.value?.result?.totalValue > winnerResult) {
          winnerResult = control.value?.result?.totalValue;
          winnerControl = control;
        }
      }

      winnerControl.patchValue({winner: true});
      this.gameForm.patchValue({winnerResult});
      this.winnerPlayer = winnerControl.value;
    }

  }

  addPlayerInfo($event: MouseEvent) {
    if (this.playerInfoList.length <= this.MAX_PLAYER) {
      this.playerInfoList.controls.push(this.newPlayerInfo());
    }
  }

  calcResult(control: AbstractControl) {
    // this.router.navigateByUrl('/gameboard');
    this.modalService.create({
      nzTitle: 'Calculate result',
      nzContent: GameboardComponent,
      nzComponentParams: {
        currentData: control.value.result
      },
      nzOnOk: (d) => {
        const result = Object.assign({}, this.gameResultService.currentPlayerResult);
        control.patchValue({result});
        this.checkResult();
        this.cdr.detectChanges();
        this.updateGameInfoById();
      }
    });
  }

  removePlayerInfo(i: any) {
    if (this.playerInfoList.length >= this.MIN_PLAYER) {
      this.playerInfoList.removeAt(i);
      this.reInitColorList();
    }
  }

  // Exclude choose color
  reInitColorList() {
    const colorTrainsCurrentList = Array(...this.playerInfoList.value)
      .filter(item => item?.player?.colorTrains)
      .map(item => item?.player?.colorTrains);
    this.listOfColorTrain = this.srcListOfColorTrain.filter(item => {
      return !colorTrainsCurrentList.includes(item.value);
    });
  }

  ngOnDestroy(): void {
  }

}
