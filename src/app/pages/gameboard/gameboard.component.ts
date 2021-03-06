import { ChangeDetectionStrategy, Component, Input, OnInit, Optional } from '@angular/core';
import { TrainCarriageCountEnum } from 'src/app/models/enum/train-carriage-count.enum';
import { TrainResultModel } from 'src/app/models/train-result.model';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { TrainRouteModel } from 'src/app/models/train-route.model';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { GameResultService } from 'src/app/services/game-result.service';
import { PlayerResultModel } from 'src/app/models/player-result.model';

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameboardComponent implements OnInit {

  @Input() currentData: PlayerResultModel;

  private totalValueTrains$$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private totalCountUseCarriages$$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private totalValueRoutes$$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private totalValue$$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public trainsForm: FormGroup;
  public readonly MIN_ROUTE_COUNT: number;

  public isModalContent: boolean;

  constructor(private  fb: FormBuilder, @Optional() private modal: NzModalRef, private gameResultService: GameResultService, private messageService: NzMessageService) {
    this.MIN_ROUTE_COUNT = 2;
    this.isModalContent = !!modal;
  }

  ngOnInit(): void {

    this.trainsForm = this.fb.group({
      trains: this.fb.array(TrainCarriageCountEnum.ALL.map(data => (this.createItem(data)))),
      routes: this.fb.array([])
    });
    this.initTrainRoute();
    this.initTrainFormValueChanges();
    // After Subscribe to changes form

    this.restoreData();


    // Не используется, перешел на BehaviorSubject
    // this.totalValueRoutes$ = this.trainRoutes.valueChanges.pipe(map((data: Array<TrainRouteModel>) => {
    //   return data.reduce((total: number, current: TrainRouteModel) => {
    //     return total + current.resultValue * (!!current.status ? 1 : -1);
    //   }, 0);
    // }));
    //
    // this.totalValue$ = combineLatest(this.totalValueRoutes$, this.totalValueTrains$).pipe(map((data: Array<number>) => {
    //   return data[0] + data[1];
    // }));

  }

  restoreData() {
    if (this.currentData) {
      // Add routes
      for (let i = 0; i < this.currentData.routes.length - this.MIN_ROUTE_COUNT; i++) {
        this.addTrainRoute();
      }
      console.log('this.currentData ->', this.currentData);
      this.trainsForm.patchValue(this.currentData);
      this.calculateResultValues(this.currentData);
    }
  }

  initTrainFormValueChanges() {

    this.trainsForm.valueChanges.subscribe((dataGame: PlayerResultModel) => {
      this.calculateResultValues(dataGame);
    });
  }

  private calculateResultValues(dataGame: PlayerResultModel) {
    const dataTrainCarr: Array<TrainResultModel> = dataGame.trains;
    const totalValueTrains = dataTrainCarr.reduce((total: number, current: TrainResultModel) => {
      return total + current.count * current.trainSetting.value;
    }, 0);
    this.totalValueTrains$$.next(totalValueTrains);

    const totalCountUseCarriage = dataTrainCarr.reduce((total: number, current: TrainResultModel) => {
      return total + current.count * current.trainSetting.carriageCount;
    }, 0);
    this.totalCountUseCarriages$$.next(totalCountUseCarriage);

    const dataTrainRoute: Array<TrainRouteModel> = dataGame.routes;

    const totalValueRoutes = dataTrainRoute.reduce((total: number, current: TrainRouteModel) => {
      return total + current.resultValue * (!!current.status ? 1 : -1);
    }, 0);

    this.totalValueRoutes$$.next(totalValueRoutes);

    const totalValue = totalValueRoutes + totalValueTrains;
    this.totalValue$$.next(totalValue);

  }

  get totalValueTrains$(): Observable<number> {
    return this.totalValueTrains$$.asObservable();
  }

  get totalCountUseCarriages$(): Observable<number> {
    return this.totalCountUseCarriages$$.asObservable();
  }

  get totalValueRoutes$(): Observable<number> {
    return this.totalValueRoutes$$.asObservable();
  }

  get totalValue$(): Observable<number> {
    return this.totalValue$$.asObservable();
  }

  initTrainRoute() {
    for (let i = 0; i < this.MIN_ROUTE_COUNT; i++) {
      this.addTrainRoute();
    }
  }

  get trainRoutes(): FormArray {
    return this.trainsForm.get('routes') as FormArray;
  }

  get trainCarriageList(): FormArray {
    return this.trainsForm.get('trains') as FormArray;
  }

  newTrainRoute(): FormGroup {
    return this.fb.group({
      resultValue: ['', Validators.required],
      status: true
    });
  }

  submitTrainRouteForm() {
    console.log('this.trainsForm ->', this.trainsForm.value);
  }

  createItem(data: TrainCarriageCountEnum): FormGroup {
    return this.fb.group({
      count: 0,
      trainSetting: data
    });
  }

  removeTrain(train: AbstractControl, event: any) {
    train.patchValue({count: (--train.value.count)});
    event.stopPropagation();
  }

  addTrain(train: AbstractControl) {
    train.patchValue({count: ++train.value.count});
  }

  addTrainRoute(e?: MouseEvent): void {
    this.trainRoutes.push(this.newTrainRoute());
  }

  removeTrainRoute(i: number) {
    this.trainRoutes.removeAt(i);
  }

  destroyModal(): void {
    this.modal?.destroy();
  }

  submitModal(): void {
    this.trainsForm.updateValueAndValidity();
    this.trainsForm.markAllAsTouched();

    if ( this.trainsForm.valid) {
      this.gameResultService.currentPlayerResult = {
        ...this.trainsForm.value,
        totalCountUseCarriages: this.totalCountUseCarriages$$.value,
        totalValue: this.totalValue$$.value,
        totalValueRoutes: this.totalValueRoutes$$.value,
        totalValueTrains: this.totalValueTrains$$.value
      };

      this.modal.triggerOk();
      this.modal.destroy();
    } else {
      this.messageService.error('Fill required fields');
    }

  }

}
