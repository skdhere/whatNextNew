import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import { Api} from "../../providers/api";
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
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
              private backgroundMode: BackgroundMode,
              public api: Api
              ) {


this.platform.ready().then(() => {
 
 	 this.backgroundMode.setDefaults({ 
        title:  'TheTitleOfYourProcess',
        text:   'Executing background tasks.'
    });
 	this.backgroundMode.enable();

   this.backgroundMode.on("activate").subscribe(()=>{
       //==============Start Api=========================//
      // this.api.post('test', {"data":2})
      //     .map(res => res.json())
      //     .subscribe( data => {
      //         //store data in storage
      //         console.log(data);
      //     }, error => {
      //   });
         //==============End Api=========================//
         // this.demo();
    });
    
 
 	if(this.backgroundMode.isActive()){
     //==============Start Api=========================//
    this.api.post('test', {"data":2})
        .map(res => res.json())
        .subscribe( data => {
            //store data in storage
            console.log(data);
        }, error => {
      });

       //==============End Api=========================//
    };

    this.geolocation.getCurrentPosition().then((resp) => {
       this.current_lat = resp.coords.latitude;
       this.current_lng = resp.coords.longitude;
       this.loadPoint();
      
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  });

   
  }

  demo()
  {

    //==============Start Api=========================//
    // this.api.post('test', {"data":2})
    //     .map(res => res.json())
    //     .subscribe( data => {
    //         //store data in storage
    //         console.log(data);
    //     }, error => {
    //   });
     //==============End Api=========================//
     setTimeout(() => {
        // this.navCtrl.popToRoot();
        // might try this instead
        this.demo();
    }, 300);
  }

  goToList()
  {
    this.navCtrl.push('ListsPage',{"lat":this.current_lat,"lng":this.current_lat});
  }

  loadPoint()
  {
      let types =['train_station','restaurant','bar','atm','gym'];
      types.forEach(element => {
          this.http.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+this.current_lat+','+this.current_lng+'&radius=500&type='+element+'&key=%20AIzaSyBg1KqM98DIC8TA1ngpS3luuP1A-_aQsfg').map(res => res.json()).subscribe(data => {
              
                Object.keys(data.results).forEach(key=> {

                      let lat ={"lat":data.results[key]['geometry']['location'].lat,"lng":data.results[key]['geometry']['location'].lng,'type':element,'name':data.results[key]['name'],'icon':data.results[key]['icon']};

                      this.locations.push(lat);
                  });
          });
        });
    this.loadMap();
  }


  ionViewDidLoad() {
  }

  ngAfterViewInit() {
      this.platform.ready().then(() => {
        // this.loadMap();
      });
    }

  loadMap() {

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.current_lat,
          lng: this.current_lng
        },
        zoom: 18,
        tilt: 30
      },
      gestures:{
        rotate:false,
        tilt:false,
        scroll:false
      }
    };
   
    this.map = GoogleMaps.create('map_canvas', mapOptions);
    this.map.setVisible(true);
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
