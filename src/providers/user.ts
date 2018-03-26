import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

    token: string = '';
    name: string = '';
    deviceId: string = '';
    
    constructor(private storage: Storage){
    	this.storage.get('user_data').then(val => {
            if(val){
                this.setUser(
                    val.id,
                    val.fname,
                    val.emailId,
                );
            }
            // console.log(val);
        });
    }
    
    public setUser(name: string, token: string, deviceId: string) {
        this.name = name;
        this.token = token;
        this.deviceId = deviceId;
    }

}