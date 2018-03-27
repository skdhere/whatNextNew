import {
    Component
} from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams,
    Platform,
    MenuController,
    LoadingController
} from 'ionic-angular';
import {
    NativeStorage
} from '@ionic-native/native-storage';
import {
    Http,
    Response
} from '@angular/http';
import 'rxjs/add/operator/map';
import {
    Api
} from "../../providers/api";
import {
    Geolocation
} from '@ionic-native/geolocation';
import {
    BackgroundMode
} from '@ionic-native/background-mode';
import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapOptions,
    CameraPosition,
    MarkerOptions,
    Marker
} from '@ionic-native/google-maps';
import { 
    UserProvider
} from '../../providers/user';

@IonicPage()
@Component({
    selector: 'page-google',
    templateUrl: 'google.html',
})
export class GooglePage {

    posts: any;
    locations: Array < any > = [];
    map: GoogleMap;

    current_lat: any;
    current_lng: any;
    loading:any;

    constructor(public navCtrl: NavController,
        public http: Http,
        public navParams: NavParams,
        public geolocation: Geolocation,
        public platform: Platform,
        private backgroundMode: BackgroundMode,
        public api: Api,
        public menu: MenuController,
        public loadingCtrl :LoadingController,
        public currentUser: UserProvider,
        public nativeStorage: NativeStorage
    ) {
         this.nativeStorage.getItem('user')
                .then((user_data) => {
                    console.log(user_data);
                    this.currentUser.setUser(
                        user_data.name,
                        user_data.token,
                        user_data.token
                    );

                },err=>{});
         this.getLocation();
    }

    getLoader()
    {
      let loading = this.loadingCtrl.create({
            content: 'Please Wait...'
        });
      return loading;
    }

    ionViewDidEnter() {
        this.map = null;
        console.log('Did enter called');
        setTimeout(() => {
            // this.getLocation();
        }, 100);
    }

    getLocation() {

        this.loading = this.getLoader();
        this.loading.present();
        console.log('getLocation called');
        this.geolocation.getCurrentPosition().then((resp) => {
            this.current_lat = resp.coords.latitude;
            this.current_lng = resp.coords.longitude;
            this.loadPoint();

        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }

    goToList() {
        this.navCtrl.push('ListsPage', {
            "lat": this.current_lat,
            "lng": this.current_lat
        });
    }

    loadPoint() {
        console.log('loadPoint called');
        let types = ['train_station', 'restaurant', 'bar', 'atm', 'gym'];
        types.forEach(element => {
            this.http.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + this.current_lat + ',' + this.current_lng + '&radius=500&type=' + element + '&key=%20AIzaSyBg1KqM98DIC8TA1ngpS3luuP1A-_aQsfg').map(res => res.json()).subscribe(data => {

                Object.keys(data.results).forEach(key => {

                    let lat = {
                        "lat": data.results[key]['geometry']['location'].lat,
                        "lng": data.results[key]['geometry']['location'].lng,
                        'type': element,
                        'name': data.results[key]['name'],
                        'icon': data.results[key]['icon']
                    };

                    this.locations.push(lat);
                });
            });
        });
        this.loadMap();
    }

    loadMap() {
        console.log('loadMap called');
        let mapOptions: GoogleMapOptions = {
            camera: {
                target: {
                    lat: this.current_lat,
                    lng: this.current_lng
                },
                zoom: 18,
                tilt: 30
            },
            gestures: {
                rotate: false,
                tilt: false,
                scroll: false
            }
        };
        this.map = GoogleMaps.create('map_canvas', mapOptions);
        this.map.setVisible(true);
        
        // Wait the MAP_READY before using any methods.
        this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
            console.log('Map is ready!')
            this.showLocations();
        }, err => {
            console.log(err);
        });

        
       setTimeout(() => {
            this.loading.dismiss();
        },500);
    }

    showLocations() {
        for (let k = 1; k < this.locations.length; k++) {
            let image = {
                url: this.locations[k].icon,
                size: {
                    width: 20,
                    height: 20
                }
            };

            let loc = this.locations[k];

            this.map.addMarker({
                    title: loc.name,
                    icon: image,
                    animation: 'DROP',
                    position: {
                        lat: loc.lat,
                        lng: loc.lng
                    }
            })
            .then(marker => {

                marker.on(GoogleMapsEvent.MARKER_CLICK)
                    .subscribe(() => {
                        // alert('clicked');
                    });
            });
        }
    }

}