import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SeoService } from './seo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, fromEvent, mapTo, merge, Observable, of } from 'rxjs';

//import { Plugins } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { Clipboard } from '@capacitor/clipboard';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  appMode = false;
  iosMode = false;
  updateAvil = false;
  enablePRO = false;
  appLoaded$ = new BehaviorSubject<boolean>(false);
  //appStarted:Observable<boolean> = new BehaviorSubject<boolean>(false);

  env = {
    company:"Refr Tech", brand:"Refr", slogan: "slogan",
    companyLogo:"assets/company/logo_color_company.png", 
    brandLogo:"assets/brand/logo_color.png",
    brandOpenGraph:"https://firebasestorage.googleapis.com/v0/b/refr/o/opengraph.png?alt=media&token=87b5c5d3-f7a1-42d6-ab4e-65eb17deccf5",

    splash:"assets/hosted/splash.gif",
    splashDark:"assets/hosted/splashDark.gif",
    avatarB: "assets/other/avatarB.svg",
    avatarW: "assets/other/avatarW.svg",

    title:"REFR - Like, Share & Earn", 
    description:"REFR - Get Vocal for your favourite  Local businesses...Literally!! Discover & shop from online / offline stores on Refr, recommend them to your circle and get rewarded.Get genuine recommendations from friends and earn when you use them.This is Real Cash so.. Spend it across businesses or on the cool stuff listed on the app.Refr More. Earn More. Spend more",
    keywords:"refr, club",
    url:"https://app.refr.club",

    db:{
      categories: "cats",
      burnCats: "burnCats",
      burn: "burn",
      inform: "inform",
      users: (!this.enablePRO ? "users" : "usersPRO"),
      shops: (!this.enablePRO ? "shops" : "shopsPRO"),
      hypes: (!this.enablePRO ? "hypes" : "hypesPRO"),
      things: (!this.enablePRO ? "things" : "thingsPRO"),
      codes: (!this.enablePRO ? "codes" : "codesPRO"),
      codesVendor: (!this.enablePRO ? "codesVendor" : "codesVendorPRO")
    },

    storeTyp: [ 
      {id:"Onli", name:"Online"}, 
      {id:"Offl", name:"Offline"}, 
      {id:"Both", name:"Online + Offline"}
    ],
  }
  storeTypeNow:string = "";

  foreignMarks:any = []
  categoryList:any[] = []
  merchandiseList:any[] = []
  campaignPlans = [
    { tX:"t1",
      cost: 5000, refill: 4300, refrGST: 18,
      refr: 700, refrGw: 126, refrGwGST: 18,
      total: 5126
    },
    { tX:"t2",
      cost: 10000, refill: 8800, refrGST: 18,
      refr: 0, refrGw: 0, refrGwGST: 18,
      total: 0
    },
    { tX:"t3",
      cost: 15000, refill: 13500, refrGST: 18,
      refr: 0, refrGw: 0, refrGwGST: 18,
      total: 0
    },
    { tX:"t4",
      cost: 25000, refill: 18000, refrGST: 18,
      refr: 0, refrGw: 0, refrGwGST: 18,
      total: 0
    },
  ]

  currentNet = false;

  constructor(
    private snackBar: MatSnackBar,
    public router: Router,
    public seoService: SeoService,
    public dialog: MatDialog,
    public bottomSheet: MatBottomSheet,
  ) { }


  get getHeight(){
    return window.innerHeight;
  }
  get getWidth(){
    return window.innerWidth;
  }
  

  actRoutes(){}


