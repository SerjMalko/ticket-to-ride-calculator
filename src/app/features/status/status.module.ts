import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusComponent } from './status.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';



@NgModule({
  declarations: [StatusComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule
  ], exports : [StatusComponent]
})
export class StatusModule { }
