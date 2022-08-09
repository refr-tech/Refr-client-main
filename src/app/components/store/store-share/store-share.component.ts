import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, take } from 'rxjs';
//import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
//import { SocialSharing } from '@ionic-native/social-sharing';
import { AuthService } from 'src/app/services/auth.service';

import { StoreActionComponent } from './store-action/store-action.component';



@Component({
  selector: 'app-store-share',
  templateUrl: './store-share.component.html',
  styleUrls: ['./store-share.component.scss'],
  //providers:[SocialSharing]
})
export class StoreShareComponent implements OnInit {
  statusBar = 0;

  emoji = [ 
    {img:"emoji-love.svg", name:"Loved it", text:"❤️"},
    {img:"emoji-good.png", name:"Good", text:"😁"},
    {img:"emoji-outstanding.svg", name:"Perfect", text:"💯"},
    {img:"emoji-average.png", name:"Average", text:"🙂"},
    {img:"emoji-mustTry.png", name:"Must try", text:"🙌"},
    {img:"emoji-satisfactory.png", name:"Satisfied", text:"😊"},
    {img:"emoji-awesome.png", name:"Awesome", text:"😍"}
    /*
    {img:"Twemoji12_1f60d.svg", name:"Faboluos"},
    {img:"Twemoji12_1f496.svg", name:"Love"}, 
    {img:"Twemoji12_1f642.svg", name:"Good"},  
    {img:"Twemoji12_1f600.svg", name:"Great"}, 
    {img:"Twemoji12_1f525.svg", name:"Lit"}, 
    {img:"Twemoji12_1f929.svg", name:"Excited"},
    {img:"Twemoji12_1f47c.svg", name:"Angel"}, 
    {img:"Twemoji12_1f9d0.svg", name:"Quality"}, 
    {img:"Twemoji12_1f60e.svg", name:"Trendy"}, 
    {img:"Twemoji12_1f4af.svg", name:"Proof"},
    {img:"Twemoji12_1f631.svg", name:"Shocking"}, 
    {img:"Twemoji12_1f633.svg", name:"Taboo"}, 
    */
  ];
  comments:string[] = [];
  say = "";

  emojiSet:string = "";
  commentSet:string[] = [];

  store$:Observable<any> = of()
  refrCode = "";
  storeReference = {
    id:"", by:"", name:"", cb: 0
  }
  journey = ""
  shareUrl = ""
  payID = ""
  storeID = ""

  constructor(
    public auth: AuthService,
    private actRoute: ActivatedRoute,
    //private cd: ChangeDetectorRef,
    private bottomSheet: MatBottomSheet,
  ) {
    const aR:any = this.actRoute.parent?.snapshot.params;
    const aRx = this.actRoute.snapshot.params;

    const sid = aR["id"].split("-")[0] || null;
    const code = aR["id"].split("-")[1] || null;
    const payID = aR["id"].split("-")[2] || null;

    const URLx = this.auth.resource.router.url;
    const task = URLx.split("/")[3]
    console.log("task", task)


    if(!sid || !code || code.length !== 6){
      console.log("iM", aR, aRx, sid, code)
      //this.auth.resource.router.navigate(["/home"])
    }else{
      if(task == "sharePOS"){
        this.journey = "POS";
      }
      if(task == "shareB2U"){
        this.journey = "B2U";
        this.storeID = sid;
      }
      if(task == "shareD2U"){
        this.journey = "D2U";
        this.payID = payID;
      }
      //this.cd.detectChanges();

setTimeout(() => {
  this.statusBar = 1;
      this.execute(sid, code);
}, 4000);
    }


   }

   getWidth(){
    var state = this.statusBar;
    var stateMax = 2;
		//state -= 1;
    return (state / stateMax) * 100 + "%";
  }

  ngOnInit(): void {
    
    //this.setDefz("6002e4305fac32cafee09bfe")
  }

