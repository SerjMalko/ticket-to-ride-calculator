import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSettingsComponent } from 'src/app/pages/game-settings/game-settings.component';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '', component: GameSettingsComponent
  }
];


@NgModule({
  declarations: [GameSettingsComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgZorroAntdModule,
    ReactiveFormsModule
  ]
})
export class GameSettingsModule { }
