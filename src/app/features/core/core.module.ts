import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const configFirebaseConnection = {
  apiKey: 'AIzaSyA0NO4k_DIuZtfcKaNWhFAMOZBmPHtSFQE',
  authDomain: 'ticket-to-ride-calculator-one.firebaseapp.com',
  databaseURL: 'https://ticket-to-ride-calculator-one.firebaseio.com',
  projectId: 'ticket-to-ride-calculator-one',
  storageBucket: 'ticket-to-ride-calculator-one.appspot.com',
  messagingSenderId: '787432680256'
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
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
  exports: [
    AngularFireModule,
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
  ]
})
export class CoreModule {}
