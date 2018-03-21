import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Storage } from '@ionic/storage';
import { Api} from "../../providers/api";
import { Observable } from 'rxjs/Observable';
import { Facebook } from '@ionic-native/facebook';

/**
 * Generated class for the InterestpagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-interestpage',
  templateUrl: 'interestpage.html',
})
export class InterestpagePage {

  interests:Array<any>=[];
  chkinterests:Array<any>=[];
  cbChecked:Array<any>=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:Api,
    public storage :Storage, public nativeStorage: NativeStorage,public fb:Facebook) {
  	this.api.post('getInterest', '')
                .map(res => res.json())
                .subscribe( data => {
                    //store data in storage
                    if (data.success == true) {

                       let new_data = data.data[0];
                       for(let i=0;i<new_data.length;i++)
                       {
                       	console.log(new_data[i]['name']);
                       	 let int = {"name":new_data[i]['name'],"display_name":new_data[i]['display_name']};

                       	 this.interests.push(int);
                       }
                    		
                    }
                    else{
                      
                    }
                }, error => {
                 
      });

      console.log(this.interests);
  }

  saveInterest()
  {
    let int  = this.chkinterests.join(',');
    let user = this.nativeStorage.getItem('user');
    console.log(user);

    
    this.api.post('getInterest',{"interest":int,'username':user})
                .map(res => res.json())
                .subscribe( data => {
                  console.log(data);
                  this.navCtrl.push('GooglePage');
                });
  }

  get diagnostic() { return JSON.stringify(this.cbChecked); }

  updateCheckedOptions(chBox, event) {

      var cbIdx = this.chkinterests.indexOf(chBox);

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad InterestpagePage');
  }

}
