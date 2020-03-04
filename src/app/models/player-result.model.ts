import { TrainResultModel } from 'src/app/models/train-result.model';
import { TrainRouteModel } from 'src/app/models/train-route.model';
import { GeneralDataModel } from 'src/app/models/general-data.model';

export interface PlayerResultModel extends GeneralDataModel {
  trains: Array<TrainResultModel>;
  routes: Array<TrainRouteModel>;

  totalValueTrains: number;
  totalCountUseCarriages: number;
  totalValueRoutes: number;
  totalValue: number;

}
