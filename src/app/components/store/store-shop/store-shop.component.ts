import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';
import { User } from 'src/app/universal.model';
import { StepFriendComponent } from './step-friend/step-friend.component';
import { StoreCartComponent } from './store-cart/store-cart.component';
import { StoreEthicComponent } from './store-ethic/store-ethic.component';
import { StoreLocateComponent } from './store-locate/store-locate.component';
import { StoreTerConComponent } from './store-ter-con/store-ter-con.component';
import { StoreVarientComponent } from './store-varient/store-varient.component';
import { Timestamp } from "@firebase/firestore";
import { StoreHowWorkComponent } from './store-how-work/store-how-work.component';

@Component({
  selector: 'app-store-shop',
  templateUrl: './store-shop.component.html',
  styleUrls: ['./store-shop.component.scss']
})
export class StoreShopComponent implements OnInit {

  store$: Observable<any> = of();
  storeReference:any = null;
  campaign$: Observable<any> = of();
  campaignList:any[] = [];
  selectedCamp: string = "";
  products:any[] = [];
  proCat:string[] = [];
  openedAccordianLists:any = [];

  setJourney:{camp:any;journey:any;code:any;refer:any} = {
    camp:undefined,
    journey:undefined,
    code:undefined,
    refer:undefined
  }
  iMinStore = false;
  makeChanges = false;

  friend = "";
  openedGATEWAY = false;
  currentLocation:any = null;
  phone:string = "";
  landline:string = "";

  storeCat = '';
  storeType = '';
  storeTyp = '';
  viewTyp = '';
  imagesLoaded: string[] = [];

  about_store = false;
  highlights = false;
  show = false;
  searchTHEM = '';
/*
  show = false;
  brrr = false;
  isReadMore = true;
  deserts = false;
  desc = false;
  showAddToCard: boolean = false;

  //
  tick = false;
  ticked = false;
  //
  about_store = false;
  highlight = false;

  //segment: string = 'visit-store';
  openedAccordianLists: any = [];
  storeTyp = '';

  viewTyp = '';
  showText() {
    this.isReadMore = !this.isReadMore;
  }
*/

  constructor(
    public auth: AuthService,
    private pay: PaymentService,
    private actRoute: ActivatedRoute,
    private bottomSheet: MatBottomSheet
  ) {
    if(this.auth.myCart.length > 0){
      this.auth.myCart = [];
      this.auth.myCartVar = [];
    }
    this.startExecution()
  }

  //



  get getheight() {
    return window.innerHeight;
  }
  get getwidth() {
    return window.innerWidth;
  }

  checkSearch(title:string){
    return title.toLowerCase().includes(this.searchTHEM.toLowerCase()) ? true : false;
  }

  storeLoc(x:any) {
    let isPhone = this.getwidth < 768;
    let w = isPhone ? this.getwidth + 'px' : '480px';
    let h = isPhone ? this.getheight + 'px' : '98vh';
    const refDialog = this.auth.resource.dialog.open(StoreLocateComponent, {
      width: w,
      minWidth: '320px',
      //maxWidth: (w - 16) +  'px',
      //height: '500px',
      hasBackdrop: true,
      disableClose: false,
      data:{loc:x, currentLocation:this.currentLocation, storeName: this.storeReference.name, phone:this.phone },
      panelClass: 'dialogClassStoreLoc', //, autoFocus:false
    });
    refDialog.afterClosed().subscribe(() => {});
  }

  termncondition(): void {
    this.bottomSheet.open(StoreTerConComponent);
  }
  
  mapLink(storeName:string, lat:number, lon: number){
    return 'https://maps.google.com/?q=' + lat + ',' + lon + '&title=' + storeName + '&content=' + "This is a Refr Club Store";
  }

  openDetail(id:string, variants:any, x:any) {
    if(variants.length > 0){
      this.showAndHideAddToCard(id, variants, true, x)
    }else{
      const varRef = this.bottomSheet.open(StoreVarientComponent, {
        data: { product: x }, panelClass:"", //hasBackdrop: false,
      });
      varRef.afterDismissed().subscribe(ref => {
        if(!ref || !ref.success){
  
        }else{
          // for ( let i = 0; i < ref.product.countQ; i += 1 ){ 
          //    this.auth.myCart.push(id)
          // }
          //this.auth.myCartVar.push(ref.product)
        }
      })

    }
  }
  
