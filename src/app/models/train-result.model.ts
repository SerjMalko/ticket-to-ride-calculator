import { TrainCarriageCountEnum } from 'src/app/models/enum/train-carriage-count.enum';

export interface TrainResultModel {
  trainSetting: TrainCarriageCountEnum;
  count: number;
  route?: {routeFrom, routeTo, id?};
}
