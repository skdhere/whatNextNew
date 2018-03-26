import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Storage } from '@ionic/storage';
import { Api} from "../../providers/api";
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
/**
 * Generated class for the MyinterestPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-myinterest',
  templateUrl: 'myinterest.html',
})
export class MyinterestPage {

  interests:Array<any>=[];
 
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:Api,
    public storage :Storage, public nativeStorage: NativeStorage, public loadingCtrl :LoadingController) {
}

  getLoader()
  {
      let loading = this.loadingCtrl.create({
            content: 'Please Wait...'
        });

      return loading;
  }

  loadData()
  {
    this.interests = [];
    let loading = this.getLoader();
    loading.present();
  	//==============Start Api=========================//
  	this.api.post('getUserInterestDetail','')
        .map(res => res.json())
        .subscribe( data => {
            //store data in storage
            console.log(data);
            if (data.success == true) {

               let new_data = data.data;
               for(let i=0;i<new_data.length;i++)
               {
               	console.log(new_data[i]['name']);
               	 let int = {"id":new_data[i]['id'],"name":new_data[i]['name'],"display_name":new_data[i]['display_name']};

               	 this.interests.push(int);
               }
            }
            else{
              
            }
        }, error => {
          console.log(error);
      });
      //==============End Api=========================//
      loading.dismiss();
  }

  ionViewDidLoad() {
    this.interests = [];
    this.loadData()
  }

  deleteItem(int_id)
  {
    let loading = this.getLoader();
    loading.present();
    //==============Start Api=========================//
    this.api.post('deleteInterest',{'interest_id':int_id})
        .map(res => res.json())
        .subscribe( data => {
            this.loadData()
        }, error => {
      });
      //==============End Api=========================//
      loading.dismiss();
  }

  addMore()
  {
   
    let _that = this;
    let myCallbackFunction = function(_params) {
      return new Promise((resolve, reject) => {
        console.log(_params);
        if(_params){
          _that.loadData();
        }
        resolve();
      });
    }
    
  	this.navCtrl.push('AddMoreIntPage',{callback: myCallbackFunction});
  }

}