  showAndHideAddToCard(id:string, variants:any, what:boolean, x:any) {
    //this.showAddToCard = true
      if(!what){
        
        if(variants.length > 0){

          this.auth.myCart = this.auth.myCart.filter( val => val !== id);
          this.auth.myCartVar = this.auth.myCartVar.filter((y:any) => y.id !== id)
        }else{
        let index = this.auth.myCart.indexOf(id)
        this.auth.myCart.splice(index,1)
        }

      }else{

    if(variants.length > 0){
      this.productpop(id, variants, x)
    }else{
        this.auth.myCart.push(id)
    }

      }
  }
  productpop(id:string, variants:any, x:any): void {
    const varRef = this.bottomSheet.open(StoreVarientComponent, {
      data: { product: x }, panelClass:"", //hasBackdrop: false,
    });
    varRef.afterDismissed().subscribe(ref => {
      if(!ref || !ref.success){

      }else{
        for ( let i = 0; i < ref.product.countQ; i += 1 ){ 
           this.auth.myCart.push(id)
        }
        this.auth.myCartVar.push(ref.product)
      }
    })
  }

  getCartItemLength(id:string){
    if(!this.auth.myCart.includes(id)){
      return 0;
    }else{
      let x = 0;
      for (let i = 0; i < this.auth.myCart.length; i++) {
        if(this.auth.myCart[i] == id){ x++ }
        if((i + 1) == this.auth.myCart.length){
          return x;
        }
      }
    }
  }

  howRedeem(): void {
    this.bottomSheet.open(StoreEthicComponent);
  }

  // storeLoc(): void {
  //   const dialogRef = this.dialog.open(StorepageshopsComponent, {
  //     width: '100%',
  //   });
  // }

  //
  //products = false;

  ngOnInit(): void {
    /*
    this.storeTyp = 'Offl';
    //this.storeTyp = 'Offl';
    //this.storeTyp = 'Both';

    if (this.storeTyp == 'Onli') {
      this.viewTyp = 'Online';
    }
    if (this.storeTyp == 'Offl') {
      this.viewTyp = 'Offline';
    }
    if (this.storeTyp == 'Both') {
      this.viewTyp = 'Offline';
    }
    */
  }

  getWidth() {
    var state = 0;
    var stateMax = 2;
    //state -= 1;
    return (state / stateMax) * 100 + '%';
  }

  changeViewTyp(segmentValue: string) {
    this.viewTyp = segmentValue;
  }


  calculateStartExpiry(fsDateS:any, fsDateE:any){
    // Create new Date instance
var date = new Date()
// Add a day
//date.setDate(date.getDate() - 14)

    //const dateNow = new Date().setDate(new Date().getDate() + 10);
    //const date14 = new Date().setFullYear( fsDate.toDate() );
    let noteDate = Timestamp.fromDate(date);
    //const date14 = fsDate.toDate();
    //console.log("date14: ",  fsDate, "dateNow: ", noteDate)
    return noteDate > fsDateS && noteDate < fsDateE;
  }



  startExecution(){
    const aR = this.actRoute.snapshot.params;
    const sid = aR["id"] || null;
    const code = aR["code"] || null;
    if(!sid && !code){
      this.auth.resource.router.navigate(["/home"])
    }else{
      
      setTimeout(() => {
        if(sid){
          this.execute(sid, "DIRECT", null);
        }
        if(code){
          console.log("checkIfCodeExist", code)
          // check if code exist
          this.auth.checkIfCodeExist(code).then(ref => {
              console.log("checkIfCodeExist", ref)
            if(!ref || !ref.success || !ref.exists){
              this.auth.resource.startSnackBar("No such code exist")
            }else{
              this.friend = ref.data.name;
              this.execute(ref.data.store, "F2Fs1", ref.data)
            }
          })
          
          //this.executeF2F(code);
          // check if code exist
        }
      }, 3000)
      
    }
  }

