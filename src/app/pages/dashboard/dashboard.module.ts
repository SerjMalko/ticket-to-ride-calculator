import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';

const routes: Routes = [
  {
    path: '', component: DashboardComponent
  }
];

@NgModule({
  declarations: [DashboardComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        NgZorroAntdModule
    ]
})
export class DashboardModule { }
