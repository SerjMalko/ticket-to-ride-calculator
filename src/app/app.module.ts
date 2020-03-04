import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import { NZ_I18N, ru_RU } from 'ng-zorro-antd';
import ru from '@angular/common/locales/ru';
import { CoreModule } from 'src/app/features/core/core.module';

registerLocaleData(ru);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
   CoreModule
  ],
  providers: [{provide: NZ_I18N, useValue: ru_RU}],
  bootstrap: [AppComponent]
})
export class AppModule {}
