import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform ,ActionSheetController, LoadingController } from 'ionic-angular';
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
  types:Array<any> = [];
  loading:any;
  constructor(public navCtrl: NavController,
              public http:Http,
              public navParams: NavParams, 
              public geolocation:Geolocation,
              public platform :Platform,
              public api: Api,
              public actionSheet:ActionSheetController,
              public loadingCtrl :LoadingController) {
  	this.current_lat ="19.019552";
  	this.current_lng ="72.8382497";
    // this.loadPoint();
         

		this.platform.ready().then(() => {
         this.getInterest();
	     	 this.geolocation.getCurrentPosition().then((resp) => {
	           this.current_lat = resp.coords.latitude;
	           this.current_lng = resp.coords.longitude;
             this.getInterest();
	        }).catch((error) => {
	          console.log('Error getting location', error);
	        });
	    });
  }

  getLoader()
  {
    let loading = this.loadingCtrl.create({
      content:"Please Wait..."
    });
    return loading;
  }



  viewList(name)
  {
    this.loading = this.getLoader();
    this.loading.present();

  	let actionSheet = this.actionSheet.create({
     title: name,
     buttons: [
       {
         text: 'Create Circle',
         role: 'destructive',
         handler: () => {
           console.log('Destructive clicked');
         }
       },
       {
         text: 'Join Circle',
         handler: () => {
           console.log('Archive clicked');
         }
       },
       {
         text: 'Share',
         handler: () => {
           console.log('Archive clicked');
         }
       },
       {
         text: 'Cancel',
         role: 'cancel',
         handler: () => {
           console.log('Cancel clicked');
         }
       }
     ]
   });

   actionSheet.present();
   this.loading.dismiss();
  }
  
  getInterest()
  {
    this.loading = this.getLoader();
    this.loading.present();
    //==============Start Api=========================//
        this.api.post('getUserInterest','')
          .map(res => res.json())
          .subscribe( data => {
              //store data in storage
              this.types = data.data;
              this.loadPoint();
          }, error => {
        });
    this.loading.dismiss();
        //==============End Api=========================//
  }

  loadPoint()
  {
      let types =this.types;
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
      this.loading.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListsPage');
  }

}
