import {
    Component,
    ViewChild
} from '@angular/core';
import {
    Platform,
    Nav,
    LoadingController,
    AlertController 
} from 'ionic-angular';
import {
    NativeStorage
} from '@ionic-native/native-storage';
import {
    Storage
} from '@ionic/storage';
import {
    SplashScreen
} from "@ionic-native/splash-screen";
import {
    StatusBar
} from "@ionic-native/status-bar";
import {
    Api
} from "../providers/api";
import {
    UserProvider
} from "../providers/user";
import { Diagnostic } from '@ionic-native/diagnostic';
import { Network } from '@ionic-native/network';
// template: 'app.html'
@Component({
    templateUrl: 'app.html'
})
export class MyApp {

    @ViewChild(Nav) nav: Nav;
    rootPage: any;
    pages: Array < {
        title: string,
        component: any,
        icon: string
    } > ;
    username:string;
    constructor(
        platform: Platform,
        public nativeStorage: NativeStorage,
        public splashScreen: SplashScreen,
        public statusBar: StatusBar,
        public api: Api,
        public loadingCtrl:LoadingController,
        public currentUser : UserProvider,
        public diagnostic: Diagnostic,
        public alertCtrl :AlertController,
        public network : Network 
    ) {
        platform.ready().then(() => {

            this.username = this.currentUser.name;
            
            setTimeout(() => {
                statusBar.overlaysWebView(true);
                statusBar.overlaysWebView(false);
                statusBar.overlaysWebView(true);
                statusBar.backgroundColorByHexString("#33000000");
            }, 400);


            let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
              let alert = this.alertCtrl.create({
                title: 'Internet is not available',
                message: 'Please turn on the data connection!',
                buttons: [
                  {
                    text: 'Ok',
                    handler: () => {
                      this.diagnostic.switchToSettings();
                    }
                  }
                ]
              });
              alert.present();
            });
            
            // Here we will check if the user is already logged in

            // because we don't want to ask users to log in each time they open the app
            this.nativeStorage.getItem('user')
                .then((user_data) => {
                    console.log(user_data);
                    //==============Start Api=========================//
                    this.api.post('checkUserInterest', '')
                        .map(res => res.json())
                        .subscribe(data => {

                            console.log('New Token : '+user_data.token);
                            this.currentUser.setUser(
                                user_data.name,
                                user_data.token,
                                user_data.token
                            );

                            if (data.success == true) {
                                this.nav.setRoot('GooglePage');
                            } else {
                                this.nav.setRoot('InterestpagePage');
                            }
                        }, error => {
                              this.nav.setRoot('GooglePage');
                        });
                    //==============End Api=========================//
                    this.splashScreen.hide();
                }, (error) => {
                    //we don't have the user data so we will ask him to log in
                    this.nav.setRoot('LoginPage');
                    this.splashScreen.hide();
                });
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });

        this.pages = [{
                title: 'Home',
                component: 'GooglePage',
                icon: 'home'
            },
            {
                title: 'My Interest',
                component: 'MyinterestPage',
                icon: 'ios-heart'
            },
            // { title: 'Help',       component: 'SlidesPage',    icon: 'help-buoy'},
        ];
    }


    logOut() {

        let loading = this.getLoader();
        loading.present();
        this.nativeStorage.remove('user');
        this.nativeStorage.clear();
        setTimeout(()=>{

                this.nav.setRoot('LoginPage');
                loading.dismiss();
        },300)
    }

    openPage(p) {
        if (p.component == "GooglePage") {
            this.nav.setRoot('GooglePage');
        } else {

            this.nav.push(p.component);
        }

    }

    getLoader()
    {
        let loading = this.loadingCtrl.create({
            content:"Please Wail..."
        })

        return loading;
    }

}