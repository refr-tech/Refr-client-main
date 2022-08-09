import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';

//import * as QRCodeStyling from "qr-code-styling";
import QRCodeStyling, { Extension } from 'qr-code-styling';
import { Observable, of, take } from 'rxjs';
import { User } from 'src/app/universal.model';
import { PaymentService } from 'src/app/services/payment.service';
import { AddBalanceComponent } from './add-balance/add-balance.component';

import { ScannerComponent } from 'src/app/placeholders/scanner/scanner.component';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasX', { static: false }) canvasX: ElementRef | undefined;

  userID = "";
  storeID = "";
  qrCode:any = null;
  showCode = false;

  store$: Observable<any> = of();
  payments$: Observable<any> = of();
  

  constructor(
    public themeService: ThemeService,
    public auth: AuthService,
    public pay: PaymentService,
    
    private barcodeScanner: BarcodeScanner,
  ) { }

  ngOnInit(): void {}


  ngAfterViewInit(): void {
    this.auth.user$.pipe(take(1)).subscribe((mine:any) => {
      if(!mine){

      }else{
            this.userID = mine.uid;
        this.execute(mine);
        if(mine.storeLoc?.length > 0){
            this.storeID = mine.storeLoc[0];
          if(mine.storeCam?.length > 0){
            this.execute(mine);
          }else{
            console.log("CREATE CAMP")
            // GO TO CREATE CAMP
            //this.auth.resource.router.navigate(["/store/create-campaign"]);
          }
        }else{
          console.log("CREATE STORE")
          // GO TO CREATE STORE
          //this.auth.resource.router.navigate(["/store/create-location"]);
        }
      }
      
    })
    
  }

  // onKey(event: any): void {
  //   this.data = event.target.value;
  //   this.qrCode.update({
  //     data: this.data
  //   });
  // }

  //onChange(event: any): void {
    //this.extension = event.target.value;
  //}
/*
  download(extension:string): void {
    if(extension){
      this.qrCode.download({ extension: extension as Extension });
    }
  }
*/
  execute(mine:User){
  /*
    this.qrCode = new QRCodeStyling({
      width: 200,
      height: 200,
      type: 'svg',
      data: 'https://refr.club/v1/' + this.userID,
      image: 'https://firebasestorage.googleapis.com/v0/b/refr/o/locate.svg?alt=media&token=e23de5bd-4a26-4a9e-bb63-bc9e3a87b29c',
      margin: 0,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'Q'
      },
      // imageOptions: {
      //   hideBackgroundDots: false,
      //   imageSize: .8,
      //   margin: 0,
      //   crossOrigin: 'anonymous',
      // },
      dotsOptions: {
        color: '#000000',
        // gradient: {
        //   type: 'linear', // 'radial'
        //   rotation: 0,
        //   colorStops: [{ offset: 0, color: '#8688B2' }, { offset: 1, color: '#77779C' }]
        // },
        type: 'dots'
      },
      backgroundOptions: {
        color: "rgba(255, 255, 255, 0%)",
        // gradient: {
        //   type: 'linear', // 'radial'
        //   rotation: 0,
        //   colorStops: [{ offset: 0, color: '#ededff' }, { offset: 1, color: '#e6e7ff' }]
        // },
      },
      cornersSquareOptions: {
        color: '#512da8',
        type: 'dot',
        // gradient: {
        //   type: 'linear', // 'radial'
        //   rotation: 180,
        //   colorStops: [{ offset: 0, color: '#25456e' }, { offset: 1, color: '#4267b2' }]
        // },
      },
      cornersDotOptions: {
        color: '#000000',
        type: 'dot',
        // gradient: {
        //   type: 'linear', // 'radial'
        //   rotation: 180,
        //   colorStops: [{ offset: 0, color: '#00266e' }, { offset: 1, color: '#4060b3' }]
        // },
      }
    });

    setTimeout(() => {
      this.showCode = true;
      this.qrCode.append(this.canvasX?.nativeElement);
    }, 3000)
*/
      const type:string[] = [];
      this.payments$ = this.pay.getAllClientPayments(mine.uid, 22, type) //.pipe(take(1));
      this.payments$.pipe(take(1)).subscribe(p => {
        console.log("payments", p)
      })
  }

  logX(x:any){
    console.log(x)
  }


  addMoney(){
    let w = this.auth.resource.getWidth + 'px';
    let h = this.auth.resource.getHeight + 'px';
    const refDialog = this.auth.resource.dialog.open(AddBalanceComponent, {
      width: w, minWidth: "320px", maxWidth: "480px",
      height:h,

      data:{what:"addMoney"},
      disableClose: true, 
      panelClass:"dialogLayout"//, autoFocus:false
    });
    refDialog.afterClosed().subscribe(()=>{
    })
    //this.auth.resource.router.navigate(["/store/add-product"])
  }

  addTransfer(){
    this.auth.resource.startSnackBar("You dont have sufficent balance in your store account.");
  }

  addWithdraw(){
    this.auth.resource.startSnackBar("You dont have sufficent balance in your store account.");
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
          //const xURL = result.content.split("https://app.refr.club/v1/");
          const xURL = result.content.split("https://refrclub.com/v1/");
          if(!xURL[1]){
            // DO NOTHING
          }else{
            this.auth.resource.startSnackBar("Payments coming soon.")
          }
        }
      })
    }else{
      try{
        const result = await this.barcodeScanner.scan()
        //.then(result => {

          if (result.text) {
            //if(result.text.includes("https://app.refr.club/v1/")){
            if(result.text.includes("https://refrclub.com/v1/")){
              console.log(result.text); // log the raw scanned content
              //const xURL = result.text.split("https://app.refr.club/v1/");
              const xURL = result.text.split("https://refrclub.com/v1/");
              if(!xURL[1]){
                // DO NOTHING
              }else{
                this.auth.resource.startSnackBar("Payments coming soon.")
              }
            }else{
              this.auth.resource.startSnackBar("Invalid QR code")
            }
          }

        // }).catch(err => {
        //   console.log(err)
        //   this.auth.resource.startSnackBar(err)
        // });
        // if the result has content
      }catch(err){
        console.log(err)
      }
    }
  }

}
