import { RouteModel } from 'src/app/models/route.model';

export class TrainRouteModel {
  id: number;
  controlInstance: string;
  routeInfo: RouteModel;
  // Пройден маршрут или нет
  status: boolean;
  resultValue: number;
}
