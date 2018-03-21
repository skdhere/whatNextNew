import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Geolocation } from '@ionic-native/geolocation';
import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapOptions,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';
/**
 * Generated class for the GooglePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-google',
  templateUrl: 'google.html',
})
export class GooglePage {

  posts:any;
  locations:Array<any> = [];
  map: GoogleMap;

  current_lat:any;
  current_lng:any;

  constructor(public navCtrl: NavController,
              public http:Http,
              public navParams: NavParams, 
              public geolocation:Geolocation,
              public platform :Platform,
              private backgroundMode: BackgroundMode
              ) {


this.platform.ready().then(() => {
 
 	 this.backgroundMode.setDefaults({ 
        title:  'TheTitleOfYourProcess',
        text:   'Executing background tasks.'
    });
 	this.backgroundMode.enable();

 	if(this.backgroundMode.isActive()){
          alert();
    };

    this.geolocation.getCurrentPosition().then((resp) => {
       this.current_lat = resp.coords.latitude;
       this.current_lng = resp.coords.longitude;
       console.log(this.current_lat);
       this.loadPoint();
      
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  });

   
  }

  loadPoint()
  {
      let types =['train_station','restaurant','bar','atm','gym'];


     
       types.forEach(element => {
        console.log(this.current_lat+ " latitude");
        console.log(this.current_lng+ " longitude");

        this.http.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+this.current_lat+','+this.current_lng+'&radius=500&type='+element+'&key=%20AIzaSyBg1KqM98DIC8TA1ngpS3luuP1A-_aQsfg').map(res => res.json()).subscribe(data => {
            
              Object.keys(data.results).forEach(key=> {

                    let lat ={"lat":data.results[key]['geometry']['location'].lat,"lng":data.results[key]['geometry']['location'].lng,'type':element,'name':data.results[key]['name'],'icon':data.results[key]['icon']};

                    this.locations.push(lat);
                });
        });

        });
     
     console.log(this.locations);

     this.loadMap();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad GooglePage');
    // this.loadPoint();
  }

  ngAfterViewInit() {
      this.platform.ready().then(() => {
        // this.loadMap();
      });
    }

  loadMap() {

    console.log(this.current_lat);
    console.log(this.current_lng);

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.current_lat,
          lng: this.current_lng
        },
        zoom: 18,
        tilt: 30
      }
    };
   
    this.map = GoogleMaps.create('map_canvas', mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {console.log('Map is ready!')});
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');
        this.showLocations();
        
      });
  }

  showLocations()
  {
      for(let k=1 ;k<this.locations.length;k++){
        let image = {
            url: this.locations[k].icon,
            size: {
              width: 20,
              height: 20
            }
          };

        let loc = this.locations[k];
        console.log(loc);
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
          console.log("456");
          marker.on(GoogleMapsEvent.MARKER_CLICK)
            .subscribe(() => {
              alert('clicked');
            });
        });
    }
  }

}
