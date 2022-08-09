import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { PaymentService } from 'src/app/services/payment.service';
import { WindowService } from 'src/app/services/window.service';

declare var RazorpayCheckout:any;

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent implements OnInit {

  paymentId:string ="";
  paymentData;
  payFail = false;
  paySuccess = false;

  constructor(
    private pay: PaymentService,
    public dialogRef: MatDialogRef<PayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private winRef: WindowService,
  ) { 
    this.paymentData = this.data;
    console.log( "Malcum", data );

    if(!data){
      console.log("NO DATA")

    }else{
      console.log("datadata", data)

      if(this.paymentData.from == 'StoreORDER'){
        this.pay.startGatewayOrder(this.data).then(ref => {
          if(!ref){
            this.payFailed("Payment Failed, Try again...");
          }else{
              const referalCODE = ( data.code ? data.code :"" )
              const referalUID = ( data.code ? data.refer.uid:"" )
              const referalCashback = ( data.code ? data.refer.earn:0 )

            this.paymentId = ref.id;
            console.log("paymentId", this.paymentId)

            if(!this.paymentData.invoice.COD && data.amCost > 0){
              this.createRzpayOrder(this.paymentId, this.paymentData.amCost, "Refr Technology", "payment to " + this.paymentData.storeName, "#512da8",
              referalCODE,
              referalUID, referalCashback)
            }else{

              this.setUpTransfers(
                this.paymentData.logistics.typeOrdr, 
                this.paymentData.invoice.useRefrCash, 
                this.paymentData.invoice.amtRefrCash,
                this.paymentData.amCost, 
                this.paymentData.amTotal,
                this.paymentData.ordrTYPE,
                this.paymentData.sid, this.paymentData.to, this.paymentData.by,
                this.paymentId,
                this.paymentData.earn,
          
                referalCODE,
                referalUID, referalCashback
                );
            }

          }
        })
      }

    }

  }

  ngOnInit(): void {
  }

  payFailed(info:string){
    this.payFail = true;
    setTimeout(() => {
      this.dialogRef.close({success:false, info});
    }, 5000)
  }
/*

            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            order_id: response.razorpay_order_id
*/
  payComplete(type:string, response: any, gwInfo:any, paymentId:string,
        referalCODE:string,
        referalUID:string, referalCashback:number ){
    this.paySuccess = true;
    if(type !== "razorpay" || !this.paymentData.by || !this.paymentData.amTotal){
      this.payFailed("Payment Failed, You will be refunded within 3 to 15 days.");
    }else{
      console.log("Payment responce", response);
      const gwID = response.razorpay_payment_id;
      const gwSIGN = response.razorpay_signature;
      const gwORDR = response.razorpay_order_id;

      this.pay.completePayment(this.paymentId, gwID, gwSIGN, gwORDR, gwInfo).then(() => {
        this.setUpTransfers(
          this.paymentData.logistics.typeOrdr, 
          this.paymentData.invoice.useRefrCash, 
          this.paymentData.invoice.amtRefrCash,
          this.paymentData.amCost, 
          this.paymentData.amTotal,
          this.paymentData.ordrTYPE,
          this.paymentData.sid, this.paymentData.to, this.paymentData.by,
          paymentId,
          this.paymentData.earn,

          referalCODE,
          referalUID, referalCashback
          );
      });
      /*
      const amt = this.paymentData.amCamp;
      const tX = this.paymentData.tX;
      console.log("tX:", tX)

      if(tX !== 'tC'){
        const t = this.pay.resource.campaignPlans.findIndex((x:any) => x.total == amt);
        const amtX = this.pay.resource.campaignPlans[t].refill;
        this.pay.addVendorHypeBalance(
          this.paymentId, this.paymentData.by, amtX,//this.paymentData.amTotal, 
          gwID,gwSIGN,gwORDR, gwInfo
        );
      }
      if(tX == 'tC'){

      }
      if(this.paymentData.userData.campID){
        console.log("CAMP: " + this.paymentData.userData.campID)
        this.pay.completeHypePayment(this.paymentData.userData.campID);
      }
      */

    }
  }

  createRzpayOrder(orderId:string, amount:number, to:string, about:string, theme:string,
    referalCODE:string,
    referalUID:string, referalCashback:number) {
    const data = {
      name: to || "No Name",
      description:about ||"No description",
      amount:amount, currency:"INR", //amount_paid:5000, amount_due:126,
      orderId:orderId,
      userData: this.paymentData.userData,
      theme:theme || "#ff0000"
    }
    //console.log(data);
    //RazorpayCheckout.on("payment.success", successCallback);
    //RazorpayCheckout.on("payment.cancel", cancelCallback);
    // RazorpayCheckout.open(initRes);
    // call api to create order_id
    //this.pay.payWithRazor(data);
    this.pay.onlinePaymentNew("IND", data).pipe(take(1)).subscribe((getPayRes: any) => {
      console.log("getPayRes", getPayRes);

      if(getPayRes && getPayRes.success){
    
        getPayRes.modal = {
          ondismiss: () => {
            console.log("ondismiss")
            this.payFailed("Payment Failed, Try again...");
            // this.storeservice.cancelOrder(orderId).subscribe((elem) => {
            //   if(elem.status === 200){
            //     console.log(elem);
            //     //this.toastrService.error('Transaction has been cancelled')
            //     //this.router.navigate(["/tabs/home"])
            //   }
            // });
          },
        };
        getPayRes.handler = (response:any, error:any) => {
          console.log("hello bro: ")
          if (response) {
          console.log("response: ", response)
          const dataVerify = {
            amount:amount, currency:"INR", //amount_paid:5000, amount_due:126,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            order_id: response.razorpay_order_id
          }
          console.log("dataVerify",dataVerify)

          this.pay.verifyPayment("IND", dataVerify).pipe(take(1)).subscribe((getVerifyRes:any) => {
             console.log("getPayRes", getVerifyRes)
             if(!getVerifyRes || !getVerifyRes.success){
              this.payFailed("Payment Failed, Try again...");
             }else{
              this.payComplete("razorpay", response, getVerifyRes.gwInfo, orderId,
              referalCODE,
              referalUID, referalCashback)
             }
          })
          //Check if success

          /*
          */
          
            //this.toastrService.success('Payment completed successfully.');

            //this.router.navigate(["/OrderStatus/" + data.orderId +'/' + (this.type || "direct") ]); //DIP
            //this.router.navigate([`/success-message/${response.razorpay_order_id}`]);
          }
          if(error){
            console.log("error: ", error)
            this.payFailed("Payment Failed, Try again..."); // You need to store error
            //this.toastrService.success('Payment failed.');
            //this.router.navigate(["/tabs/home"])
          }
        };
        const rzp = new this.winRef.nativeWindow.Razorpay(getPayRes);
        rzp.open();

      }
    });
  }

  setUpTransfers(
    journey:string,
    useRefrCash:boolean, 
    transferRefrCash:number,
    costPAID:number, // to the merchant
    costUSER:number, // to the user without refrcash
    ordrTYPE:string,
    sid:string, mid:string, uid:string,
    paymentId:string,
    cashback:number,
    referalCODE:string,
    referalUID:string, referalCashback:number
    ){


      if( journey == "F2F_ONLINE" || journey == "DIRECT_ONLINE" ){
        this.pay.updateVendorReserveF2F_ONLINE( mid, costUSER )
        if(ordrTYPE == "COD" || ordrTYPE == "RefrCASH" || ordrTYPE == "RefrCASH+COD" ){ console.log("Add amount to pending in vendor as to be collected.") }
        if(ordrTYPE == "ONLINE" || ordrTYPE == "RefrCASH+ONLINE"){ console.log("Add amount to pending in vendor as paid.") }

        if(ordrTYPE == "RefrCASH" || ordrTYPE == "RefrCASH+COD" || ordrTYPE == "RefrCASH+ONLINE" ){
          this.pay.updateClientF2F_ONLINE( uid, -transferRefrCash )
          console.log("Deduct amount from user refrcash.")
          console.log("ordrTYPE refrcash", ordrTYPE)
        }
        if(cashback > 0){// when cashback has to be given
          this.pay.updateVendorHypeF2F_ONLINE( mid, -(cashback + referalCashback) )
          this.pay.updateClientReserveF2F_ONLINE( uid, cashback )
          //this.pay.updateCodeF2F_ONLINE( code, cashback )
          if(referalCODE){
          this.pay.updateClientReserveF2F_ONLINE( referalUID, referalCashback )
          }
        }
      }

      if( journey == "BURN" ){
        this.pay.updateVendorReserveBURN_ONLINE( mid, costUSER )
        if(ordrTYPE == "COD" || ordrTYPE == "RefrCASH" || ordrTYPE == "RefrCASH+COD" ){ console.log("Add amount to pending in vendor as to be collected.") }
        if(ordrTYPE == "ONLINE" || ordrTYPE == "RefrCASH+ONLINE"){ console.log("Add amount to pending in vendor as paid.") }

        if(ordrTYPE == "RefrCASH" || ordrTYPE == "RefrCASH+COD" || ordrTYPE == "RefrCASH+ONLINE" ){
          this.pay.updateClientBURN_ONLINE( uid, -transferRefrCash )
          console.log("Deduct amount from user refrcash.")
          console.log("ordrTYPE refrcash", ordrTYPE)
        }
      }

      //if( journey == "DIRECT" ){
        console.log("ordrTYPE", ordrTYPE, journey)
        // console.log("ordrTYPE", ordrTYPE)
        // if( ordrTYPE == "RefrCASH"){
        //   console.log("ordrTYPE", ordrTYPE)
        // }
      //}
/*
    if(ordrTYPE == "COD" || ordrTYPE == "RefrCASH+COD"){
      console.log("Add amount to pending in vendor as to be collected.")
      this.pay.addVendorReserve( mid, costUSER )
    }

    if(ordrTYPE == "ONLINE" || ordrTYPE == "RefrCASH+ONLINE"){
      console.log("Add amount to pending in vendor as paid.")
      this.pay.addVendorReserve( mid, costUSER )
    }

    if(ordrTYPE == "RefrCASH" || ordrTYPE == "RefrCASH+COD" || ordrTYPE == "RefrCASH+ONLINE" ){
      console.log("Deduct amount from user refrcash.")
      this.pay.addClientBalance( uid, -transferRefrCash )
    }
*/
    setTimeout(() => {
      this.dialogRef.close({success:true, paymentId});
    }, 3000)
  }

}