  execute(sid:string, code:string){
    this.refrCode = code;
    //this.store$ = this.auth.getMyStore(sid)
    this.auth.getCodeDetails(this.refrCode).then(codeX => {
      const codeInfo:any = codeX.exists() ? codeX.data() : null;
      if(!codeInfo){

      }else{

        this.auth.getStore(sid).pipe(take(1)).subscribe((storeX:any) => {
          console.log(storeX)
          
          if(!storeX){
    
          }else{

            // CHECK IF CODE URL THERE
            console.log("MARYADA " +  codeInfo.shareUrl)

            let GotIT = false;
            this.auth.getCodeDetailsURL(codeInfo.id).subscribe((creating:any) => {
              if(!GotIT && creating.shareUrl){
                GotIT = true;
            console.log("codeInfo", codeInfo, creating);
            this.shareUrl = creating.shareUrl;
            this.store$ = of(storeX); 
            this.storeReference = {
              id:storeX.id, by:storeX.by, name:storeX.name, cb: storeX.cashback || 50
            }
            this.setDefz(storeX.cat)
    
              }
            })


            // CHECK IF CODE THERE

    
    
            // .pipe(take(1))
            // this.auth.getStoreUser(storeX.by).subscribe(storeXuser => {
            //   if(!storeXuser){
    
            //   }else{
            //     storeZ["userInfo"] = storeXuser;
    
            //   }
            // })
          }
          
        })

      }
    })

  }

  
  setDefz(cat:string){
    //const cat:string = "Healthcare"
    const list = [
      "healthcare",
      "food_and_beverages",
      "fitness",
      "electronics",
      "fashion_brand",
      "salons_and_spa"
      //professionals
      //supermarket
    ]

    if(
      !list.includes(cat)
    ){
      this.comments = [
    "Forgot Something",
    "Oh..."
      ]
    }

    if(
      cat == "healthcare"
    ){
      this.comments = [
    "Experienced doctors",
    "Friendly staff",
    "Advanced technology",
    "Comforting environment",	
    "Satisfactory experience",
    "Sterile & hygienic",
    "Easy scheduling",
    "Value for money"
      ]
    }
    if(
      cat == "food_and_beverages"
    ){
      this.comments = [
    "Good Ambience",
    "Great food",
    "Friendly staff", 
    "Quick service",
    "Good music",
    "Events",
    "Pocket friendly",
    "Valet",
    "Outdoor",
    "Romantic",
    "Cozy",
    "Pet friendly",
    "Healthy",
    "Chill vibe"
      ]
    }
    if(
      cat == "fitness"
    ){
      this.comments = [
    "Good Ambience – space, design and layout",
    "Cleanliness & Maintenance",
    "Certified Trainers",
    "Friendly staff",
    "Quality Equipment", 
    "Value for money",
    "Customized diet plans",
    "Steam & Sauna",
    "Member Amenities & Privileges",
    "Valet"
      ]
    }
    /*
    if(
      cat == "Pet Store" ||
      cat == "60155c20168c768a5a8cda81"
    ){
      this.comments = [
    "Play area",
    "Friendly staff",
    "Home delivery",
    "Pocket Friendly",
    "Hygienic",
    "Accessories",
    "Quality food",
    "Gentle handling"
      ]
    }
    */
    if(
      cat == "electronics"
    ){
      this.comments = [
        "Quality products",
        "Great variety",
        "Excellent service",
        "Offers & Deals",
        "Friendly staff",
        "Value for money",
        "Exchange offers",
        "Product servicing",
      ]
    }
    if(
      cat == "fashion_brand"
    ){
      this.comments = [
        "Trendy",
        "Classy",
        "Casual",
        "Sustainable clothing",
    "Good collection",
    "Good fit",
    "Alterations",
    "Exchange",
    "Returns",
    "Favourable pricing",
    "Good ambience",
    "Good Music",
    "Changing room"
      ]
    }
    if(
      cat == "salons_and_spa"
    ){
      this.comments = [
    "Pampering ambience",
    "Spa",
    "Great offers",
    "Experienced stylists",
    "Friendly staff",
    "Good music",
    "Clean & hygienic",
    "Top notch services",
    "Clear pricing",
      ]
    }
  }

  newComment( com:string ){
    if(this.commentSet.length >= 3){
      this.auth.resource.startSnackBar("You can only choose upto 3 comments.");
    }else{
      this.commentSet.push(com)
    }
  }
  






  openDialog() {
    if(!this.emojiSet || this.commentSet.length == 0){
      if(!this.emojiSet){
        this.auth.resource.startSnackBar("Please pick an emoji");
      }else{
        this.auth.resource.startSnackBar("please pick atleast one Highlight");
      }
    }else{
      const mess = {
        emoji:this.emojiSet, 
        name: this.emoji[this.emoji.findIndex(x => x.text == this.emojiSet)].name,
        comments: this.commentSet,
        say: this.say,
        code: this.refrCode,
        shareUrl: this.shareUrl,
        //mine:{uid:, by:, name: },
        storeReference:{id:this.storeReference.id, by:this.storeReference.by, name:this.storeReference.name, cb: this.storeReference.cb },

        journey: this.journey
      }
      const bsRef = this.bottomSheet.open(StoreActionComponent, {
        data: mess, panelClass:"shareScreen", disableClose:true //hasBackdrop: false,
      });
      bsRef.afterDismissed().subscribe(ref =>{
        console.log(ref)
      if(!ref || !ref.success){
      }else{
        //this.openSteps(ref.id);

        if(ref.type == "Redeem" && ref.journey == "POS"){
          this.redeem(ref.tranzID);
        }
        if(ref.journey == "B2U"){
          this.auth.resource.router.navigate(["/thank-you/" + this.storeID])
        }
        if(ref.type == "Redeem" && ref.journey == "D2U"){
          this.auth.resource.router.navigate(["/redeem/" + this.payID ])
        }
      }
    })
      /*
    const dialogRef = this.auth.resource.dialog.open(StoreActionComponent, {
      data: mess,
      maxWidth: '100vw',
      //maxHeight: '100vh',
      //height: '48%',
      height: '538px',
      width: '100%',
      panelClass: 'shareScreen',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(ref =>{
        console.log(ref)
      if(!ref || !ref.success){
      }else{
        //this.openSteps(ref.id);
        this.redeem(ref.tranzID);
      }
    })
    */
    }
  }

  redeem(tranzID:string,){
    if(this.journey == "POS"){
    const urlX = "/redeem/" + tranzID;
    this.auth.resource.router.navigate([urlX]);
    }
    if(this.journey == "B2U"){
      this.auth.resource.router.navigate(["/thanks"]);
    }
  }


}
