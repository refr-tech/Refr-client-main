import { ChangeDetectorRef, Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
//import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { DependencyService } from './services/dependency.service';
import { ThemeService } from './services/theme.service';

//import { SplashScreen } from '@capacitor/splash-screen';
//import { StatusBar, Style, BackgroundColorOptions } from '@capacitor/status-bar';

//import { initializeApp } from 'firebase/app';
//import { indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { Capacitor } from '@capacitor/core';
//import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Refr';
  showWarn = false;

  navC = 0;

  constructor(
    public auth: AuthService,
    public depends: DependencyService,
    public themeService: ThemeService,
    private bottomSheet: MatBottomSheet,
    private cd: ChangeDetectorRef,
    private router: Router,
    public platform: Platform
  ){

    // const app = initializeApp(environment.firebase);
    //if (Capacitor.isNativePlatform()) {
      //console.log("isNativePlatform")
      // initializeAuth(app, {
      //   persistence: indexedDBLocalPersistence
      // });
    //}

    //if(auth.resource.appMode){
      //this.executeApp( this.themeService.currentActive() == 'dark' ? "#000000":"#ffffff");
    //}

    

    // Load Color Scheme
    this.themeService.load();

    this.platform.ready().then(rX => {
      //auth.resource.startSnackBar("Ready" + rX)
      //auth.resource.appStarted.subscribe(r => r = true)
    this.internetChecks();
    })

  }

  async getLaunchUrl(){
    var route = this.router; // Assign router locally
    console.error("MAN0") 

    //const lo = await Capacitor.isNativePlatform()
    //if(lo){
    //}

    //let makingOut = false;
    // Handle the logic here after opening the app with the Dynamic link
            //this.auth.resource.startSnackBar("SomeBody")

    this.depends.firebaseDynamicLinks.onDynamicLink().subscribe({
      next: (v) => {
        console.error("MAN1")
        //this.auth.resource.startSnackBar("SomeBody" + v.deepLink)
        
  //this.navC++
  //this.auth.resource.startSnackBar(this.navC + " LinkD: " + v.deepLink)

if ( //Capacitor.isNativePlatform() && 
v.deepLink.includes("app.refr.club") && v.deepLink.split("app.refr.club")[1] ) {
  //this.auth.resource.startSnackBar("HIT 1")
  //this.cd.detectChanges();

  this.auth.resource.dialog.closeAll();

      //console.log(res)
      //if(res.deepLink && !makingOut){
        //makingOut = true;
        const navURL = v.deepLink.split("app.refr.club")[1];
        if(navURL){
          this.navC++
          route.navigate([navURL]).then(x => {
            this.navC++
            console.log(x)
            this.cd.detectChanges();
            //this.auth.resource.startSnackBar(this.navC + " Link: " + navURL + " " + x)
          })
          // //this.router.navigate([navURL])
          // this.auth.resource.router.navigateByUrl(navURL)
          // //this.cd.detectChanges();
          //this.navigateX(navURL)
        }
        // do something with link
        //setTimeout(() => {
          //makingOut = false;
        //}, 3000);
        // do something with link
      //}

}



      },
      error: (e) => {
        console.error("MAN2", e)
      },
      complete: () => {
        console.info("MAN3", 'complete') 

      }
  }
      
      
      /*(res:IDynamicLink) => {


    }, (error:any) => {
      //console.log(error)
      this.auth.resource.startSnackBar("Err:" + error)
    }, () => {}
    */
    );


    let FirstHit = false;
    this.depends.firebaseDynamicLinks.getDynamicLink().then(v => {
      //this.auth.resource.startSnackBar("AnyBody" + pLink.deepLink)
      if ( !FirstHit && //Capacitor.isNativePlatform() && 
      v.deepLink.includes("app.refr.club") && v.deepLink.split("app.refr.club")[1] ) {
        //this.cd.detectChanges();
        this.auth.resource.dialog.closeAll();
      
            //console.log(res)
            //if(res.deepLink && !makingOut){
              //makingOut = true;
              const navURL = v.deepLink.split("app.refr.club")[1];
              if(navURL){
                this.navC++
                route.navigate([navURL]).then(x => {
                  this.navC++
                  console.log(x)
                  this.cd.detectChanges();
                  //this.auth.resource.startSnackBar(this.navC + " Link: " + navURL + " " + x)
                })
                // //this.router.navigate([navURL])
                // this.auth.resource.router.navigateByUrl(navURL)
                // //this.cd.detectChanges();
                //this.navigateX(navURL)
              }
              // do something with link
              //setTimeout(() => {
                //makingOut = false;
              //}, 3000);
              // do something with link
            //}
      
            //setTimeout(() => {
              //this.completeGLOBAL()
              //}, 3000);
      }else{
        //this.completeGLOBAL()

      }
      
    }).catch(err => {
      this.platform.ready().then(rX => {
        //this.auth.resource.startSnackBar("Ready" + rX)
        if(rX == "dom"){
        //this.completeGLOBAL()
        console.log("MANTHAN err")
        }
      })
    }).finally(() => {
      if(!FirstHit){
        FirstHit = true;
      console.log("MANTHAN final")
      this.completeGLOBAL()
      //this.auth.resource.startSnackBar("HIT 2")
      }
    })
    /*
    await Plugins["App"]["addListener"]('appUrlOpen', (urlOpen: any) => {
      console.log('App URL Open', urlOpen);
      //this.navigate(urlOpen.url);
     //this.resource.goTo = "DEEPLINKS " + urlOpen.url;
     if(urlOpen.url){
      this.auth.resource.startSnackBar("000" + urlOpen.url)
       const x = urlOpen.url.split("app.refr.club/")
       if(x[1] //&& z !== x[1]
        ){
          this.auth.resource.startSnackBar("hiii" + x)
        //this.resource.megaMind.push("New Wales")
         //z = x[1];
         //this.router.navigate(['/' + x[1]])
       }else{
         //this.resource.megaMind.push("New York")
       }

     }
    });
    */
  }




  async executeApp(cX:string){
    // Hide the splash (you should do this on app launch)
    //await SplashScreen.hide();
    // Display content under transparent status bar (Android only)
    //StatusBar.setOverlaysWebView({ overlay: true });
    
    //await StatusBar.setStyle({ style: Style.Dark });
    // await StatusBar.setStyle({ style: Style.Light });
    //await StatusBar.setStyle({ style: Style.Default });
    ////await StatusBar.setBackgroundColor({color:cX})
    //await StatusBar.hide();
  }
  
  internetChecks(){
    let firstTry = false;
    this.auth.resource.internetConnected().then(res => {
      if(!res){
        this.showWarn = true;
        console.log("No Internet...")
        this.auth.resource.startSnackBar("No Internet...")
      }else{
        //this.showWarn = true;
        setTimeout(() => {
          this.showWarn = false;  
          if(!firstTry){
          firstTry = true;  
          this.execute();
          }
        }, (!firstTry ? 1000 : 3000));
      }
    }).catch(err => {
      console.log("No Internet...")
      this.auth.resource.startSnackBar("No Internet: " + err)
    })
  }
  

  execute(){
    if(this.auth.resource.appMode && environment.production){
      //this.executeApp("#512DA8");
    }
    // Setup Data for resources
    console.log("Setup Data for resources")
    //this.auth.resource.onlineOffline().pipe(take(1)).subscribe(net => {
      //if( net ){
        this.depends.getState()/*.pipe(take(1))*/.subscribe((getStateRes: any) => {
          console.log("Setup Data for resources 1")
          // {
          //   vr: 101.1, 
          //   web:1.1, andi: 1.1, ios: 1.1,
          //   env: enviroment.prod,
          //   code:"Albatrosses", date: 1644195271637
          // }
          if(
            !getStateRes || 
            getStateRes.vr > environment.refrBot.vr ||
            !this.auth.resource.appMode && getStateRes.web > environment.refrBot.web ||
            this.auth.resource.appMode && getStateRes.andi > environment.refrBot.andi
            // getStateRes.ios > environment.ios
            ){
            // vr check
            // device check
            // os check
            this.auth.resource.updateAvil = true;
            this.openBottomSheet(getStateRes)
          }else{
            console.log("Setup Data for resources 2")
            this.auth.resource.foreignMarks = getStateRes.markets;
            this.auth.resource.merchandiseList = getStateRes.merchandise;
            console.log("Setup Data for resources 2")
            this.auth.getCategoryList()/*.pipe(take(1))*/.subscribe({
              complete: () => { 
                console.log("Setup Data for resources 4")  
               }, // completeHandler
              error: (e) => { 
                console.log("Setup Data for resources 3")
                console.log("Setup Data for resources 3", e)
               },    // errorHandler 
              next: (cat) => { 
                console.log(cat)
                this.auth.resource.categoryList = cat;
                console.log("Setup Data for resources 4", cat) 

                if(this.auth.resource.appMode){
                  console.log("Setup Data for resources 5" ) 
                  setTimeout(() => {
                    this.getLaunchUrl()
                  }, 3000);

                  //   let hitURL = false;
                  //   this.auth.resource.appLoaded.subscribe(s => {
                  //     console.log(s)
                  //     if(s && !hitURL){
                  //       hitURL = true;
                  //       this.getLaunchUrl()
                  //     }
                  //   })
                }else{
                  console.log("Setup Data for resources 6" ) 
                    this.completeGLOBAL()
                }

               },     // nextHandler
              //someOtherProperty: 42
          }
              /*
              cat => {
                console.log(cat)
                this.auth.resource.categoryList = cat;
                console.log("Setup Data for resources 3")    
              }, error => {
                console.log("Setup Data for resources 3", error)
                
              }, () => {
                console.log("Setup Data for resources 4")   
              }
              */
              /*
              cat => {
              console.log(cat)
              this.auth.resource.categoryList = cat;
              console.log("Setup Data for resources 3")
            }
            */
            )
          }

        });
      //}else{

      //}
    //})
  }

  openBottomSheet(data:any): void {
    // let isPhone = this.auth.resource.getWidth < 768;
    // let w = isPhone ? this.auth.resource.getWidth + "px" : "480px";
    // let h = isPhone ? this.auth.resource.getHeight + "px" : "";

    this.bottomSheet.open(BottomSheetUpdate, {
      data: data, panelClass:"bottomSheetClassUpdate", hasBackdrop: true,
      disableClose: true
    });
  }

  completeGLOBAL(){
    this.auth.resource.appLoaded$.next(true)
    //this.auth.resource.appLoaded.subscribe( x => x=true)
    //this.auth.resource.appLoaded = of(true);
    this.cd.detectChanges();
  }
}

@Component({
  selector: 'bottom-sheet-update',
  templateUrl: './tasks/bottom-sheet-update.html',
})
export class BottomSheetUpdate {

  constructor(
    public auth:AuthService
  ) {
  }

}
