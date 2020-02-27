import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { Router, RouterModule, Routes } from '@angular/router';
import { GameSettingsComponent } from 'src/app/pages/game-settings/game-settings.component';


const routes: Routes = [
  {
    path: '', component: GameSettingsComponent
  }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class DashboardModule { }
