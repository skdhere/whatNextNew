import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMoreIntPage } from './add-more-int';

@NgModule({
  declarations: [
    AddMoreIntPage,
  ],
  imports: [
    IonicPageModule.forChild(AddMoreIntPage),
  ],
  exports: [
    AddMoreIntPage
  ]
})
export class AddMoreIntPageModule {}
