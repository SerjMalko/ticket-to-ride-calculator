import { PlayerModel } from 'src/app/models/player.model';
import { PlayerResultModel } from 'src/app/models/player-result.model';

export interface PlayerGameItemModel {
  player: PlayerModel;
  result: PlayerResultModel;
  winner: boolean;
}
