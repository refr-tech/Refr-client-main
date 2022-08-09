import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { PayComponent } from 'src/app/components/pay/pay.component';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';
import { User } from 'src/app/universal.model';
import { StoreVarientComponent } from '../store-varient/store-varient.component';


@Component({
  selector: 'app-store-cart',
  templateUrl: './store-cart.component.html',
  styleUrls: ['./store-cart.component.scss']
})
export class StoreCartComponent implements OnInit {

  @ViewChild('phone') inputPhone!: ElementRef;

  show = false;
  userDetails:any = {
    name:"",
    mobile:"",
    email:"",

    //addressStore:null, 
    address:null, 
    type:"home",
    newAddress: {
      address:"", landmark:"", zip:undefined
    },
  }

  invoice:any = {
    //type: "Online",
    useRefrCash: false,
    amtRefrCash: 0,
    COD: false
  }
  storeReference:any = null;
  addrList:any[] = [];
  addrCURRENT:any[] = [];
  createAddress = false;
  makeChanges = false;

  step = 0;

  phoneNumber = new PhoneNumber();
  //phoneNumFull:string = "";

  burnMode = false;
  viaSign = false;

  constructor(
    private bottomSheet: MatBottomSheet,
    public auth: AuthService,
    private pay: PaymentService,
    public dialogRef: MatDialogRef<StoreCartComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    console.log("KIND", data)
    this.execute(data)
    if(data?.setJourney?.journey == "BURN"){
      this.burnMode = true;
    }
  }

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  execute(data:any){
    this.storeReference = data.store;
    this.auth.user$.pipe(take(1)).subscribe(mine => {
      if(!mine){
        this.viaSign = true

      }else{
        console.log("MINE: ", mine )
        this.userDetails.name = mine.name || "";
        this.userDetails.mobile = mine.phone.split("+91")[1] || "";
        this.userDetails.email = mine.email || mine.emails[0] || "";
        if(mine.addr?.length > 0){
          this.addrList = mine.addr;
          //this.addrCURRENT = JSON.parse( JSON.stringify( {xxx: mine.addr} ) ).xxx;
          //Object.assign([], mine.addr);
          //_.cloneDeep(value) 
          //JSON.parse(JSON.stringify(this.addrList)) 
          //this.addrList.map((x:any) => Object.assign({}, x)) 
          //Object.assign({}, mine.addr) 
          //JSON.parse( JSON.stringify( mine.addr ) )
          this.userDetails.address = mine.addr[0] || null;
          this.userDetails.type = mine.addr[0].type || "home"
        }else{
          this.createAddress = true;
        }
        this.step = 1;
      }
    })
  }

  startChangeAddress(){
    if(this.createAddress){
      if(
        this.userDetails.type &&
        this.userDetails.newAddress.address?.length > 0 &&
        this.userDetails.newAddress.landmark?.length > 0 &&
        this.userDetails.newAddress.zip?.toString().length == 6 && !this.auth.resource.invalidPhone(this.userDetails.newAddress.zip)
      ){

        if(this.addrCURRENT.length > 0){
          for (let i = 0; i < this.addrCURRENT.length; i++) {
            const element = this.addrCURRENT[i];
            console.log(element)
            let m = this.addrList.findIndex((v:any) => {
              return element.type == v.type && 
              element.address == v.address && 
              element.landmark == v.landmark && 
              element.zip == v.zip 
            })
            if(m >= 0){
              this.addrList.splice(m, 1)
            }
          }
        }

        this.userDetails.address = {
          type: this.userDetails.type,
          address:this.userDetails.newAddress.address, 
          landmark:this.userDetails.newAddress.landmark, 
          zip:this.userDetails.newAddress.zip
        };
        this.addrList.push(this.userDetails.address);
        this.addrCURRENT = [this.userDetails.address];
        this.createAddress = false;
      }else{
        this.auth.resource.startSnackBar("Please enter proper address.");
      }
      //this.addrList = this.addrCURRENT;
    }else{
        this.createAddress = true;
        this.userDetails.address = null;
    }
  }

