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
      gameId: ['']
    });
    this.initRouteParams();
    this.initGameInfo();
  }

  initRouteParams() {

    this.route.params.pipe(
      take(1),
      filter(data => data.id),
      switchMap((param) => {
        return this.gameService.getGameById(param.id).then((data: GameModel) => {
          this.gameForm.setValue(data);
          this.cdr.detectChanges();
        }).catch(err => {
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
    for (let i = 0; i < this.MIN_PLAYER; i++) {
      this.playerInfoList.push(this.newPlayerInfo());
    }
  }

  newPlayerInfo(): FormGroup {
    return this.fb.group({
      player: this.fb.group({
        colorTrains: ['', Validators.required],
        name: ['', Validators.required]
      }),
      result: undefined
    });
  }

  async submitGameForm() {
    if (this.gameForm.valid) {
      const gameSetting: GameModel = this.gameForm.value;
      const gameId = await this.gameService.startGame(gameSetting);
      this.gameForm.patchValue({gameId});
      await this.router.navigate(['/game-setting', {id: gameId}]);
    } else {
      this.gameForm.updateValueAndValidity();
      this.gameForm.markAllAsTouched();
      this.message.error('Fill all required fields');
      console.log('Invalid form ->', this.gameForm);
    }

  }

  finishGame() {
    if (this.gameForm.valid) {

      this.gameService.updateGameInfoById(this.gameForm.value.gameId, this.gameForm.value);
      this.router.navigateByUrl('/dashboard');
    } else {
      this.message.error('Fill results for players!');
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
      nzOnOk: (d) => {
        const result = Object.assign({}, this.gameResultService.currentPlayerResult);
        control.patchValue({result});
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