// VALIDATORS
invalidPhone(phone:string){
  const newNum  = new FormControl(phone, [
    Validators.pattern('^[0-9]+$')
  ]);
  return newNum.invalid;
}
invalidEmail(email:string){
  const newMail  = new FormControl(email, [
    //Validators.pattern('/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/')
    Validators.email
  ]);
  return newMail.invalid;
}
invalidPassword(pass:string){
  const newKey  = new FormControl(pass, [
    Validators.pattern('^[0-9A-Za-z@]+$')
  ]);
  return newKey.invalid;
}
invalidName(name:string){
  const newKey  = new FormControl(name, [
    Validators.pattern('^[A-Za-z ]+$')
  ]);
  return newKey.invalid;
}
first = new FormControl('', [
  Validators.required,
  Validators.pattern('^[A-Za-z ]+$'),
  Validators.minLength(2), Validators.maxLength(30)
]);
last = new FormControl('', [ // TO BE REMOVED
  Validators.required,
  Validators.pattern('^[A-Za-z]+$'),
  Validators.minLength(2), Validators.maxLength(12)
]);
pass = new FormControl('', [
  Validators.required,
  Validators.pattern('^[0-9A-Za-z@]+$'),
  Validators.minLength(8), Validators.maxLength(14)
]);
/*
username = new FormControl('', [
  Validators.required,
  Validators.pattern('^[0-9a-z]+$'),
  Validators.minLength(3), Validators.maxLength(14)
]);
info = new FormControl('', [
  Validators.required,
  Validators.pattern(`^[0-9A-Za-z@|,;.:!?()'& ]+$`),
  Validators.minLength(3), Validators.maxLength(123)
]);
url = new FormControl('', [
  Validators.required,
  Validators.pattern('^[A-Za-z0-9./@]+$'),
  Validators.minLength(5), Validators.maxLength(39)
]);
profession = new FormControl('', [
  Validators.required,
  Validators.pattern('^[0-9A-Za-z ,.]+$'),
  Validators.minLength(3), Validators.maxLength(28)
]);
*/
// VALIDATORS



startSnackBar(mes:any){
  this.snackBar.open(mes, "", {
    duration: 2000, //panelClass:["b_accent","c_light"], 
    verticalPosition:"bottom", horizontalPosition:"right"
  });
}

copyClipboard(mes:string){
  if(this.appMode){
    const writeToClipboard = async () => {
      await Clipboard.write({
        string: mes
      });
    };

    writeToClipboard().then(() => {
      this.startSnackBar("copied to your clipboard.")
    })
  }else{
    navigator.clipboard.writeText(mes).then(() => {
      this.startSnackBar("copied to your clipboard.")
    });
  }
}

compareDates(date1:any){
  const dateX = Date.parse(date1);
  const date2 = Date.now();
  //console.log(dateX, date2)
  return dateX > date2;
}

// public onlineOffline(){
//   return merge(
//     of(navigator.onLine),
//     fromEvent(window, 'online').pipe(mapTo(true)),
//     fromEvent(window, 'offline').pipe(mapTo(false))
//    );
  /*
  // Network.addListener('networkStatusChange', status => {
  //   console.log('Network status changed', status);
  // });
  return of(
    this.internetConnected().then(res => {
      if(!res.connected){
        return false;
      }else{
        return true;

  // return merge(
  //   of(navigator.onLine),
  //   fromEvent(window, 'online').pipe(mapTo(true)),
  //   fromEvent(window, 'offline').pipe(mapTo(false))
  //  );

      }
    }).catch(() => {
      return false;
    })
  );
*/
  // return merge(
  //   of(navigator.onLine),
  //   fromEvent(window, 'online').pipe(mapTo(true)),
  //   fromEvent(window, 'offline').pipe(mapTo(false))
  //  );
   /*
   const { Network } = Plugins;
   
   let handler = Network.addListener('networkStatusChange', (status) => {
     console.log("Network status changed", status);
   });
   // To stop listening:
   // handler.remove();
   
   // Get the current network status
   let status = await Network.getStatus();
   
   // Example output:
   {
     "connected": true,
     "connectionType": "wifi"
   }
   */
//}

async internetConnected(){
  let x = false;
  try{
    const status = await Network.getStatus();
    console.log(status.connected, status.connectionType)
    x = status.connected;
    return of(status.connected);
  // try{
  //   const status = await Network.getStatus();
  //   return status.connected;
  }catch(error){
    //const status = await Network.getStatus();
    return false;
  }finally{
    this.currentNet = x;
    return x;
  }
}

}
