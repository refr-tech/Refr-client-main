import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { finalize, of, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DependencyService } from 'src/app/services/dependency.service';
import { ThemeService } from 'src/app/services/theme.service';
import { SignComponent } from './sign/sign.component';
import { StepPosComponent } from './step-pos/step-pos.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, AfterViewInit, OnDestroy {

  showWeb = false;
  viaV1 = false;
  viaB1 = false; viaP1 = false;
  viaD1 = false; payID = "";
  //viaF1 = false;
  slideNow = 1;
  // net1 = false;
  // net2 = false;
  // net3 = false;
  // net4 = false;
  // net5 = false;
  // net6 = false;
  // net7 = false;
  // net8 = false;
  // net9 = false;
  // net10 = false;
  // errX:any;

  //isLoading = true;
  // wt1 = false;
  // wt2 = false;
  // wt3 = false;
  // wt4 = false;

  deathWish = false;

  constructor(
    public auth: AuthService,
    private actRoute: ActivatedRoute,
    public themeService: ThemeService,
    public depends: DependencyService,
    private snackBar: MatSnackBar,
    public platform: Platform
  ) { }

  ngOnInit(): void {
  //   console.log("MINE", "mine0")
  //   this.wt1 = true;
  // this.auth.user$.subscribe(mine =>{
  //       this.wt2 = true;
  //   if(!mine){
  //     this.wt3 = true;
  //     console.log("MINE1")

  //   }else{
  //     this.wt4 = true;
  //     console.log("MINE2", mine)
  //   }
  // })
  // .pipe(finalize(() => {
  //     this.isLoading = false; this.wt4 = true;
  //     console.log('complete!')
  //     return "444"
  // }))
  // .subscribe({
  //     next: (v) => {
  //       console.log("nextZ ", v)
  //       this.isLoading = false; this.wt1 = true;
  //       return "111"
  //   },
  //     error: (e) => {
  //       console.error("errorZ ", e)
  //       this.isLoading = false; this.wt2 = true;
  //       return "222"
  //     },
  //     complete: () => {
  //       console.info('completeZ') 
  //       this.isLoading = false; this.wt3 = true;
  //       return "333"
  //     }
  // })
    // .pipe(finalize(() => 
    // {this.isLoading = false; this.wt3 = true; console.log("Final Exam");}
    // ))/*.pipe(take(1))*/.subscribe(
    //   success => {this.isLoading = false; this.wt1 = true; console.log("success",success);},
    //   error => {this.isLoading = false; this.wt2 = true; console.log("error", error);},
    //   //() => {this.isLoading = false; this.wt3 = true; console.log("Final Exam");}
    //   /*
    //   mine => {
    //   console.log("MINE", mine)
    // }*/
    // )
  }

  ngAfterViewInit(){
    this.slideNow = 1;
      let hitURL = false;
      this.auth.resource.appLoaded$.subscribe(s => {
        console.log("MANTHAN", s)
        if(s && !hitURL && !this.deathWish){
          hitURL = true;
          this.platform.ready().then(rX => {
            this.execute()
          })
        }
      })
  }

  ngOnDestroy(){
    this.deathWish = true;
  }

  execute(){
    // this.net1 = true;
    this.auth.resource.internetConnected().then(netX => {
      // this.net2 = true;
      console.log("NetworkX T", netX)
      if( !netX ){
        // this.net3 = true;
        console.log("No Internet")
        this.offlineSetup();
      }else{
        // this.net4 = true;

    //this.auth.resource.onlineOffline().pipe(take(1)).subscribe(net => {
      //console.log("Network", net)
      //if( net ){
        /*
        this.depends.getState().pipe(take(1)).subscribe((getStateRes: any) => {
          // {
          //   vr: 101.1, 
          //   web:1.1, andi: 1.1, ios: 1.1,
          //   env: enviroment.prod,
          //   code:"Albatrosses", date: 1644195271637
          // }
          if(
            !getStateRes || 
            getStateRes.vr > environment.refrBot.vr ||
            getStateRes.web > environment.refrBot.web
            // getStateRes.andi > environment.andi
            // getStateRes.ios > environment.ios
            ){
            // vr check
            // device check
            // os check
            this.openBottomSheet(getStateRes)
          }else{
            this.auth.resource.foreignMarks = getStateRes.markets;*/
            console.log("user2")

            const newURL = this.auth.resource.router.url;
              const aR = this.actRoute.snapshot.params;
              const sid = aR["sid"];
              const F2Fcode = aR["code"];
              const F2Fwhat = aR["what"]; // later || now
              const payID = aR["payID"]; // later || now
              if(payID){
                this.payID = payID;
              }

              let v1viaCode = false;
              let b1viaCode = false; let p1viaCode = false;
              let d1viaCode = false;
              //let f1viaCode = false;

              v1viaCode = newURL.includes("/v1/") && newURL.split("/v1/")[1] && sid ? true : false;
              b1viaCode = newURL.includes("/b1/") && newURL.split("/b1/")[1] && sid ? true : false;
              p1viaCode = newURL.includes("/p1/") && newURL.split("/p1/")[1] && sid ? true : false;
              d1viaCode = newURL.includes("/d1/") && newURL.split("/d1/")[1] && sid ? true : false;
              //f1viaCode = newURL.includes("/f1/") && newURL.split("/f1/")[1] && sid ? true : false;

              //console.log("viaCode", newURL.includes("/d1/") , newURL.split("/d1/")[1] , sid)
              console.log("viaCode1", v1viaCode, b1viaCode, p1viaCode, d1viaCode //, f1viaCode
              )
              this.viaV1 = v1viaCode;
              this.viaB1 = b1viaCode; this.viaP1 = p1viaCode;
              this.viaD1 = d1viaCode;
              //this.viaF1 = f1viaCode;

              if(F2Fcode && F2Fcode.length == 6){
                // check if code exist
          this.auth.checkIfCodeExist(F2Fcode).then(ref => {
            console.log("checkIfCodeExist", ref)
          if(!ref || !ref.success){
            // Problem here
            //this.auth.resource.startSnackBar("No Such code")
          }else{
            // if yes add
            if(ref.exists){
              this.auth.refrCode = F2Fcode;
            }
          }
        })

              }

        setTimeout(() => {
          // this.net5 = true;
          console.log("user1")

          // try{
            // this.net6 = true;
            console.log("viaCode2", v1viaCode, b1viaCode, p1viaCode, 
            d1viaCode//, f1viaCode
            )

            if(this.auth.resource.updateAvil){
              console.log("UPDATE AVILABLE")
            }else{
              

          this.auth.user$.pipe(take(1)).subscribe(mine => {
            console.log("user", mine)
            // this.net7 = true;




            if(!mine){
              console.log("HINDO1")

              // this.net8 = true;
              this.showWeb = true;
              //if(!viaCode){
                console.log("HIT 1")

                if(!this.viaV1){
                  console.log("HIT 2")

            if(F2Fwhat == "now" || F2Fwhat == "later"){
                  if(!this.auth.resource.appMode){
                  this.openSignDialog( (F2Fwhat + "F2F") );
                  }else{
                  }
            }else{
              console.log("MARYADA")
              if(!this.auth.resource.appMode){
              const journeyNOW = "" + (newURL.includes("/b1/") && newURL.split("/b1/")[1] ? "B2U":"") + (newURL.includes("/p1/") && newURL.split("/p1/")[1] ? "B2P":"");
              this.openSignDialog( journeyNOW );
              }else{
              }

            }

                }else{
                  console.log("HIT 3")
                  console.log("VIA LINK UNSIGNED")
                  this.startShare(false, "", "")
                }

            }else{

            if(!this.viaV1){ // not a f2f
              const includesSavedStore = !mine.storeSav ? false : mine.storeSav?.includes(sid) ;
              this.iAmLogged(true, mine.uid, mine.name, includesSavedStore);
            }else{
              console.log("VIA LINK SIGNED")
              this.startShare(true, mine.uid, mine.name)
            }

              // this.net9 = true;
              // if(mine.storeLoc.length > 0){
              //   if(mine.storeCam.length > 0){
              //     this.auth.resource.router.navigate(["/home"])
              //   }else{
              //     // GO TO CREATE CAMP
              //     this.auth.resource.router.navigate(["/store/create-campaign"]);
              //   }
              // }else{
              //   this.auth.resource.router.navigate(['/store/create-location']);
              //   //this.activeNow = "createLocation";
              // }
              this.showWeb = true;
            }
          })

            }
          // }catch(errX){
          //   // this.net10 = true;
          //   // this.errX = errX;
          //   console.log("errX",errX)
          //   this.offlineSetup();
          // }

        }, 3000)
        
        
        
        
        
        /*
          }

        });
    */
      
      
      //}else{
        //this.offlineSetup();
      //}

    //})



      }
    }).catch(err => {
      console.log("NetworkX C", err)
      this.offlineSetup();
    })
    
  }

  offlineSetup(){
    const snackBarRef = this.snackBar.open("You are offline.", "Retry", {
      //duration: 2000, //panelClass:["b_accent","c_light"], 
      verticalPosition:"bottom", horizontalPosition:"center", 
    });
    
    snackBarRef.onAction().subscribe(() => {
      this.execute()
      console.log('The snackbar action was triggered!');
    });
  }

  openSignDialog(doSome:string){
    const aR = this.actRoute.snapshot.params;
    const sid = aR["sid"];
    const F2Fcode = aR["code"];

    console.log("HIT 5 " + doSome)
    let isPhone = this.auth.resource.getWidth < 768;
    let w = isPhone ? this.auth.resource.getWidth + "px" : "480px";
    let h = isPhone ? this.auth.resource.getHeight + "px" : "";
    const refDialog = this.auth.resource.dialog.open(SignComponent, {
      width: w, minWidth: "320px", maxWidth: "480px",
      height:h,
      hasBackdrop:false,
      disableClose: true, panelClass:"dialogLayout",// autoFocus:false
      data: {type: doSome, code: F2Fcode, sid: sid}
    });
    
    refDialog.afterClosed().subscribe(ref =>{
      this.auth.step = 0;
      this.auth.stepDisable = false;
      this.auth.verificationId = "";
      this.auth.resource.first.setValue("");
      this.auth.resource.last.setValue("");
      this.auth.resource.pass.setValue("");
      this.auth.resource.first.enable();
      this.auth.resource.last.enable();
      this.auth.resource.pass.enable();

      console.log("MEGAMAN 1")
      if(!ref){

      }else{
        console.log("MEGAMAN 2")
        if(
          ref.success && ref.uid && doSome == "POS" || ref.success && ref.uid && doSome == "B2U" || ref.success && ref.uid && doSome == "B2P"
        ){
          this.iAmLogged(false, ref.uid, ref.name, !ref.includesSavedStore );
          console.log("I AM TOM")
        }else{
          console.log("I AM SHAM")
        }

        //if(ref.success && ref.uid && doSome == "F2Fcode"){
        if(ref.success && ref.uid && doSome == "F2F"){
          const aR = this.actRoute.snapshot.params;
          const sid = aR["sid"];
          const F2Fcode = aR["code"];
          const F2Fwhat = aR["what"]; // later || now
          console.log("MEGAMAN", F2Fwhat, F2Fcode)
        }
        // if(ref.success && ref.uid && doSome == "F2Fcode"){
        //   // check if code exist
        //   this.auth.checkIfCodeExist(this.refrCode).then(ref => {
        //     console.log("checkIfCodeExist", ref)
        //   if(!ref || !ref.success){
        //     // Problem here
        //     this.auth.resource.startSnackBar("No Such code")
        //     this.auth.resource.router.navigate(["/"])
        //   }else{
        //   // if yes add
        //   }
        //     this.auth.resource.router.navigate(["/sync-contacts"])
        // })

        // }
        //if(doSome == ""){
  
        //}
      }

    })
  }
  
  startShare(via:boolean, uid:string, name:string){
    //console.log("Hit 4" + via + uid + name)
    // check if such store exist
    // check if such store exist

        const dialogRef = this.auth.resource.dialog.open(StepPosComponent, {
          maxWidth: '100vw',
          maxHeight: '100vh',
          width: '320px',
          panelClass:'bottomSheetClassDO',
          disableClose: true,
          //data:{id:"id"}
        });
        dialogRef.afterClosed().subscribe(() =>{
          if(!uid){
            // sign in then share
            console.log("sign in then share")
            const newURL = this.auth.resource.router.url;
            const journeyNOW = "" + (newURL.includes("/v1/") && newURL.split("/v1/")[1] ? "POS" : "");
            this.openSignDialog( journeyNOW)
            // sign in then share
          }else{
            this.iAmLogged(via, uid, name, false);
          }
        })
  }

  iAmLogged( via:boolean, 
    uid:string, name:string, includesSavedStore:boolean){
    const newURL = this.auth.resource.router.url;
    console.log(newURL)
    if(!newURL || newURL == "/"){
      this.auth.resource.router.navigate(["/home"])
    }else{

      const aR = this.actRoute.snapshot.params;
      const sid = aR["sid"];
      if( 
        newURL.includes("/v1/") && newURL.split("/v1/")[1] && sid || 
        newURL.includes("/b1/") && newURL.split("/b1/")[1] && sid || //newURL.includes("/p1/") && newURL.split("/p1/")[1] && sid ||
        newURL.includes("/d1/") && newURL.split("/d1/")[1] && sid
        //newURL.includes("/f1/") && newURL.split("/f1/")[1] && sid
      ){
        console.log("MOONWALK")



          this.auth.getCode(uid, sid).then(currentInfo => {
            console.log("currentInfo", currentInfo)
            if(!currentInfo || !currentInfo.success){
              console.log("currentInfo Fail")

            }else{
            console.log(currentInfo)
            if(currentInfo.existCode){


          const xURL = "/store/" + sid + "-" + currentInfo.current + 
          ( newURL.includes("/d1/") ? ( "-" + this.payID ):"") +"/" + 

          ( newURL.includes("/v1/") ? "sharePOS":"") + 
          ( newURL.includes("/b1/") ? "shareB2U":"") + //( newURL.includes("/p1/") ? "shareB2P":"") + 
          ( newURL.includes("/d1/") ? "shareD2U":"") + 
          //( newURL.includes("/f1/") ? "shareF2U":"") + 
          
          "";
          console.log(xURL)
          // NAVIGATE TO SHARE
          this.auth.resource.router.navigate([xURL])
          // NAVIGATE TO SHARE


            }else{

              this.auth.checkIfCodeExist(currentInfo.current).then(ref => {
                if(!ref || !ref.success ){
                  //this.auth.resource.router.navigate([""])
                  this.auth.resource.startSnackBar("No such code.")
                }else{

                  if(!ref.exists){

              this.depends.getCODE("IN", "codes").subscribe((be:any) => {
                if(!be || !be.success){
      
                }else{
                  // set a new code
                  const method = "" + 
                  ( newURL.includes("/v1/") ? "POS":"") + 
                  ( newURL.includes("/b1/") ? "B2U":"") + //( newURL.includes("/p1/") ? "B2P":"") + 
                  ( newURL.includes("/d1/") ? "D2U":"") + 
                  //( newURL.includes("/f1/") ? "F2U":"") + 
                  "";
                  
      this.auth.getStore(sid).pipe(take(1)).subscribe((storeX:any) => {
        console.log("storeX", storeX)

        if(!storeX || !storeX.id){
          this.auth.resource.startSnackBar("No Such Store")
        }else{

      const title = storeX.name || "The store has no title."; 
      const about = storeX.about || "The store has no describtion.";
      const image = storeX.banner || "https://firebasestorage.googleapis.com/v0/b/refr/o/opengraph.png?alt=media&token=87b5c5d3-f7a1-42d6-ab4e-65eb17deccf5";

      console.log("WALTER", be.data.code )
      
      this.auth.createCode(uid, name, sid, be.data.code, //data.currentCode, data.newCode, 
        method, title, about, image).then(() => {
        const xURL = "/store/" + sid + "-" + currentInfo.current + "/" + 
        ( newURL.includes("/v1/") ? "sharePOS":"") +
        //+ ( newURL.includes("/b1/") ? "shareB2U":"")
        ( newURL.includes("/d1/") ? ( this.payID + "/shareD2U"):"") +
        //( newURL.includes("/f1/") ? "shareF2U":"") +
        "";


        // NAVIGATE TO SHARE
        this.auth.resource.router.navigate([xURL])
        // NAVIGATE TO SHARE
      }).catch(err => {
        console.log(err)
        this.auth.resource.startSnackBar("Issue Creating Code")
      })
      
    }
  })
    }


              })

                  }

                }
              })

/*
              this.auth.checkIfCodeExist(currentInfo.current).then(ref => {
                if(!ref || !ref.success ){
                  //this.auth.resource.router.navigate([""])
                  this.auth.resource.startSnackBar("No such code.")
                }else{

                  if(!ref.exists){
              this.depends.convertCODE("IN", "codes", currentInfo.current).subscribe((be:any) => {
                if(!be || !be.success){
      
                }else{
                  // save new code
                  const data = {
                    currentCode: be.data.currentCode,
                    newCode: be.data.code,
                  }
      // set a new code
      const method = "" + ( newURL.includes("/v1/") ? "POS":"") + ( newURL.includes("/b1/") ? "B2U":"");






      this.auth.getStore(sid).pipe(take(1)).subscribe((storeX:any) => {
        console.log("storeX", storeX)

        if(!storeX || !storeX.id){
          this.auth.resource.startSnackBar("No Such Store")
        }else{


      const title = storeX.name || "The store has no title."; 
      const about = storeX.about || "The store has no describtion.";
      const image = storeX.banner || "https://firebasestorage.googleapis.com/v0/b/refr/o/opengraph.png?alt=media&token=87b5c5d3-f7a1-42d6-ab4e-65eb17deccf5";

      console.log("WALTER", data.newCode )
      this.auth.setCode(uid, name, sid, data.currentCode, data.newCode, method, title, about, image).then(() => {
        //const code = "A23z56";
      //this.depends.setUpFDL( data.currentCode ).then(() => {

          //setTimeout(() => {
            
        const xURL = "/store/" + sid + "-" + currentInfo.current + "/" + ( newURL.includes("/v1/") ? "sharePOS":"") //+ ( newURL.includes("/b1/") ? "shareB2U":"")
        console.log(xURL)
          // NAVIGATE TO SHARE
          this.auth.resource.router.navigate([xURL])
          // NAVIGATE TO SHARE

          //}, 3000);
      //})
        

      }).catch(err => {
        console.log(err)
        this.auth.resource.startSnackBar("Issue Creating Code")

      })
      // set a new code



        }
      })



                }
              })
                  }  

                }
              })
*/


              
            }


            }
          })



        // if(via){
        //   console.log("HIT 5")


        // }else{
        //   console.log("HIT 6")



        // }


            //console.log(ref)
            // CREATE SHARE CODE IF NOT THERE
            // CREATE SHARE CODE IF NOT THERE
      }

      if(newURL.includes("/p1/") && newURL.split("/p1/")[1] && sid){
        console.log("SUNWALK")
        // SAVE STORE TO MY ACCOUNT THEN GO TO STORE
        const xURL = "/store/" + sid;
        if(!includesSavedStore){
          this.auth.saveToVendorLink(uid, sid).then(() => {
            this.auth.resource.router.navigate([xURL])
          })
        }else{
          this.auth.resource.router.navigate([xURL])
        }

      }

    }
  }

}
