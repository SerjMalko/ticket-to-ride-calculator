import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule, registerLocaleData } from '@angular/common';
import { IconsProviderModule } from './icons-provider.module';
import { NgZorroAntdModule, NZ_I18N, ru_RU } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import ru from '@angular/common/locales/ru';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

const configFirebaseConnection = {
  apiKey: 'AIzaSyA0NO4k_DIuZtfcKaNWhFAMOZBmPHtSFQE',
  authDomain: 'ticket-to-ride-calculator-one.firebaseapp.com',
  databaseURL: 'https://ticket-to-ride-calculator-one.firebaseio.com',
  projectId: 'ticket-to-ride-calculator-one',
  storageBucket: 'ticket-to-ride-calculator-one.appspot.com',
  messagingSenderId: '787432680256'
};

registerLocaleData(ru);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AngularFireModule.initializeApp(configFirebaseConnection),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    IconsProviderModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [{provide: NZ_I18N, useValue: ru_RU}],
  bootstrap: [AppComponent]
})
export class AppModule {}
