import {
    Component
} from '@angular/core';
import {
    Facebook
} from '@ionic-native/facebook';
import {
    NativeStorage
} from '@ionic-native/native-storage';
import {
    NavController,
    LoadingController,
    IonicPage
} from 'ionic-angular';
import {
    GooglePlus
} from '@ionic-native/google-plus';
import {
    TwitterConnect
} from '@ionic-native/twitter-connect';
import {
    Storage
} from '@ionic/storage';
import {
    Api
} from "../../providers/api";
import {
    Observable
} from 'rxjs/Observable';
import {
    Device
} from '@ionic-native/device';
import { 
    UserProvider
} from '../../providers/user';
@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    FB_APP_ID: number = 725261520963213;
    token: any;
    constructor(
        public navCtrl: NavController,
        public fb: Facebook,
        public loadingCtrl: LoadingController,
        public nativeStorage: NativeStorage,
        public googlePlus: GooglePlus,
        public tw: TwitterConnect,
        public storage: Storage,
        public api: Api,
        public device: Device,
        public currentUser: UserProvider
    ) {

        this.fb.browserInit(this.FB_APP_ID, "v2.8");
    }

    doFbLogin() {

        let loading = this.loadingCtrl.create({
            content: 'Please Wait...'
        });

        let permissions = new Array < string > ();
        let nav = this.navCtrl;

        //the permissions your facebook app needs from the user
        permissions = ["public_profile"];

        this.fb.login(permissions)
            .then((response) => {
                let userId = response.authResponse.userID;
                let params = new Array < string > ();

                //Getting name and gender properties
                this.fb.api("/me?fields=name,gender,email", params)
                    .then((user) => {
                        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
                        user.loginFlag = "facebook";
                        let device = this.device;
                        let dev = {
                            "uuid": device.cordova,
                            "isVirtual": device.isVirtual
                        };

                        user.device_info = this.device;
                        user.username = user.name;
                        this.token = '';
                        user.fb_id = user.id;

                        this.nativeStorage.setItem('user', {
                                name: user.name,
                                gender: user.gender,
                                picture: user.picture,
                                loginFlag: 'facebook',
                                token: this.token
                            })
                            .then(() => {
                                // nav.push('InterestpagePage');
                            }, (error) => {

                            })

                        this.api.post('login', user)
                            .map(res => res.json())
                            .subscribe(data => {
                                //store data in storage
                                console.log("=============");
                                console.log(data);
                                console.log("=============");


                                if (data.success == true) {

                                    this.token = data.data.token;

                                    this.nativeStorage.setItem('user', {
                                            name: user.name,
                                            gender: user.gender,
                                            picture: user.picture,
                                            loginFlag: 'facebook',
                                            token: this.token
                                        })
                                        .then(() => {
                                            this.currentUser.setUser(
                                                user.name,
                                                data.data.token,
                                                data.data.token
                                            );

                                            setTimeout(() => {
                                                this.setRoot();
                                            }, 100);
                                        }, (error) => {
                                            console.log(error);
                                        })
                                } else {

                                }
                            }, error => {

                            });
                    })
            }, (error) => {
                console.log(error);
            });

            loading.dismiss();
    }

    setRoot() {
        console.log("setRoot Called");
        //==============Start Api=========================//
        this.api.post('checkUserInterest', '')
            .map(res => res.json())
            .subscribe(data => {
                console.log(data);
                //store data in storage
                console.log(data + '=x==d');
                if (data.success == true) {
                    this.navCtrl.setRoot('GooglePage');
                } else {
                    this.navCtrl.setRoot('InterestpagePage');
                }
            }, error => {});
        //==============End Api=========================//
    }


    doGoogleLogin() {
        let nav = this.navCtrl;
        let env = this;
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();

        this.googlePlus.getSigningCertificateFingerprint().then(function(fin)
            {
                console.log(fin);
       });

        this.googlePlus.login({
                'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
                'webClientId': '501002503984-17f8oelmlj3vg42n7rq81g041hob91v9.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
                'offline': true
            })
            .then(user => {

                console.log(user);
                nav.push('InterestpagePage');
                loading.dismiss();
                console.log(user);
                env.nativeStorage.setItem('user', {
                        name: user.displayName,
                        email: user.email,
                        picture: user.imageUrl,
                        gplus_id: '3',
                        loginFlag: 'google'
                    })
                    .then(function() {
                        this.setRoot();
                    }, function(error) {
                        console.log(error);
                    })
            }, error => {
                console.log(error);
                loading.dismiss();
            }).catch(err => console.error(err));;
    }

    doTwLogin() {
        let nav = this.navCtrl;
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();
        let env = this;
        //Request for login
        this.tw.login().then(function(result) {
            //Get user data
            env.tw.showUser().then(function(user) {
                //Save the user data in NativeStorage
                env.nativeStorage.setItem('user', {
                    name: user.name,
                    userName: user.screen_name,
                    followers: user.followers_count,
                    picture: user.profile_image_url_https,
                    loginFlag: 'twitter'
                }).then(function() {
                    nav.push('InterestpagePage');
                    loading.dismiss();
                })
            }, function(error) {
                loading.dismiss();
            });
        });
    }
}