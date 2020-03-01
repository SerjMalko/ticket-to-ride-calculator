import { TrainResultModel } from 'src/app/models/train-result.model';
import { TrainRouteModel } from 'src/app/models/train-route.model';

export class PlayerResultModel {
  trains: Array<TrainResultModel>;
  routes: Array<TrainRouteModel>;

  totalValueTrains: number;
  totalCountUseCarriages: number;
  totalValueRoutes: number;
  totalValue: number;

}