  execute(sid:string, type:string, codeData:any){
    //const sid = this.sid;
    this.auth.getStore(sid)//.pipe(take(1))
    .subscribe((storeX:any) => {
      if(!storeX){
        this.auth.resource.startSnackBar("No Such Store")
      }else{
        const storeZ = storeX; // .pipe(take(1))
        this.auth.getStoreUser(storeX.by).pipe(take(1)).subscribe(storeXuser => {
          //console.log("store: ", storeX, storeXuser)
          if(!storeXuser){

          }else{
            storeZ["userInfo"] = storeXuser;
            this.storeReference = storeZ;
            this.store$ = of(storeZ);
            this.currentLocation = storeZ.loc[0];
            this.phone = storeZ.phone ? ("+91" + storeZ.phone) : storeZ.userInfo.phone;
            this.landline = storeZ.landline ? storeZ.landline : storeZ.userInfo.landline;

            const cat = this.auth.resource.categoryList[this.auth.resource.categoryList.findIndex((x:any) => x.id == storeX.cat)];
            const b = cat?.items.findIndex((x:any) => x.id == storeX.subCat)

            this.storeCat = cat?.items[b].name;
            this.storeType = this.auth.resource.env.storeTyp[this.auth.resource.env.storeTyp.findIndex(x => x.id == storeX.type)].name;
            this.storeTyp = storeX.type;

            if(this.storeTyp == "Onli"){ this.changeViewTyp('Online') }
            if(this.storeTyp == "Offl"){ this.changeViewTyp('Offline') }
            if(this.storeTyp == "Both"){ this.changeViewTyp('Offline') }
            console.log("store: ", storeZ)


            this.auth.getMyCampaignByUID( storeX.by, 22 )//.pipe(take(1))
            .subscribe(storeXcampaigns => {
              if(!storeXcampaigns){

              }else{
                console.log("storeXcampaigns: ", storeXcampaigns)
                // if(type !== "F2Fs1"){
                //   this.campaign$ = of(storeXcampaigns);
                //   this.setJourney = {
                //     camp:null, journey:"TEST", code:null, refer: null
                //   };
                // }
                

                let cX = [];
                for (let indexC = 0; indexC < storeXcampaigns.length; indexC++) {
                  const c:any = storeXcampaigns[indexC];
                  if(this.calculateStartExpiry(c.dateS , c.dateE)){
                    cX.push(c)
                  }
                  
                  if( storeXcampaigns.length == (indexC+1) ){
                    //this.campaign$ = of([]);
                    //this.campaignList = [];
                    this.campaign$ = of(cX);
                    this.campaignList = cX;
                    if(cX.length == 1){
                      this.selectedCamp = cX[0].id
                    }
                  }
                }

                    //const camp = storeXcampaigns[storeXcampaigns.findIndex((cX:any, cZ:any) =>  (cX.cbNew > cZ.cbNew) ? cZ : cX)]
                    //this.selectedCamp = camp["id"];

                if(type == "DIRECT"){
                    this.setJourney = {
                      camp:null, journey:"DIRECT", code:null, 
                      refer: null
                    };
                }

                if(type == "F2Fs1"){
                    this.setJourney = {
                      camp:null, //camp:codeData.current
                      journey:"F2F", code:codeData.id, 
                      refer:{uid:codeData.user, name:codeData.name, earn:0 }
                    };

                    const camp = storeXcampaigns[storeXcampaigns.findIndex((cX:any, cZ:any) =>  (cX.cbNew > cZ.cbNew) ? cZ : cX)]
                    this.gatewaycard(codeData, storeZ, camp)
/*
                  if(!codeData.active){
                    //this.auth.resource.startSnackBar("No Campaign is active on this link.")
                    //this.auth.resource.router.navigate(["/home"])
                  }else{
                    //console.log("camp",camp)
                    //console.log("codeData",codeData)
                    //console.log("storeZ", storeZ)

                    //this.campaign$ = of(storeXcampaigns);
                    //this.campaignList = storeXcampaigns;
                    this.gatewaycard(codeData, storeZ, camp)
                  }

*/
                }
              }
            })

            this.auth.getMyProductByUID( storeX.by, 140 )//.pipe(take(1))
            .subscribe(storeXproducts => {
              if(!storeXproducts){

              }else{
                console.log("storeXproducts: ",  storeXproducts)
                this.products = storeXproducts;
                this.proCat = [];
                
                for (let ca = 0; ca < this.products.length; ca++) {
                  const element = this.products[ca];
                  if( element.category && !this.proCat.includes(element.category) ){
                    this.proCat.push(element.category)
                  }
                }

              }
            })


          }
          
        })
      }
    })
  }

