import { Injectable } from '@angular/core';
import { PlayerResultModel } from 'src/app/models/player-result.model';

@Injectable({
  providedIn: 'root'
})
export class GameResultService {

  private _currentPlayerResult: PlayerResultModel;

  constructor() {
  }

  set currentPlayerResult(temp: PlayerResultModel) {
    this._currentPlayerResult = temp;
  }

  get currentPlayerResult() {
    return this._currentPlayerResult;
  }

  cleanCurrentPlayerResult() {
    this._currentPlayerResult = null;
  }
}
