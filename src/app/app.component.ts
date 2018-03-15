import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Storage } from '@ionic/storage';
import { SplashScreen} from "@ionic-native/splash-screen";
import { StatusBar} from "@ionic-native/status-bar";
// template: 'app.html'
@Component({
 template: `<ion-nav [root]="rootPage"></ion-nav>`
 })
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage: any;

  constructor(
    platform: Platform,
    public nativeStorage: NativeStorage,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar
  ) {
    platform.ready().then(() => {

      statusBar.overlaysWebView(true);
      statusBar.overlaysWebView(false);
      statusBar.overlaysWebView(true);
      statusBar.backgroundColorByHexString("#33000000");
      // Here we will check if the user is already logged in
      // because we don't want to ask users to log in each time they open the app
      this.nativeStorage.getItem('user')
      .then( (data) => {
        // user is previously logged and we have his data
        // we will let him access the app
        this.nav.setRoot('InterestpagePage');
        this.splashScreen.hide();
      }, (error) => {
        //we don't have the user data so we will ask him to log in
        this.nav.setRoot('LoginPage');
        this.splashScreen.hide();
      });

      this.statusBar.styleDefault();
    });
  }
}
