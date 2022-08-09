import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import { ScannerComponent } from 'src/app/placeholders/scanner/scanner.component';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, AfterViewInit {
  title = 'Refr';
  infocus = false;

  constructor(
    public router: Router,
    public auth: AuthService,
    private bottomSheet: MatBottomSheet,
    
    private barcodeScanner: BarcodeScanner
  ) { }

  ngOnInit(): void {
/*
menu_position = menu_current_item.offsetLeft - 16;
menu_indicator.style.left = menu_position + "px";
menu_bar.style.backgroundPosition = menu_position-8 + 'px';
menu_item.forEach(() =>
  (select_menu_item: any){
    select_menu_item.addEventListener('click', function(e){
      e.preventDefault();
      menu_position = this.offsetLeft - 16;
      menu_indicator.style.left = menu_position + "px";
      menu_bar.style.backgroundPosition = menu_position-8 + 'px';
      [...select_menu_item.parentElement.children].forEach(
        sibling => {
          sibling.classList.remove('sc-current');
        })
      select_menu_item.classList.add('sc-current');
    });
  }
)
*/
  }

  ngAfterViewInit(){
    // let menu_bar:any = document.querySelector('.sc-bottom-bar');
    // let menu_item = document.querySelectorAll('.sc-menu-item');
    // let menu_indicator:any = document.querySelector('.sc-nav-indicator');
    // let menu_current_item:any = document.querySelector('.sc-current');
    // let menu_position;

    //menu_position = (menu_current_item.offsetLeft || 0) - 16;
    //menu_indicator.style.left = menu_position + "px";
    //menu_bar.style.backgroundPosition = menu_position-8 + 'px';
  }


  get getLocState(){
    if(this.auth.myLoc){
      return true
    }else{
      return false
    }
  }

  getIndiWidth(){
    return this.auth.resource.getWidth > 360 ? (360/5) : (this.auth.resource.getWidth / 5)
  }

  openBottomSheet(notes:any): void {
    // let isPhone = this.auth.resource.getWidth < 768;
    // let w = isPhone ? this.auth.resource.getWidth + "px" : "480px";
    // let h = isPhone ? this.auth.resource.getHeight + "px" : "";

    this.bottomSheet.open(BottomSheetNotification, {
      data: { notes: notes }, panelClass:"bottomSheetClass", //hasBackdrop: false,
    });
  }
  
  async scanOR(){
    if(!this.auth.resource.appMode){
      let isPhone = this.auth.resource.getWidth < 768;
      let w = isPhone ? (this.auth.resource.getWidth - 16) + "px" : "440px";
      //let h = isPhone ? this.auth.resource.getHeight + "px" : "";
      const refDialog = this.auth.resource.dialog.open(ScannerComponent, {
        width: w, minWidth: "320px", maxWidth: "440px",
        disableClose: true,
        panelClass:"dialogClass"
      });
      refDialog.afterClosed().subscribe(result=>{
        if(result){
          console.log(result.content); // log the raw scanned content
          //const xURL = result.content.split("https://app.refr.club/");
          //const xURL = result.content.split("https://getrefr.in/");

          // if(xURL[1]){
          //   this.auth.resource.router.navigate(["/" + xURL[1] ])
          // }
            if(result.text.includes("https://refrclub.com/o/")){
              window.location.href = result.content;
            }
        }
      })
    }else{
        //const status = 
        //await BarcodeScanner.checkPermission({ force: true });
      
        //if (!status.granted) {
          // the user granted permission
          //this.auth.resource.startSnackBar("Please provide permition to use camera.")
        //}else{
          //if(await !this.didUserGrantPermission()){
            //this.auth.resource.startSnackBar("Please provide camera permissions.")
          //}else{
          
      try{
        const result = await this.barcodeScanner.scan()
        //bS.
        //.then(result => {

          if (result.text) {
            if(result.text.includes("https://refrclub.com/o/")){
            window.location.href = result.text;
            }


            //if(result.text.includes("https://app.refr.club/")){
            // if(result.text.includes("https://getrefr.in/")){
            //   console.log(result.text); // log the raw scanned content
            //   //const xURL = result.text.split("https://app.refr.club/");
            //   // const xURL = result.text.split("https://getrefr.in/");
            //   // if(!xURL[1]){ // FOR POS
            //   //   this.auth.resource.router.navigate([""])
            //   // }else{
            //   //   this.auth.resource.router.navigate(["/" + xURL[1] ])
            //   // }
            // }else{
            //   this.auth.resource.startSnackBar("Invalid QR code")
            // }

          }

        // }).catch(err => {
        //   console.log(err)
        //   this.auth.resource.startSnackBar(err)
        // });
        // if the result has content
      }catch(err){
        console.log(err)
        this.auth.resource.startSnackBar(err)
      }

          //}
        //}

    }
  }

/*
  didUserGrantPermission(){
    return async () => {
    // check if user already granted permission
    const status = await BarcodeScanner.checkPermission({ force: false });
  
    if (status.granted) {
      // user granted permission
      return true;
    }
  
    if (status.denied) {
      // user denied permission
      //return false;
    }
  
    if (status.asked) {
      // system requested the user for permission during this call
      // only possible when force set to true
    }
  
    if (status.neverAsked) {
      // user has not been requested this permission before
      // it is advised to show the user some sort of prompt
      // this way you will not waste your only chance to ask for the permission
      const c = confirm(
        'We need your permission to use your camera to be able to scan barcodes',
      );
      if (!c) {
        //return false;
      }
    }
  
    if (status.restricted || status.unknown) {
      // ios only
      // probably means the permission has been denied
      return false;
    }
  
    // user has not denied permission
    // but the user also has not yet granted the permission
    // so request it
    const statusRequest = await BarcodeScanner.checkPermission({ force: true });
  
    if (statusRequest.asked) {
      // system requested the user for permission during this call
      // only possible when force set to true
    }
  
    if (statusRequest.granted) {
      // the user did grant the permission now
      return true;
    }
  
    // user did not grant the permission, so he must have declined the request
    return false;
  };
}
*/

}




@Component({
  selector: 'bottom-sheet-notification',
  templateUrl: './bottom-sheet-notification.html',
})
export class BottomSheetNotification {
  notes:any = [];

  constructor(
    private bsRef: MatBottomSheetRef<BottomSheetNotification>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private auth: AuthService
  ) {
    this.notes = data.notes;
  }

  openLink(): void {
    this.bsRef.dismiss();
  }

  clearNotifications(){
    this.auth.clearNotifications()
    this.bsRef.dismiss();
  }


}