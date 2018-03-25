import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Storage } from '@ionic/storage';
import { SplashScreen} from "@ionic-native/splash-screen";
import { StatusBar} from "@ionic-native/status-bar";
import { Api} from "../providers/api";
// template: 'app.html'
@Component({
 templateUrl: 'app.html'
 })
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  pages: Array<{title: string, component: any, icon:string}>;

  constructor(
    platform: Platform,
    public nativeStorage: NativeStorage,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public api:Api
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
        
        //==============Start Api=========================//
        this.api.post('checkUserInterest','')
          .map(res => res.json())
          .subscribe( data => {
              //store data in storage
              if (data.success == true) {
                this.nav.push('GooglePage');
              }
              else{
                this.nav.push('InterestpagePage');
              }
          }, error => {
        });
        //==============End Api=========================//
        
        this.splashScreen.hide();
      }, (error) => {
        //we don't have the user data so we will ask him to log in
        this.nav.push('LoginPage');
        this.splashScreen.hide();
      });

      this.statusBar.styleDefault();

      

    });

     this.pages = [
            { title: 'Home',       component: 'HomePage',      icon: 'home'},
            { title: 'My Interest', component: 'MyinterestPage',   icon: 'ios-heart'},
            // { title: 'Help',       component: 'SlidesPage',    icon: 'help-buoy'},
        ];
  }


 logOut()
 {
   this.nativeStorage.remove('user');
   this.nav.setRoot('LoginPage');
 }

}
