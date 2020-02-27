import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PlayerModel } from 'src/app/models/player.model';
import { CarriageColorEnum } from 'src/app/models/enum/carriage-color.enum';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameSettingsComponent implements OnInit {

  player: PlayerModel;

  srcListOfColorTrain: Array<{ label: string, value: string }>;
  listOfColorTrain: Array<{ label: string, value: string }>;

  public gameForm: FormGroup;
  public readonly MIN_PLAYER: number = 3;
  public readonly MAX_PLAYER: number = 5;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.srcListOfColorTrain = CarriageColorEnum.ALL.map(data => ({value: data.colorHash, label: data.colorHash}));
    this.listOfColorTrain = [...this.srcListOfColorTrain];

    this.gameForm = this.fb.group({
      playerInfos: this.fb.array([])
    });
    this.initGameInfo();
  }

  get playerInfoList(): FormArray {
    return this.gameForm.get('playerInfos') as FormArray;
  }

  private initGameInfo() {
    for (let i = 0; i < this.MIN_PLAYER; i++) {
      this.playerInfoList.push(this.newPlayerInfo());
    }
  }

  newPlayerInfo(): FormGroup {
    return this.fb.group({
      player: this.fb.group({
        colorTrains: [],
        name: []
      }),
      result: undefined
    });
  }

  submitGameForm() {
    console.log('form ->', this.gameForm.value);
  }

  addPlayerInfo($event: MouseEvent) {
    if (this.playerInfoList.length <= this.MAX_PLAYER) {
      this.playerInfoList.controls.push(this.newPlayerInfo());
    }
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
    console.log('colorTrainsCurrentList ->', colorTrainsCurrentList);
    this.listOfColorTrain = this.srcListOfColorTrain.filter(item => {
      return !colorTrainsCurrentList.includes(item.value);
    });
  }
}