  startAtStoreF2F(mine:User){
    if(!this.selectedCamp){
      this.auth.resource.startSnackBar("Please select a campaign.");
    }else{

      //if(this.setJourney.journey == "DIRECT"){
        const camp = this.campaignList[this.campaignList.findIndex((cX:any) => cX.id == this.selectedCamp)]
        this.setJourney.camp = camp;
        console.log("camp",camp)
      //}
            
    if(!this.iMinStore){
      this.auth.resource.startSnackBar("Confirm that you are at the store.")
    }else{
      this.makeChanges = true;
      const journeyX = "" + ( this.setJourney.journey == "F2F" ? "F2F_OFFLINE" : "") + ( this.setJourney.journey == "DIRECT" ? "DIRECT_OFFLINE" : "");



      const amSale = 0 //+ this.invoice.amtRefrCash
      const amCost = 0; // USER PAYS THIS ALWAYS
      const amSave = 0;
      const amTotal = 0; // MERCHANT GETS THIS ALWAYS
      const earnX = 0; //+ this.setJourney.camp.cbNew; to be earn later
      
    let ordrTYPE = "CASH";
    let invoice:any = {
      //type: "Online",
      useRefrCash: false,
      amtRefrCash: 0,
      COD: false
    }


      const data = { 
        //campID: this.userData.campID,
        from:"StoreORDER",
      type:[/*"addBalance", "firstBalance", "vendorAc"*/], 
        by: mine.uid, to: this.storeReference.by,  sid:this.storeReference.id, 
        storeName: this.storeReference.name, userName: mine.name,
        amSale, amCost, amSave, 
        amTotal, userData: mine,

        camp: this.setJourney.camp, // SELECED
        journey: this.setJourney.journey,
        earn: earnX, // CASHBACK
        code: this.setJourney.code,
        refer: this.setJourney.refer,

        invoice: invoice,
        ordrTYPE: ordrTYPE,

        logistics: {
          name:mine.name,
          phone:mine.phone,
          email:mine.email,
          typeShop:this.storeReference.type,
          typeOrdr:journeyX,
          typeCat:this.storeReference.cat,
          typeSuCat:this.storeReference.subCat,
          require: false,
          addressPick: this.currentLocation || null,
          addressPickT: "shop" || null,
          addressDrop: null,
          addressDropT: null,
          status: 0
        },
        cart:[]

      }

      console.log("WALLL", data)

      this.pay.startGatewayOrder(data).then(ref => {
        if(!ref){
          this.auth.resource.startSnackBar("Payment Failed, Try again...");
          this.makeChanges = false;
          //this.payFailed("Payment Failed, Try again...");
          // this.payFail = true;
          // setTimeout(() => {
          //   this.dialogRef.close({success:false, info});
          // }, 5000)
        }else{
          const paymentId = ref.id;
          console.log("paymentId", paymentId)
          this.auth.resource.router.navigate(["/redeem/" + paymentId]);
          //this.makeChanges = false;
        }
      })
    }

    }
  }

