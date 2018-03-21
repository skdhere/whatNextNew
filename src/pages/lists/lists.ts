import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import { Api} from "../../providers/api";
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the ListsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-lists',
  templateUrl: 'lists.html',
})
export class ListsPage {

  current_lat:any;
  current_lng:any;
  locations:Array<any> = [];

  constructor(public navCtrl: NavController,
              public http:Http,
              public navParams: NavParams, 
              public geolocation:Geolocation,
              public platform :Platform,
              public api: Api) {

		this.platform.ready().then(() => {
	     
	     	 this.geolocation.getCurrentPosition().then((resp) => {
	           this.current_lat = resp.coords.latitude;
	           this.current_lng = resp.coords.longitude;
	           this.loadPoint();
	          
	        }).catch((error) => {
	          console.log('Error getting location', error);
	        });
	    });
  }

  loadPoint()
  {
      let types =['train_station','restaurant','bar','atm','gym'];
      console.log(types);
      types.forEach(element => {
          this.http.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+this.current_lat+','+this.current_lng+'&radius=500&type='+element+'&key=%20AIzaSyBg1KqM98DIC8TA1ngpS3luuP1A-_aQsfg').map(res => res.json()).subscribe(data => {
              
                Object.keys(data.results).forEach(key=> {

                      let lat ={"lat":data.results[key]['geometry']['location'].lat,"lng":data.results[key]['geometry']['location'].lng,'type':element,'name':data.results[key]['name'],'icon':data.results[key]['icon']};

                      this.locations.push(lat);
                  });
          });
        });

      console.log(this.locations);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListsPage');
  }

}
