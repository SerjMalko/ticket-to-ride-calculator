import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameboardComponent } from 'src/app/pages/gameboard/gameboard.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { StatusModule } from 'src/app/features/status/status.module';

const routes: Routes = [
  {
    path: '', component: GameboardComponent
  }
];


@NgModule({
  declarations: [GameboardComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        StatusModule
    ]
})
export class GameboardModule { }