  gatewaycard(codeData:any, store:any, camp:any) {
    if(!codeData || !store || !camp){
      this.auth.resource.startSnackBar("Invalid Data")
    }else{
      if(!this.openedGATEWAY){
        this.openedGATEWAY = true;



        
    this.auth.user$.pipe(take(1)).subscribe(mine => {
if(!mine){
//USER NOT LOGGED
      let isPhone = this.auth.resource.getWidth < 768;
      let w = isPhone ? this.getWidth + 'px' : '480px';
      // let h = isPhone ? this.getHeight + 'px' : '50vh';
      const profile = this.auth.resource.dialog.open(StepFriendComponent, {
        width: w,
        minWidth: '350px',
        maxWidth: '320px',
        // height: h,
        hasBackdrop: true,
        disableClose: true,
        panelClass: 'dialogEntryF2F', //, autoFocus:false
        data:{codeData:codeData, store:store, camp:camp}
      });
      profile.afterClosed().subscribe(ref => {
        if(ref.success){

          if(!ref.now){
            // add to f2f after sign up or now if signed
            console.log("NO SIGNED USER & ADD F2F LATER" + codeData.id)
            const urlX = "/addF2F/later/" + codeData.id;
            this.auth.resource.router.navigate([urlX])
          }else{
            console.log("NO SIGNED USER & ADD F2F NOW" + codeData.id) // LOOK AT IT
            const urlX = "/addF2F/now/" + codeData.id;
            this.auth.resource.router.navigate([urlX])
          }

        }
      })






}else{
//USER LOGGED
console.log("SHOP NOW HERE CAUSE LOGGED USER")


          if(codeData.used.includes(mine.uid)){
            console.log("This Code is already in used")
            // CODE ALREADY EXIST
              // if(!ref.now){
              //   console.log("This Code is already saved in your F2F")
              //   this.auth.resource.startSnackBar("This Code is already saved in your F2F")
              //   this.auth.resource.router.navigate(["/home"])
              // }else{
              //   // SHOP NOW HERE
              //   console.log("SHOP NOW HERE EXIST")
              // }
          }else{
            // ADDING TO CODES REQUORED
            this.auth.addUserToCode(this.auth.refrCode, mine.uid).then(() => {
              console.log("Code has been added to your F2F")
              // if(!ref.now){
              //   console.log("Code has been added to your F2F")
              //   this.auth.resource.startSnackBar("Code has been added to your F2F")
              //   this.auth.resource.router.navigate(["/home"])
              // }else{
              //   // SHOP NOW HERE
              //   console.log("SHOP NOW HERE")
              // }
            })
          }






}
    })




      }
    }
  }



  showAccordion (value:string) {
    let index = this.openedAccordianLists.indexOf(value)
    if(index === -1) {
      this.openedAccordianLists.push(value)
    } else
    {
      this.openedAccordianLists.splice(index,1)
    }
  }

  showCat(products:any[],  category:string){
    return products.findIndex(z => z.category == category && !z.burn && !z.reqBurn) !== -1;
  }

  totalCost(){
    if(!this.auth.myCart.length){
      return 0;
    }else{
      let x = 0;
      for (let i = 0; i < this.auth.myCart.length; i++) {
        //if(this.showAddToCard[i] == id){ x++ }
        const cost = this.products[this.products.findIndex(x => x.id == this.auth.myCart[i])].cost;
        x = x + cost;
        if((i + 1) == this.auth.myCart.length){
          return x;
        }
      }
    }
  }

  openCart(){
    if(!this.selectedCamp){
      if(this.campaignList.length > 0){
        this.auth.resource.startSnackBar("Please select a campaign.");
      }else{
        this.auth.resource.startSnackBar("The Store has No Active Campaigns.");
      }
    }else{

    //if(this.setJourney.journey == "DIRECT"){
      const camp = this.campaignList[this.campaignList.findIndex((cX:any) => cX.id == this.selectedCamp)]
      this.setJourney.camp = camp;
      // if(this.setJourney.code){
      // this.setJourney.refer.earn = camp.cbExi;
      // }
      console.log("camp",camp)
    //}

    let isPhone = this.auth.resource.getWidth < 768;
    let w = isPhone ? this.auth.resource.getWidth + 'px' : '480px';
    let h = isPhone ? this.auth.resource.getHeight + 'px' : '98vh';
    const refDialog = this.auth.resource.dialog.open(StoreCartComponent, {
      width: w,
      minWidth: '320px',
      maxWidth: '480px',
      height: h,
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'dialogEntryCart', //, autoFocus:false
      data: {
        //cart: this.auth.myCart, 
        store: this.storeReference,
        products: this.products, 
        currentLocation: this.currentLocation,
        setJourney: this.setJourney
      }
    });
    refDialog.afterClosed().subscribe(ref => {
      if(!ref || !ref.success){
        
      }else{
        this.auth.myCart = [];
        this.auth.resource.router.navigate(["/order-status/" + ref.paymentId]);
        //this.auth.resource.startSnackBar("New Order has been Placed.")
      }
    });
    }

  }

  howitworks(){
    this.bottomSheet.open(StoreHowWorkComponent, {
      panelClass: 'bottomsheetHowItWorks'
    });
  }

}
