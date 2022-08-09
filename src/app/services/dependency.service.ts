import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResourceService } from './resource.service';

import { FirebaseDynamicLinks, IDynamicLink } from '@awesome-cordova-plugins/firebase-dynamic-links/ngx';

@Injectable({
  providedIn: 'root'
})
export class DependencyService {

  constructor(
    private httpClient: HttpClient,
    private resource: ResourceService,

    public firebaseDynamicLinks: FirebaseDynamicLinks,
    ) { }

  getState(){
    return this.httpClient.get(`${environment.server}/api/refrBot/${ !environment.production ? "TEST" : "CLIENT" }`);
  }

  sendSMS(iso:string, phone:string, mes:string){
    const body = {
      phone, mes
    }
      console.log("send Sms")
      return this.httpClient.post(`${environment.server}/api/SMS/sendSMS/${ iso }`, body);
  }

  sendSES(iso:string, email:string, mes:string){
    const body = {
      email, mes
    }
      console.log("send email")
      return this.httpClient.post(`${environment.server}/api/SES/sendSES/${ iso }`, body);
  }
  
  sendSNS(iso:string, token:string, mes:string){
    const body = {
      token, mes
    }
      console.log("send notification")
      return this.httpClient.post(`${environment.server}/api/SNS/sendSNS/${ iso }`, body);
  }

  getLocationInfo(iso:string, lat:number, lon:number){
    const body = {
      lat, lon
    }
      console.log("get Location")
      return this.httpClient.post(`${environment.server}/api/locate/about/${ iso }`, body);
  }

  getCODE(iso:string, type:string){
    const body = { type }
      console.log("send notification")
      return this.httpClient.post(`${environment.server}/api/codes/sendCode/${ iso }`, body);
  }

  convertCODE(iso:string, type:string, currentCode:string){
    const body = {
      type, currentCode
    }
      console.log("send notification")
      return this.httpClient.post(`${environment.server}/api/codes/sendCodes/${ iso }`, body);
  }

  // setUpFDL(code:string){
  //   //if(this.resource.appMode){
  //   return this.firebaseDynamicLinks.createDynamicLink({
  //     link: "https://app.refr.club/go/" + code /*,
  //     androidInfo:{
  //       androidPackageName:"club.refr.app",
  //       androidFallbackLink:""
  //     },
  //     iosInfo:{
  //       iosBundleId: "",
  //       iosFallbackLink: "",
  //       iosAppStoreId: ""
  //     },
  //     socialMetaTagInfo:{
  //       socialTitle:"", socialDescription:"", socialImageLink:""
  //     }
  //     */
  //   })  
  //   //}else{
  //     //return
  //   //}
  // }

}
