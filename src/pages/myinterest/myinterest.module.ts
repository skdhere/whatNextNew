import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyinterestPage } from './myinterest';

@NgModule({
  declarations: [
    MyinterestPage,
  ],
  imports: [
    IonicPageModule.forChild(MyinterestPage),
  ],
  exports: [
    MyinterestPage
  ]
})
export class MyinterestPageModule {}
