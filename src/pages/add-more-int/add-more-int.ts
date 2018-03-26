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
 * Generated class for the AddMoreIntPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-more-int',
  templateUrl: 'add-more-int.html',
})
export class AddMoreIntPage {

  interests:Array<any>=[];
  chkinterests:Array<any>=[];
  cbChecked:Array<any>=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:Api,
    public storage :Storage, public nativeStorage: NativeStorage,public loadingCtrl :LoadingController) {
  	
    //==============Start Api=========================//
    let loading = this.getLoader();
    loading.present();
    // this.interests =[{'name':"demo","display_name":"demo",'id':1},
    //                  {'name':"demo","display_name":"demo",'id':1},
    //                  {'name':"demo","display_name":"demo",'id':1},
    //                  {'name':"demo","display_name":"demo",'id':1}];
                     
    this.api.post('addMoreInterest','')
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
      });
      //==============End Api=========================//
      console.log(this.interests);
      loading.dismiss();
  }

  getLoader()
  {
      let loading = this.loadingCtrl.create({
            content: 'Please Wait...'
        });

      return loading;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddMoreIntPage');
  }

  saveInterest()
  {
    let loading = this.getLoader();
    loading.present();
    let int  = this.chkinterests.join(',');
    let user = this.nativeStorage.getItem('user');
    console.log(user);
    
    this.api.post('adduserInterest',{"interest_ids":int,'username':user,"device_id":1})
        .map(res => res.json())
        .subscribe( data => {
          console.log(data);
          let callback = this.navParams.get("callback") || false;
            if (callback) {
                callback(true).then(() => {
                    this.navCtrl.pop();
                });
            }
            else {
                this.navCtrl.setRoot('GooglePage');
            }
        },error=>{
          console.log(error);
        });
        loading.dismiss();
  }

  get diagnostic() { return JSON.stringify(this.cbChecked); }

  updateCheckedOptions(chBox, event) {

      var cbIdx = this.chkinterests.indexOf(chBox);
       console.log(cbIdx);
      if(event.checked) {
          if(cbIdx < 0 ){
               this.chkinterests.push(chBox);
          }
        } else {
          if(cbIdx >= 0 ){
             this.chkinterests.splice(cbIdx,1);
          }
      }

      console.log(this.chkinterests);
  }

}