  get cartProducts(){
    const cart:any[] = [];
    if(this.auth.myCart.length == 0){
      return cart;
    }else{
      for (let i = 0; i < this.auth.myCart.length; i++) {
        const element = this.auth.myCart[i];
        const itemIndex = cart.findIndex((x:any) => x.id == element);
        if( itemIndex !== -1 ){
          cart[itemIndex].Q = cart[itemIndex].Q + 1;
        }else{
          const product = this.data.products[this.data.products.findIndex((x:any) => x.id == element)];
          product["Q"] = 1;
          product["vX"] = this.auth.myCartVar.filter(z => {
            return z.id == product.id;
          });
          if(product){ cart.push(product); }
        }
        if((i+1) == this.auth.myCart.length){
          return cart;
        }
      }
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

          if(this.auth.myCart.length == 0){
            this.closeDialog();
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

  useRefrCash(acBalC: number){
    if(acBalC == 0){
      this.auth.resource.startSnackBar("Your current balance is " + acBalC);
    }else{
      if(!this.invoice.useRefrCash){
        this.invoice.useRefrCash = true;
        const payment = ((this.totalCost() || 0) + (this.delivery() || 0) + (this.packaging() || 0) + (this.taxes() || 0))
        console.log(this.auth.myCart, (this.totalCost() || 0) , (this.delivery() || 0) , (this.packaging() || 0) , (this.taxes() || 0))
        this.invoice.amtRefrCash = ( payment >= acBalC ? acBalC : payment);
      }else{
        this.invoice.useRefrCash = false;
        this.invoice.amtRefrCash = 0;
      }
    }
  }

  totalPrice(){
    if(!this.auth.myCart.length){
      return 0;
    }else{
      let x = 0;
      for (let i = 0; i < this.auth.myCart.length; i++) {
        //if(this.showAddToCard[i] == id){ x++ }
        const price = this.data.products[this.data.products.findIndex((x:any) => x.id == this.auth.myCart[i])].price;
        x = x + price;
        if((i + 1) == this.auth.myCart.length){
          return x;
        }
      }
    }
  }

  totalCost(){
    if(!this.auth.myCart.length){
      return 0;
    }else{
      let x = 0;
      for (let i = 0; i < this.auth.myCart.length; i++) {
        //if(this.showAddToCard[i] == id){ x++ }
        const cost = this.data.products[this.data.products.findIndex((x:any) => x.id == this.auth.myCart[i])].cost;
        x = x + cost;
        if((i + 1) == this.auth.myCart.length){
          return x;
        }
      }
    }
  }

  delivery(){
    return 0
  }

  taxes(){
    return 0
  }

  packaging(){
    return 0
  }

  validateInfo(){
    if(
      this.auth.resource.invalidName( this.userDetails.name ) || this.userDetails.name.length == 0 ||
      this.auth.resource.invalidPhone( this.userDetails.mobile ) || this.userDetails.mobile.length !== 10 ||
      this.viaSign && this.auth.resource.invalidEmail( this.userDetails.email ) || this.viaSign && this.userDetails.email.length == 0 ||
      this.step !== 0 && !this.userDetails.address
      ){
        if(this.auth.resource.invalidName( this.userDetails.name ) || this.userDetails.name.length == 0 ){
          this.auth.resource.startSnackBar("Invalid Name");
        }else{
          if(this.auth.resource.invalidPhone( this.userDetails.mobile ) || this.userDetails.mobile.length !== 10){
            this.auth.resource.startSnackBar("Invalid Phone Number");
          }else{
            if( this.viaSign && this.auth.resource.invalidEmail( this.userDetails.email ) || this.viaSign && this.userDetails.email.length == 0){
              this.auth.resource.startSnackBar("Invalid Email Address");
            }else{
              if(this.step !== 0 && !this.userDetails.address){
                this.auth.resource.startSnackBar("Please enter or select the address");
              }else{
                this.auth.resource.startSnackBar("Something is wrong...");
              }
            }
          }
        }
      return true;
    }else{
      return false;
    }
  }

  validateInfoLogged(acBalC: number){
    if(this.invoice.amtRefrCash > acBalC){
      this.auth.resource.startSnackBar("You do not have enough refr cash");
      return false;
    }else{
      return this.validateInfo();
    }
  }

  sign(){
    this.makeChanges = true;

    console.log("sign")
    if(this.validateInfo()){
      this.makeChanges = false;
    }else{
    this.auth.user$.pipe(take(1)).subscribe(mine => {
      if(!mine){
        // CHECK IF USER EXIST
        // IF YES SIGN ELSE REGISTER
        this.step0(this.userDetails.mobile, this.userDetails.name, this.userDetails.email)

      }else{
        this.makeChanges = false;
        this.step = 1;
      }
    })
    }
    // if(true){
    //   this.signIN()
    // }else{
    //   //this.createOrder(mine:User)
    // }
  }


  finalRESULT(data:any){
    console.log("finalRESULT", data)
  }

  step0(xPhone:string, xEmail:string, xName:string){//FIGREOUT USER > NEW=SIGNUP|OLD=LOGIN
      this.phoneNumber.area = xPhone.slice(0,3);
      this.phoneNumber.prefix = xPhone.slice(3,6);
      this.phoneNumber.line = xPhone.slice(6,this.phoneNumber.digits);

    let validatePhone = this.phoneNumber.country + this.phoneNumber.area + this.phoneNumber.prefix + this.phoneNumber.line;
    if( this.auth.resource.invalidPhone(validatePhone) ){
      this.auth.resource.startSnackBar("issue: format must be 0-9.")
    }else{
      const phone = this.phoneNumber.e164;
      const step0_CheckUserExist = this.auth.step0_userForward( phone, false );
      step0_CheckUserExist.then((data:any) =>{
        console.log("Mega", data)
        if(!data.success){
          this.finalRESULT(data);
        }else{
          console.log("Ok", data)

          const bS = this.bottomSheet.open(BottomSheetOTP, {
            data: {phone: xPhone, name:xName, email:xEmail, responded:data }, //panelClass:"bottomSheetClassUpdate", 
            hasBackdrop: true,
            disableClose: true
          });

          bS.afterDismissed().subscribe(result => {
            if(!result.success){
              this.makeChanges = false;
              // scroll to phone number
              this.inputPhone.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              this.inputPhone.nativeElement.select();
            }else{
              this.makeChanges = false;
              this.step = 1;
              console.log("OTP Checked")
              
              //this.createNewStore(addNewLoc);
    this.auth.user$.pipe(take(1)).subscribe(mine => {
      if(!mine){

      }else{
        if(mine.addr?.length > 0){
          this.addrList = mine.addr;
          this.userDetails.address = mine.addr[0] || null;
          this.userDetails.type = mine.addr[0].type || "home"
        }else{
          this.createAddress = true;
        }
      }
    })
            }
            // Restore focus to an appropriate element for the user's workflow here.
          });

          /*
          */
        }

      })
    }
  }
  
  signUP(){
    this.makeChanges = true;

    console.log("signUP")
    // if(true){
    //   this.signIN()
    // }else{
    //   //this.createOrder(mine:User)
    // }
  }

  signIN(){
    this.makeChanges = true;

    console.log("signIN")
    //this.createOrder(mine:User)
  }

  createOrder(mine:User){
    const journeyX = "" + ( this.data.setJourney.journey == "F2F" ? "F2F_ONLINE" : "") + ( this.data.setJourney.journey == "DIRECT" ? "DIRECT_ONLINE" : "") + ( this.data.setJourney.journey == "BURN" ? "BURN" : "");


    this.makeChanges = true;
    if(!this.userDetails.address){
      this.startChangeAddress()
    }

    let payX =  ((this.totalCost() || 0) + (this.delivery() || 0) + (this.packaging() || 0) + (this.taxes() || 0)) - this.invoice.amtRefrCash;
    //( this.campCost(tX) + (this.getMerchCost() || 0) ) - ( (oferOFF ? this.oferCost(oferOFF):0) + ( oferONL ? this.oferCost(oferONL):0) );

    //const amRate = this.auth.resource.campaignPlans;
    //const amCamp = this.campCost(tX);
    //const amMerc = this.getMerchCost() || 0;
    const amSale = (this.totalPrice() || 0) + (this.delivery() || 0) + (this.packaging() || 0) + (this.taxes() || 0) //+ this.invoice.amtRefrCash
    //(this.campCost(tX) + ( (oferOFF ? this.oferCost(oferOFF):0) + ( oferONL ? this.oferCost(oferONL):0) ));
    const amCost = payX; // USER PAYS THIS ALWAYS
    const amSave = this.invoice.amtRefrCash + ( (this.totalPrice() || 0) - (this.totalCost() ||0) );
    //(oferOFF ? this.oferCost(oferOFF):0) + ( oferONL ? this.oferCost(oferONL):0);
    const amTotal = payX + this.invoice.amtRefrCash; // MERCHANT GETS THIS ALWAYS
    // const earnX = 0 + 
    // ( this.data.setJourney.camp.min > amTotal ? 0 :
    // (journeyX == "DIRECT_ONLINE" ? 0 : 0 ) +
    // (journeyX == "F2F_ONLINE" ? this.data.setJourney.camp.cbNew : 0 ) + 
    // 0 ) + 0;
    let  y = this.data.setJourney.camp;
    let amt = amTotal;


    const iEarn = 0 + ( this.data.setJourney.journey == "BURN" ? 0 : (y.min > +amt ? 0 : (
     ( y.type =="flat" ? (

      (this.data.setJourney.journey == "F2F" ? (y.cbNew):0)+
      (this.data.setJourney.journey == "DIRECT" ? (y.cbDir):0)+
      0

     ) : 0 ) + 
     ( y.type == "percent" ? (
       
      (this.data.setJourney.journey == "F2F" ? (y.max > (amt * y.cbNew/100) ? (amt * y.cbNew/100) : y.max):0)+
      (this.data.setJourney.journey == "DIRECT" ? (y.max > (amt * y.cbDir/100) ? (amt * y.cbDir/100) : y.max):0)+
      0

       ) : 0 ) ) )
    );

    const refEarn = 0 + ( this.data.setJourney.journey == "BURN" ? 0 : (y.min > +amt ? 0 : ( 
     ( y.type =="flat" ? y.cbExi : 0 ) + 
     ( y.type == "percent" ? (
       y.max > (amt * y.cbExi/100) ? (amt * y.cbExi/100) : y.max
       ) : 0 ) ) ) 
    );

   let refer = this.data.setJourney.refer;
   //console.log("AM", this.data.setJourney.refer, refer?.earn, refEarn)
   refer ? refer["earn"] = refEarn : 0;
   //console.log("AM", refer?.earn, refEarn)

    let ordrTYPE = "";
    if(amTotal == 0){
      ordrTYPE = "RefrCASH";
    }else{
      if(!this.invoice.useRefrCash){
        if(!this.invoice.COD){
          ordrTYPE = "ONLINE";
        }else{
          ordrTYPE = "COD";
        }
      }else{
        if(!this.invoice.COD){
            ordrTYPE = "RefrCASH+ONLINE";
        }else{
          ordrTYPE = "RefrCASH+COD";
        }
      }
    }

    if( this.validateInfoLogged(mine.acBalC) ){
      //this.auth.resource.startSnackBar("No delivery address selected.")
      this.makeChanges = false;
    }else{
      console.log("createOrder1", this.storeReference)
      let w = this.auth.resource.getWidth + "px";
      let h = this.auth.resource.getHeight + "px";

      const refDialog = this.auth.resource.dialog.open(PayComponent, {
        width: w, minWidth: w, maxWidth: w,
        height: h, 
        data:{ 
          //campID: this.userData.campID,
          from:"StoreORDER",
        type:[], 
          by: mine.uid, to: this.storeReference.by,  sid:this.storeReference.id, 
          storeName: this.storeReference.name, userName: mine.name,
          amSale, amCost, amSave, 
          amTotal, userData: mine,

          camp: this.data.setJourney.camp, // SELECED
          journey: this.data.setJourney.journey,
          earn: iEarn, // CASHBACK
          code: this.data.setJourney.code,
          refer: refer,

          invoice: this.invoice,
          ordrTYPE:(payX > 0 ? ordrTYPE : "RefrCASH"),

          logistics: {
            name:this.userDetails.name,
            phone:this.userDetails.mobile,
            email:this.userDetails.email,
            typeShop:this.storeReference.type,
            typeOrdr:journeyX,
            typeCat:this.storeReference.cat,
            typeSuCat:this.storeReference.subCat,
            require: (!this.storeReference.typeORDER.logistics ? false : true),
            addressPick: this.data.currentLocation || null,
            addressPickT: "shop" || null,
            addressDrop: this.userDetails.address || null,
            addressDropT:this.userDetails.type || null,
            status: 0
          },
          cart:this.cartProducts

        },
          
        
        disableClose: true, panelClass:"dialogLayout"//, autoFocus:false
      });
      refDialog.afterClosed().subscribe(ref =>{
          console.log(ref)
        if(!ref.success){
          this.auth.resource.startSnackBar(ref.info)
          this.makeChanges = false;
        }else{
          this.dialogRef.close({success:true, paymentId: ref.paymentId})

        }
      })

    }

    
  }


}


/*
  startPayment( by:string, tX:string, amRate:any, amCamp:number, amMerc:number, amSale:number, amCost:number, amSave:number, amTotal:number ){
    let w = this.auth.resource.getWidth + "px";
    let h = this.auth.resource.getHeight + "px";

    const refDialog = this.auth.resource.dialog.open(PayComponent, {
      width: w, minWidth: w, maxWidth: w,
      height: h, 
      data:{ 
        //campID: this.userData.campID,
        from:"SIGN", tX:tX,
        type:["addBalance", "firstBalance", "vendorAc"], by, to:"Δ", amRate, amCamp, 
        amMerc, 
        amSale, amCost, amSave, 
        amTotal, userData:this.userData },
      
      disableClose: true, panelClass:"dialogLayout"//, autoFocus:false
    });
    refDialog.afterClosed().subscribe(ref =>{
      if(!ref.success){
        console.log(ref)
        this.auth.resource.startSnackBar(ref.info)
        this.disableForm = false;
      }else{
        this.auth.resource.startSnackBar("Payment Successful")
        if( this.storeTyp == 'Both' || this.storeTyp == 'Onli' ){
          this.auth.resource.router.navigate(["/store/add-product"])
        }else{
          this.auth.resource.router.navigate(["/dash"])
        }
      }
    })
    
  }

  startPaymentGateway(mine:User){
    console.log("startPaymentGateway")
    this.placeOrder()
  }

  placeOrder(){
    console.log("placeOrder")

    const newAddress = true;
    if(newAddress){
      console.log("Save address")
    }
    this.dialogRef.close();
  }
*/


/*
cheackOut(by:string, tX:string, oferOFF:string, oferONL:string){
  this.disableForm = true;
  if( !by || !tX ){
    this.auth.resource.startSnackBar("Something went wrong...")
    this.disableForm = false;
  }else{
    let payX = ( this.campCost(tX) + (this.getMerchCost() || 0) ) - ( (oferOFF ? this.oferCost(oferOFF):0) + ( oferONL ? this.oferCost(oferONL):0) );

    const amRate = this.auth.resource.campaignPlans;
    const amCamp = this.campCost(tX);
    const amMerc = this.getMerchCost() || 0;
    const amSale = (this.campCost(tX) + ( (oferOFF ? this.oferCost(oferOFF):0) + ( oferONL ? this.oferCost(oferONL):0) ));
    const amCost = payX;
    const amSave = (oferOFF ? this.oferCost(oferOFF):0) + ( oferONL ? this.oferCost(oferONL):0);
    const amTotal = payX;

    //this.startPayment()
    console.log( amRate, amCamp, amMerc, amSale,amCost,amSave,amTotal );
    this.startPayment( by, tX, amRate, amCamp, amMerc, amSale,amCost,amSave,amTotal );
  }
}

startPayment( by:string, tX:string, amRate:any, amCamp:number, amMerc:number, amSale:number, amCost:number, amSave:number, amTotal:number ){
  let w = this.auth.resource.getWidth + "px";
  let h = this.auth.resource.getHeight + "px";

  const refDialog = this.auth.resource.dialog.open(PayComponent, {
    width: w, minWidth: w, maxWidth: w,
    height: h, 
    data:{ 
      //campID: this.userData.campID,
      from:"SIGN", tX:tX,
      type:["addBalance", "firstBalance", "vendorAc"], by, to:"Δ", amRate, amCamp, 
      amMerc, 
      amSale, amCost, amSave, 
      amTotal, userData:this.userData },
    
    disableClose: true, panelClass:"dialogLayout"//, autoFocus:false
  });
  refDialog.afterClosed().subscribe(ref =>{
    if(!ref.success){
      console.log(ref)
      this.auth.resource.startSnackBar(ref.info)
      this.disableForm = false;
    }else{
      this.auth.resource.startSnackBar("Payment Successful")
      if( this.storeTyp == 'Both' || this.storeTyp == 'Onli' ){
        this.auth.resource.router.navigate(["/store/add-product"])
      }else{
        this.auth.resource.router.navigate(["/dash"])
      }
    }
  })
  
}
*/

export class PhoneNumber {
  country: string ="91";
  iso: string ="IND";
  coin: string ="INR";
  digits: number = 10;
  area: string ="";
  prefix: string ="";
  line: string ="";
  // format phone numbers as E.164
  get e164() {
    const num = this.country + this.area + this.prefix + this.line
    return `+${num}`
  }
}


@Component({
  selector: 'bottom-sheet-otp',
  templateUrl: './bottom-sheet-otp.html',
  styleUrls: ['./bottom-sheet-otp.scss']
})
export class BottomSheetOTP implements AfterViewInit {
  otpSent = false;
  //showOtpSend = true;
  stepDisable = false;
  verificationCode = "";
  phoneNumber = new PhoneNumber();
  phoneNumFull:string = "";

  logType = "";

  constructor(
    public auth:AuthService,
    public bfRef: MatBottomSheetRef<BottomSheetOTP>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {phone: string; name: string; email: string; responded:any}
  ) {
    this.phoneNumFull = data.phone;
    this.setContactNumber();

    //if(!mine.phone){
    //}
  }

  ngAfterViewInit(): void {
    this.auth.setupReCapca();
    setTimeout(() => {
      this.execute(this.data.responded)
      //this.otpSent = true;
    }, 3000);
  }
  
  setContactNumber(){
      this.phoneNumber.area = this.phoneNumFull.slice(0,3);
      this.phoneNumber.prefix = this.phoneNumFull.slice(3,6);
      this.phoneNumber.line = this.phoneNumFull.slice(6,this.phoneNumber.digits);
  }


  execute(responded:any){
    this.sendOtp(responded, this.phoneNumber.e164)
  }

  finalRESULT(data:any){
    console.log("finalRESULT", data)
  }

  sendOtp(data:any, phone:string){
    //this.showOtpSend = false;
    /*
    this.auth.addPhoneWithOTP( phone ).then(dataV => {
      if(!dataV.success){
        console.log("SMS not sent")
        this.auth.resource.startSnackBar(dataV.info);
      }else{
        this.otpSent = true;
        this.auth.resource.startSnackBar("Sms sent on " + this.data.phone);
      }
    })
    */
    if(!data.exist){
      this.logType = "SIGN_UP";
      this.auth.verifyPhoneWithOTPX( phone, false ).then(dataV => {
        //this.auth.stepDisable = false; 
        //this.finalRESULT(dataV);
        if(!dataV.success){
          this.finalRESULT(dataV)
        }else{
          // GO FOR SIGN UP
          console.log("GO FOR SIGN UP")
          //this.auth.resource.first.reset();
          //this.auth.stepDisable = false;
          //this.auth.step = 1;
        this.otpSent = true;
        this.auth.resource.startSnackBar("Sms sent on " + this.data.phone);
        }
      })

    }else{
      this.logType = "SIGN_IN";
      this.auth.verifyPhoneWithOTPX( phone, false ).then(dataV => {

        if(!dataV.success){
          this.finalRESULT(dataV);
        }else{
          // GO FOR LOG IN
          console.log("GO FOR LOG IN")
          //this.auth.stepDisable = false;
          //this.auth.step = 5;
        this.otpSent = true;
        this.auth.resource.startSnackBar("Sms sent on " + this.data.phone);

        }
      })
      
    }
  }

  verifyOtp(){
    this.stepDisable = true;
    //this.showOtpSend = false;
    
    if(this.verificationCode?.length < 6){
      this.stepDisable = false;
      this.auth.resource.startSnackBar("issue: verification code invalid.")
    }else{/*
      this.auth.confirmationResult.confirm(this.verificationCode).then((credential:any) => {
        this.auth.addPhoneNumber(this.data.uid, this.phoneNumber.e164, this.phoneNumber.iso, this.phoneNumber.coin).then(() => {
          this.bfRef.dismiss({success:true}); 
        })
      }).catch((err:any) => {
        console.error(err);
        this.verificationCode = "";
        this.auth.resource.startSnackBar(err);
        this.stepDisable = false;
        //this.bfRef.dismiss({success:false}); 
      })*/

      if(this.logType == "SIGN_UP"){
        this.auth.confirmationResult.confirm(this.verificationCode).then((credential:any) => {
          //console.log(credential.user)
          this.auth.step2X_varifyCODE(credential, this.data.name, //pass, 
          this.phoneNumber.e164, this.phoneNumber.iso, this.phoneNumber.coin ).then(creUser => {
            //this.finalRESULT(creUser);
            //this.goToDash()
            this.bfRef.dismiss({success:true}); 
          })
        }).catch((err:any) => {
          console.error(err);
          this.verificationCode = "";
          this.auth.resource.startSnackBar(err);
        })
      }

      if(this.logType == "SIGN_IN"){
        this.auth.confirmationResult.confirm(this.verificationCode).then((credential:any) => {
          //this.goToDash()
          this.bfRef.dismiss({success:true}); 
        }).catch((err:any) => {
          console.error(err);
          this.verificationCode = "";
          this.auth.resource.startSnackBar(err);
        })
      }

    }
    
  }

  changeNumber(){
    this.bfRef.dismiss({success:false}); 
  }

}