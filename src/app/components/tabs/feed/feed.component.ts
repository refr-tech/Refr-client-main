import { Component, OnInit } from '@angular/core';
import { Observable, of, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';
import { UnlockRewardComponent } from './unlock-reward/unlock-reward.component';
import { Timestamp } from "@firebase/firestore";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  informList$:Observable<any[]> = of();
  makingChanges = false;
  imgLoaded:string[] = [];

  constructor(
    public auth: AuthService,
    public pay: PaymentService
    ) { 
    this.execute()
  }

  ngOnInit(): void {
  }

  execute(){
    this.auth.user$.pipe(take(1)).subscribe(mine => {
      this.auth.getAllFeed(mine.uid, 24).then(ref => {
        console.log("DONE", ref)
        this.informList$ = of(ref);
        //this.storeList$ = of(ref.stores);
        //this.codes$ = of(ref.codes);
      });
    })
  }

  getSubCat(cat:string, subcat:string){
    if(this.auth.resource.categoryList.length == 0 || !cat || !subcat){
      return cat || "";
    }else{
      const c = this.auth.resource.categoryList.findIndex((x:any) => x.id == cat);
      const sc = this.auth.resource.categoryList[c].items.findIndex((x:any) => x.id == subcat);
      const now = this.auth.resource.categoryList[c].items[sc];
      return now.name;
    }
  }
 
  calculate14(fsDate:any){
    // Create new Date instance
var date = new Date()
// Add a day
date.setDate(date.getDate() - 14)

    //const dateNow = new Date().setDate(new Date().getDate() + 10);
    //const date14 = new Date().setFullYear( fsDate.toDate() );
    let noteDate = Timestamp.fromDate(date);
    //const date14 = fsDate.toDate();
    //console.log("date14: ",  fsDate, "dateNow: ", noteDate)
    return noteDate > fsDate;
  }

  get getWidth() {
    return window.innerWidth;
  }

  feedAction(type:string, feed:any){
    this.makingChanges = true;




    if(type == "XXX"){

    }

    if(type == "XXX"){

    }

      if(type == "feedWAIT" || type == "feedDONE"){
        this.pay.getTransaction(feed.walt).then(refPay => {
          const ordr:any = refPay.exists() ? refPay.data() : null;
          if(!ordr){
            this.auth.resource.startSnackBar("NO SUCH TRANZ")
          }else{
            console.log("tranz", ordr)


      // CHECK IF ALREADY DONE
            const cashbackGiven = ordr.done ? true : false;








    if(type == "feedWAIT" && !cashbackGiven ){
      // SEND CASHBACK
      // F2F or DIRECT CASHBACK
      
      let isPhone = this.getWidth < 768;
      let w = isPhone ? (this.getWidth - 16) + 'px' : '480px';
      const unRE = this.auth.resource.dialog.open(UnlockRewardComponent, {
        width: w,
        minWidth: '289px',
        maxWidth: '283px',
        // height: h,
        hasBackdrop: true,
        disableClose: false,
        data:{cashback: ordr.earn || 0, type: feed.type },
        panelClass: 'dialogUnlockCB', //, autoFocus:false
      });
      unRE.afterClosed().subscribe(refUNRE => {
        if( !refUNRE || !refUNRE.success){
          this.makingChanges = false;
        }else{

          this.releaseReward(type, feed, ordr)

        }
      });
    }
    if(type == "feedWAIT" && cashbackGiven ){
      this.auth.resource.startSnackBar("Cashback Already Given")
    }

    if(type == "feedDONE" && !cashbackGiven ){
      //
      this.releaseReward(type, feed, ordr)
      //
    }

    if(type == "feedDONE" && cashbackGiven ){
      this.auth.resource.startSnackBar("Cashback Already Given")
    }






          }
        })



      }


  }
  

  releaseReward(type:string, feed:any, ordr:any){
    
    if(ordr.journey == "F2F"){
      const uidV = ordr.to;
      const amtV = ordr.amTotal;

      const uidC = ordr.by;
      const uidR = ordr.refr.uid;
      const amtC = ordr.earn;
      const amtR = ordr.refr.earn;
      const sid = ordr.sid;

      this.pay.cashbackF2F(feed.id, feed.walt, uidC, amtC, uidV, amtV, uidR, amtR).then(() => {
        //this.auth.resource.startSnackBar("Cashback Given")
        // GIVE CASHBACK THEN SHARE
        const xURL = "/redeem/" + ordr.id;
        this.auth.resource.router.navigate([xURL])
      })
    }

    if(ordr.journey == "DIRECT"){
    const uidV = ordr.to;
    const amtV = ordr.amTotal;

    const uidC = ordr.by;
    //const uidR = ordr.refr.uid;
    const amtC = ordr.earn;
    //const amtR = ordr.refr.earn;
    const sid = ordr.sid;

    this.pay.cashbackDIRECT(feed.id, feed.walt, uidC, amtC, uidV, amtV).then(() => {
      //this.auth.resource.startSnackBar("Cashback Given")
      // SHARE THEN GIVE CASHBACK
      const xURL = "/d1/" + sid + "/" + ordr.id;
      console.log("xURL", xURL)
      this.auth.resource.router.navigate([xURL])
    })
    }

  }

}
