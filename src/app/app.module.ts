import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { SplashScreen} from "@ionic-native/splash-screen";
import { StatusBar} from "@ionic-native/status-bar";
import { BrowserModule } from '@angular/platform-browser';
import { GooglePlus } from '@ionic-native/google-plus';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { HttpModule } from '@angular/http';
import { Api } from '../providers/api';
import { IonicStorageModule } from '@ionic/storage';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Device } from '@ionic-native/device';
// import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot({
      name: '__whatNext',
      driverOrder: ['sqlite', 'indexeddb', 'websql']
    }),
    IonicModule.forRoot(MyApp, {
          platforms: {
            ios: {
              statusbarPadding: true
            },
            android: {
              statusbarPadding: true
            }
          },
          preloadModules: false
        })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    GooglePlus,
    StatusBar,
    SplashScreen,
    Facebook,
    NativeStorage,
    TwitterConnect,
    Storage,
    GoogleMaps,
    Api,
    Geolocation,
    BackgroundMode,
    Device
  ]
})
export class AppModule {}
