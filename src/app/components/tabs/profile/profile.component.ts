import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';

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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  dataCurrent:any;
  makingChanges = true;
  userExist = true; userCheck = false;

  phoneNumber = new PhoneNumber();
  phoneNumFull:string = "";
  verificationCode:string = "";
  step = 0;
  
  constructor(
    public themeService: ThemeService,
    public auth: AuthService
  ) { }


  ngOnInit(): void {
    this.auth.user$.pipe(take(1)).subscribe(user => {
      const data = {
        //false, user.username, 
        name: user.name || "", 
        soIG:user.soIG, soYT:user.soYT, soTW:user.soTW, soWA:user.soWA,
        //user.info, user.url, user.typ, user.sex, user.stat, user.check, 
        uid: user.uid, iso: user.iso || "",
        phoneNumFull: user.phone.split("+91")[1] || ""
      }
      this.changeAbout(data)

    })
  }

  setContactNumber(){
    console.log(this.phoneNumFull)
    // if(!know){
    //   this.phoneNumber.area = "";
    //   this.phoneNumber.prefix = "";
    //   this.phoneNumber.line = "";
    // }else{
      this.phoneNumber.area = this.phoneNumFull.slice(0,3);
      this.phoneNumber.prefix = this.phoneNumFull.slice(3,6);
      this.phoneNumber.line = this.phoneNumFull.slice(6,this.phoneNumber.digits);
    //}
  }

  // getX(x:any){
  //   return x
  // }

  changeAbout(data:any): void{
    this.dataCurrent = data;
      this.auth.resource.first.setValue( data.name );
      //this.auth.resource.first.setValue( data.name.split(' ')[0] );
      //this.auth.resource.last.setValue( data.name.split(' ')[1] || "");
      if(data.phoneNumFull){
        this.phoneNumFull = data.phoneNumFull;
        this.setContactNumber();
      }
      this.makingChanges = false;
  }

  updateName(uid:string){
    this.makingChanges = true;
    this.auth.resource.first.disable();
    //this.auth.resource.last.disable();
    if( this.auth.resource.first.invalid //|| this.auth.resource.last.invalid 
      ){
      this.auth.resource.first.enable();
      //this.auth.resource.last.enable();
      this.makingChanges = false;
      this.auth.resource.startSnackBar("issue: format must be A-Za-z.")
    }else{
      
      const newName = this.auth.resource.first.value; //+ (this.auth.resource.last.value ? (" " + this.auth.resource.last.value) : "");
      console.log(this.dataCurrent.name, newName)
      this.auth.updateUserBio(
        uid, this.dataCurrent.name, newName,
        this.dataCurrent.soIG, this.dataCurrent.soYT,this.dataCurrent.soTW,this.dataCurrent.soWA,
        //this.dataCurrent.username, this.dataCurrent.info, this.dataCurrent.url, this.dataCurrent.typ, this.dataCurrent.sex, this.dataCurrent.stat 
        ).then(() => {
        this.dataCurrent.name = newName;
        this.auth.resource.startSnackBar("Name Update Under Review!");
        //this.dialogRef.close();
        this.auth.resource.first.enable();
        //this.auth.resource.last.enable();
        this.makingChanges = false;
      });
    }
  }


  step0(){//FIGREOUT USER > NEW=SIGNUP|OLD=LOGIN
    let validatePhone = this.phoneNumber.country + this.phoneNumber.area + this.phoneNumber.prefix + this.phoneNumber.line;
    if( this.auth.resource.invalidPhone(validatePhone) ){
      this.auth.resource.startSnackBar("issue: format must be 0-9.")
    }else{
      const step0_CheckUserExist = this.auth.step0_userForward( this.phoneNumber.e164, true );
      step0_CheckUserExist.then((data:any) =>{
        console.log("Indian", data)
        if(!data.success){
          if(data.info == "401" || data.code == "auth/user-disabled"){
            this.auth.stepDisable = false;
            this.auth.resource.startSnackBar("The account associated has been disabled!")
          }
        }else{
          if(data.exist){
            this.auth.stepDisable = false;
            this.auth.resource.startSnackBar("The phone number is already associated with another account");
            //this.phoneNumber.country = "";
            this.phoneNumber.area = "";
            this.phoneNumber.prefix = "";
            this.phoneNumber.line = "";
          }else{
            this.step = 1;
            this.auth.stepDisable = false;
            this.auth.setupReCapca()
            //this.startPhoneAdd()
          }
        }
      })
    }
  }

  // startPhoneAdd(){
  //   this.auth.step4_resetLogin( this.phoneNumber.e164 ).then(data => {
  //     //this.finalRESULT(data);
  //   })
  //   const stepAdd_USERS_PHONE = this.auth.stepAdd_USERS_PHONE( this.phoneNumber.e164, //validatePassword, 
  //     this.phoneNumber.iso, this.phoneNumber.coin );
  // }

  step1(){//CREATE NEW USER
    // this.auth.resource.first.disable();
    // this.auth.resource.last.disable();
    this.auth.resource.pass.disable();

    let validatePassword = this.auth.resource.pass.value;
    if( this.auth.resource.invalidPassword(validatePassword) ){
      this.auth.resource.pass.setValue("");
      // this.auth.resource.first.enable();
      // this.auth.resource.last.enable();
      this.auth.resource.pass.enable();
      this.auth.resource.startSnackBar("issue: format must be 0-9A-Za-z@.")
    }else{
      this.auth.verifyPhoneWithOTP(this.phoneNumber.e164, true).then(data => {
        //this.finalRESULT(data);
        if(!data.success){
          if(data.info !== "401"){
            this.auth.stepDisable = false;
            this.auth.resource.startSnackBar(data.info)
          }else{
            this.auth.stepDisable = false;
            this.auth.resource.startSnackBar("issue: Dirty Data!")
          }
        }else{
          this.step = 2;
          this.auth.stepDisable = false;
        }
      });
      // stepAdd_USERS_PHONE.then(data => {

      // })
    }
  }

  step2(){
    if(this.verificationCode?.length < 6){
      this.auth.resource.startSnackBar("issue: verification code invalid.")
    }else{
      this.auth.step2_varifyCODE(this.verificationCode, this.phoneNumber.e164,// "", ""
      ).then(data => {
        //this.auth.resource.playSound('beep')
        //this.finalRESULT(data);
        if(!data.success){
          if(data.info !== "401"){
            this.auth.stepDisable = false;
            this.auth.resource.startSnackBar(data.info)
          }else{
            this.auth.stepDisable = false;
            this.auth.resource.startSnackBar("issue: Dirty Data!")
          }
        }else{
          this.step = 0;
          this.auth.stepDisable = false;
        }
      })
    }
  }

  addGoogle(state:boolean, hasfacebook:boolean){//FIGREOUT USER > NEW=SIGNUP|OLD=LOGIN
    if(state){
      this.auth.resource.startSnackBar("The account is already associated with a google account.")
    }else{
      this.auth.googleSync(hasfacebook).then(data => {
        console.log("Man", data)
        if(!data.success){
          this.auth.resource.startSnackBar(data.info)
        }else{

        }
      })
      //this.auth.resource.startSnackBar("Comming Soon...")
    }
  }

  addFacebook(state:boolean, hasgogle:boolean){//FIGREOUT USER > NEW=SIGNUP|OLD=LOGIN
    if(state){
      this.auth.resource.startSnackBar("The account is already associated with a facebook account.")
    }else{
      this.auth.facebookSync(hasgogle)
      //this.auth.resource.startSnackBar("Comming Soon...")
    }
  }

}
