import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TrainCarriageCountEnum } from 'src/app/models/enum/train-carriage-count.enum';
import { TrainResultModel } from 'src/app/models/train-result.model';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TrainRouteModel } from 'src/app/models/train-route.model';

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameboardComponent implements OnInit {
  totalValueTrains$: Observable<number>;
  totalCountUseCarriages$: Observable<number>;
  totalValueRoutes$: Observable<number>;
  totalValue$: Observable<number>;
  public trainsForm: FormGroup;

  private readonly MIN_ROUTE_COUNT: number;

  constructor(private  fb: FormBuilder) {
    this.MIN_ROUTE_COUNT = 2;
  }

  ngOnInit(): void {
        // Min
    this.trainsForm = this.fb.group({
      trains: this.fb.array(TrainCarriageCountEnum.ALL.map(data => (this.createItem(data)))),
      routes: this.fb.array([])
    });
    this.initTrainRoute();

    this.totalValueTrains$ = this.trainCarriageList.valueChanges.pipe(map((data: Array<TrainResultModel>) => {
      return data.reduce((total: number, current: TrainResultModel) => {
        return total + current.count * current.trainSetting.value;
      }, 0);
    }));
    this.totalCountUseCarriages$ = this.trainCarriageList.valueChanges.pipe(map((data: Array<TrainResultModel>) => {
      return data.reduce((total: number, current: TrainResultModel) => {
        return total + current.count * current.trainSetting.carriageCount;
      }, 0);
    }));

    this.totalValueRoutes$ = this.trainRoutes.valueChanges.pipe(map((data: Array<TrainRouteModel>) => {
      return data.reduce((total: number, current: TrainRouteModel) => {
        return total + current.resultValue * (!!current.status ? 1 : -1);
      }, 0);
    }));

    this.totalValue$ = combineLatest(this.totalValueRoutes$, this.totalValueTrains$).pipe(map((data: Array<number>) => {
      return data[0] + data[1];
    }));

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
      resultValue: null,
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

  addTrain(train: AbstractControl) {
    train.patchValue({count: ++train.value.count});
  }

  addTrainRoute(e?: MouseEvent): void {
    this.trainRoutes.push(this.newTrainRoute());
  }

  removeTrainRoute(i: number) {
    this.trainRoutes.removeAt(i);
  }

}
