import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';

import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Events } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { UserProvider } from './user';
/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
    url: string = 'http://acrefin.com/api1/v1';
    // url: string = 'http://localhost/whatnext_server/v1';
    
    // url: string = 'http://192.168.0.13/what_next_api/v1';
    // url: string = 'http://192.168.0.19/whatnext_server/v1';
 
    options: RequestOptions;
    activeCalls: number = 0;

    userToken:string;
    constructor(public http: Http,
    public nativS:NativeStorage, 
    public currentUser:UserProvider,
    private storage: Storage, 
    public events?: Events) {
        this.storage.set('httpStatus', 'false');
    }

    setHeaders(){

        let myHeaders: Headers = new Headers;
        
        this.nativS.getItem('user')
        .then((data) => {

               console.log(data+' local storage');
               console.log(data['token']);
               console.log(data.token);
               console.log(' local storage end');
               this.userToken = data['token'];
               
            });
        
        myHeaders.set('Content-Type', 'application/x-www-form-urlencoded');
        console.log(this.currentUser.token+" user token");
        if(this.currentUser.token){
            myHeaders.set('Authorization', this.currentUser.token);
        }

        // myHeaders.set('Authorization','12e63aefe5f656e62325e47a5792c2b9');
        this.options = new RequestOptions({ headers: myHeaders});
    }

    get(endpoint: string, params?: any) {
        this.setHeaders();
        // Support easy query params for GET requests
        if (params) {
            let p = new URLSearchParams();
            for (let k in params) {
                p.set(k, params[k]);
                endpoint += "/" + params[k];
            }
        }
        this.httpCallRequested();
        return this.http.get(this.url + '/' + endpoint , this.options).finally(() => {
            this.httpCallReady();
        });
    }

    post(endpoint: string, body: any, ex_options?: any) {
         this.setHeaders();

        let params = new URLSearchParams();
        for(let key in body){
            if(Array.isArray(body[key])){
                for (var i = 0; i < body[key].length; i++) {
                    params.set(key + '[]', body[key][i]); 
                }
            }
            else{
                params.set(key, body[key]);
            }
        }

        if(ex_options){
            for(let key in ex_options){
                this.options[key] = ex_options[key];
            }
        }

        console.log(this.options);
        console.log(endpoint);
        this.httpCallRequested();
        return this.http.post(this.url + '/' + endpoint, params, this.options)
        .finally(() => {
            this.httpCallReady();
        });
    }

    put(endpoint: string, body: any) {
        this.setHeaders();
        let params = new URLSearchParams();
        for(let key in body){
            if(Array.isArray(body[key])){
                for (var i = 0; i < body[key].length; i++) {
                    params.set(key + '[]', body[key][i]); 
                }
            }
            else{
                params.set(key, body[key]);
            }
        }
        this.httpCallRequested();
        return this.http.put(this.url + '/' + endpoint, params, this.options)
        .finally(() => {
            this.httpCallReady();
        });
    }

    delete(endpoint: string) {
        this.httpCallRequested();
        return this.http.delete(this.url + '/' + endpoint, this.options)
        .finally(() => {
            this.httpCallReady();
        });
    }

    patch(endpoint: string, body: any) {
        return this.http.put(this.url + '/' + endpoint, body, this.options);
    }


    private httpCallReady(): void {
        this.activeCalls--;
        if (this.activeCalls === 0) {
            // console.log('Http Done!');
            this.events.publish('API:RequestIdle');
            this.storage.set('httpStatus', 'false');
        }
    }

    private httpCallRequested(): void {
        if (this.activeCalls === 0) {
            // console.log('Http start!');
            this.events.publish('API:RequestBusy');
            this.storage.set('httpStatus', 'true');    
        }
        this.activeCalls++;
    }

    getHttpStatus(){
        return this.storage.get('httpStatus');
    }
}
