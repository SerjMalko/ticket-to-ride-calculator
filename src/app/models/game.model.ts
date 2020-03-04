import { GeneralDataModel } from 'src/app/models/general-data.model';
import { PlayerGameItemModel } from 'src/app/models/player-game-item.model';
import { GameStatusEnum } from 'src/app/models/enum/game-status.enum';
import { GameStatusType } from 'src/app/models/type/game-status.type';

export interface GameModel extends GeneralDataModel {
  playerInfos: Array<PlayerGameItemModel>;
  id: string;
  winnerResult: number;
  status: GameStatusType;
}
