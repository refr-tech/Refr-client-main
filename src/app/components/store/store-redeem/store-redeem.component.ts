import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { doc, onSnapshot } from '@firebase/firestore';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';
import {ChangeDetectorRef} from '@angular/core';

import * as confetti from 'canvas-confetti';
//declare var confetti: any;

@Component({
  selector: 'app-store-redeem',
  templateUrl: './store-redeem.component.html',
  styleUrls: ['./store-redeem.component.scss']
})
export class StoreRedeemComponent implements OnInit {

  loading = true;
  payment:any = null;

  capClass:string = 'cap-intial';
  giftBoxClass:string = '';

  
  storeBoth$: Observable<any[]> = of();
  storeOnli$: Observable<any[]> = of();
  storeOffl$: Observable<any[]> = of();

  imgLoaded: string[] = [];

  completeANIM = false;
  makeChanges = false;

  journey = "";

  constructor(
    private actRoute: ActivatedRoute,
    public auth: AuthService,
    public pay: PaymentService,

    private firestore: Firestore,
    private cd: ChangeDetectorRef,

    private renderer2: Renderer2,
    private elementRef: ElementRef
  ) { 
    const aR = this.actRoute.snapshot.params;
    const id = aR["id"] || null;
    console.log("id", id)

    if(!id){

    }else{
      this.execute(id)
    }
  }

  ngOnInit(): void {
    /*
    setTimeout(() => {
      this.startAnimation()
      setTimeout(() => {
        this.stopAnimation()
      }, 3000);
    }, 3000);
    */
  }


  startAnimation() {
    this.capClass = 'start-cap-animation',
    this.giftBoxClass = 'start-boxBody-animation'
  }
  
  stopAnimation() {
    this.capClass = 'cap-stop'
    this.giftBoxClass = ''
  }

  execute(id:string){
    let award = false;
    //this.payment$ = this.pay.getPayment(id);
    const gWay = "walt"
    const unsub = onSnapshot(doc(this.firestore, `${gWay}`, `${id}`), (doc) => {
      const p:any = doc.exists() ?  doc.data() : null;
        console.log("Current data: ", p?.journey,  p);

        // if(p && p.journey){
        // this.journey == "POS";
        // console.log("Current data: ", this.journey)
        // }else{
        //   this.journey == "MOKA";
        //   console.log("Current data: ", this.journey)
        // }
        
        if( !award && p?.journey == "POS" ){
          //this.journey == "POS"
          this.payment = p;
          console.log("POS")
          this.cd.detectChanges();
        if(p.status > 0){
          console.log("POS")
          award = true;
          this.loading = false;
          this.execute2()
          this.cd.detectChanges();
        }
        if(p.status < 0){
          console.log("POS-/F2F")
          award = true;
          this.auth.resource.startSnackBar("Request denied by the merchant.")
          this.cd.detectChanges();
          setTimeout(() => {
            this.auth.resource.router.navigate(["/home"])
            this.cd.detectChanges();
          }, 3000);
        }
        }

        if( !award && p?.journey == "F2F" ){
          //this.journey == "F2F"
          this.payment = p;
          console.log("F2F")
          this.cd.detectChanges();
        if(p.status > 0){
          console.log("F2F")
          award = true;
          this.loading = false;
          this.execute2()
          this.cd.detectChanges();
        }
        if(p.status < 0){
          console.log("F2F")
          award = true;
          this.auth.resource.startSnackBar("Request denied by the merchant.")
          this.cd.detectChanges();
          setTimeout(() => {
            this.auth.resource.router.navigate(["/home"])
            this.cd.detectChanges();
          }, 3000);
        }
        }

        if( !award && p?.journey == "DIRECT" ){
          //this.journey == "DIRECT"
          this.payment = p;
          console.log("F2F")
          this.cd.detectChanges();
        if(p.status > 0){
          console.log("F2F")
          award = true;
          this.loading = false;
          this.execute2()
          this.cd.detectChanges();
        }
        if(p.status < 0){
          console.log("F2F")
          award = true;
          this.auth.resource.startSnackBar("Request denied by the merchant.")
          this.cd.detectChanges();
          setTimeout(() => {
            this.auth.resource.router.navigate(["/home"])
            this.cd.detectChanges();
          }, 3000);
        }
        }


    });

  }

  execute2(){
    //setTimeout(() => {
      this.startAnimation()
      setTimeout(() => {
        this.stopAnimation();
        console.log("CONFETI")

    const canvas = this.renderer2.createElement('canvas');
 
    this.renderer2.appendChild(this.elementRef.nativeElement, canvas);
    this.renderer2.destroy();

    const myConfetti = confetti.create(canvas, {
      resize: true // will fit all screen sizes
    });
    this.cd.detectChanges();


        setTimeout(() => { 
        myConfetti();
        this.completeANIM = true;
        this.cd.detectChanges();
        setTimeout(() => { 
          myConfetti.reset()
//let oldcanv:any = document.getElementById('canvas');
//document.removeChild(oldcanv)

          this.cd.detectChanges();
        }, 3000);

        }, 1500);

      

      }, 3000);
    //}, 3000);

    this.storeOffl$ = this.auth.getAllStoreHome("Offl", 9)
    // .subscribe(ref => {
    //   if(!ref){}else{
    //     this.storeOffl$ = of(ref);
    //   }
    // })
    this.storeOnli$ = this.auth.getAllStoreHome("Onli", 9)
    // .subscribe(ref => {
    //   if(!ref){}else{
    //     this.storeOnli$ = of(ref);
    //   }
    // })
    this.storeBoth$ = this.auth.getAllStoreHome("Both", 9)
    // .subscribe(ref => {
    //   if(!ref){}else{
    //     this.storeBoth$ = of(ref);
    //   }
    // })
  }

  getSubCat(cat:string, subcat:string){
    if(this.auth.resource.categoryList.length == 0){
      return cat;
    }else{
      const c = this.auth.resource.categoryList.findIndex((x:any) => x.id == cat);
      const sc = this.auth.resource.categoryList[c].items.findIndex((x:any) => x.id == subcat);
      const now = this.auth.resource.categoryList[c].items[sc];
      return now.name;
    }
  }

  cancelTranz(id:string){
    this.makeChanges = true;
    this.pay.rejectReedem(id).then(() => {
      this.makeChanges = false;
    }).catch(err => {
      this.makeChanges = false;
      this.auth.resource.startSnackBar("Error: " + err)
    })
  }

}
