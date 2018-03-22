import { Component } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { NavController, LoadingController, IonicPage } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { Storage } from '@ionic/storage';
import { Api} from "../../providers/api";
import { Observable } from 'rxjs/Observable';
import { Device } from '@ionic-native/device';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    FB_APP_ID: number = 725261520963213;
    token : any;
    constructor(
        public navCtrl: NavController,
        public fb: Facebook,
        public loadingCtrl: LoadingController,
        public nativeStorage: NativeStorage,
        public googlePlus: GooglePlus,
        public tw: TwitterConnect,
        public storage:Storage,
        public api:Api,
        public device:Device
        ) {
        this.fb.browserInit(this.FB_APP_ID, "v2.8");
    }

    doFbLogin(){
        let permissions = new Array<string>();
        let nav = this.navCtrl;

        //the permissions your facebook app needs from the user
        permissions = ["public_profile"];

        this.fb.login(permissions)
        .then((response) => {
            let userId = response.authResponse.userID;
            let params = new Array<string>();

        //Getting name and gender properties
        this.fb.api("/me?fields=name,gender,email", params)
                .then((user) => {


                    user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
                   

                    user.loginFlag   = "facebook";
                    user.device_info = this.device;

                   this.token = '';
                   this.nativeStorage.setItem('user',
                    {
                        name: user.name,
                        gender: user.gender,
                        picture: user.picture,
                        loginFlag: 'facebook',
                        token :this.token
                    })
                    .then(() => {
                        // nav.push('InterestpagePage');
                    },(error) => {
                        
                    })
                    // nav.push('InterestpagePage');
                     console.log("=============");
                     console.log(user);
                     console.log("=============");
                     
                    this.api.post('login',user)
                    .map(res => res.json())
                    .subscribe( data => {
                        //store data in storage
                        console.log("=============");
                        console.log(data);
                        console.log("=============");


                        if (data.success == true) {

                           this.token = data.data['token'];
                           this.nativeStorage.setItem('user',
                            {
                                name: user.name,
                                gender: user.gender,
                                picture: user.picture,
                                loginFlag: 'facebook',
                                token :this.token
                            })
                            .then(() => {
                                nav.push('InterestpagePage');
                            },(error) => {
                                console.log(error);
                            })

                            // nav.push('InterestpagePage');
                        }
                        else{
                          
                        }
                    }, error => {
                     
                    });


                    // nav.push('InterestpagePage');
                    //now we have the users info, let's save it in the NativeStorage
                        
                })
                }, (error) => {
                    console.log(error);
                });
    }

    doGoogleLogin(){
        let nav = this.navCtrl;
        let env = this;
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();

        console.log("4562");
        this.googlePlus.login({
            'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
            'webClientId': '501002503984-17f8oelmlj3vg42n7rq81g041hob91v9.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
            'offline': true
        })
        .then(user=> {

             console.log(user);
             nav.push('InterestpagePage');
            loading.dismiss();
            console.log(user);
            env.nativeStorage.setItem('user', {
                name: user.displayName,
                email: user.email,
                picture: user.imageUrl,
                gplus_id:'3',
                loginFlag: 'google'
            })
            .then(function(){
                nav.push('InterestpagePage');
            }, function (error) {
                console.log(error);
            })
        }, error=> {
            loading.dismiss();
        });
    }

    doTwLogin(){
        let nav = this.navCtrl;
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();
        let env = this;
        //Request for login
        this.tw.login().then(function(result) {
            //Get user data
            env.tw.showUser().then(function(user)
            {
                //Save the user data in NativeStorage
                env.nativeStorage.setItem('user',
                {
                    name: user.name,
                    userName: user.screen_name,
                    followers: user.followers_count,
                    picture: user.profile_image_url_https,
                    loginFlag: 'twitter'
                }).then(function() 
                {
                    nav.push('InterestpagePage');
                    loading.dismiss();
                })
            }, function(error)
            {
                loading.dismiss();
            });
        });
    }
}
