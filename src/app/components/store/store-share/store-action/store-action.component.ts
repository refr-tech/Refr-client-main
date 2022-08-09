import { Component, Inject, OnInit } from '@angular/core';
//import { MatDialogRef , MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { StoreDoComponent } from '../store-do/store-do.component';

import { Filesystem, Directory, //Encoding 
} from '@capacitor/filesystem';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { PaymentService } from 'src/app/services/payment.service';
import { take } from 'rxjs';
//import { Share } from '@capacitor/share';

import { NgNavigatorShareService } from 'ng-navigator-share';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-store-action',
  templateUrl: './store-action.component.html',
  styleUrls: ['./store-action.component.scss']
})
export class StoreActionComponent implements OnInit {

  toggleSubmenu = true;

  erz:any[] = []
  showRedeem = false;

  mess:any = null;
  makeChanges = false;
  journey = "";

  private ngNavigatorShareService: NgNavigatorShareService;

  constructor(
    private socialSharing: SocialSharing,
    public auth: AuthService,
    private pay: PaymentService,
    //private dialogRef: MatDialogRef<StoreActionComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any,
    private bsRef: MatBottomSheetRef<StoreActionComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    //public dialog: MatDialog
    ngNavigatorShare: NgNavigatorShareService
  ) {
    this.mess = this.data;
    this.journey = this.data.journey;
    if(this.mess.code && this.mess.emoji && this.mess.comments.length > 0 //&& this.mess.say
      ){
      this.pay.updateCodeSay(this.mess.code, this.mess.emoji, this.mess.comments, this.mess.say);
    }

    this.ngNavigatorShareService = ngNavigatorShare;
  }

  ngOnInit(): void {
  }


  platformSET(id:string){
    if(id == "whatsApp" || id == "instaDM" || id == "fbMESS" || id == "text" || id == "twitter" || id == "mail" || id == "copy" || id == "more"){

      this.showRedeem = true;
      const image = "";

            if(id == "whatsApp"){
              this.share("shareWhatsapp", image)
            }
            if(id == "instaDM"){
              this.share("shareInstagramChat", image)
            }
            if(id == "fbMESS"){
              this.share("shareMessenger", image)
            }
            if(id == "twitter"){
              this.share("shareTwitter", image)
            }

          if(id == "text"){
            this.share("shareSMS", image)
          }

          if(id == "mail"){
            this.share("shareMail", image)
          }
          
          if(id == "copy"){
            this.share("shareCopy", image)
          }

          if(id == "more"){
            this.share("shareOther", image)
          }

    }else{

    const dialogRef = this.auth.resource.dialog.open(StoreDoComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '80%',
      panelClass:'bottomSheetClassDO',
      data:{id:id}
    });



    dialogRef.afterClosed().subscribe(ref =>{
        console.log(ref)
      if(!ref || !ref.success){
      }else{
        this.showRedeem = true;

        if(
          //id == "instaStories" || 
          //id == "whatsApp" || 
          //id == "instaDM" || 
          id == "instaPost" || 
          id == "fbMESS" || 
          id == "fbPOST" //|| 
          //id == "text" || 
          //id == "mail" || 
          //id == "twitter" || 
          //id == "copy" || 
          //id == "sync" || 
          //id == "more" //|| id == "more2" 
        ){

    // TAKE A PICTURE OR PICK FROM STORE
            const image = ref.image;

            // if(id == "whatsApp"){
            //   this.share("shareWhatsapp", image)
            // }
            // if(id == "instaDM"){
            //   this.share("shareInstagramChat", image)
            // }
            if(id == "instaPost"){
              this.share("shareInstagramPost", image)
            }
            // if(id == "fbMESS"){
            //   this.share("shareMessenger", image)
            // }
            if(id == "fbPOST"){
              this.share("shareFacebook", image)
            }
            // if(id == "twitter"){
            //   this.share("shareTwitter", image)
            // }
            // if(id == "more"){
            //   this.share("shareOther", image)
            // }
            // if(id == "more2"){
            //   this.share("shareOther2", image)
            // }
    // TAKE A PICTURE OR PICK FROM STORE

        }else{
          const image = "";

          if(id == "instaStories"){
            this.share("shareInstagramStory", image)
          }

          // if(id == "text"){
          //   this.share("shareSMS", image)
          // }
          // if(id == "mail"){
          //   this.share("shareMail", image)
          // }
          // if(id == "copy"){
          //   this.share("copy", image)
          // }
          if(id == "sync"){
            //this.share("shareSMS", image)
          }
        }

      }
    })
    //this.dialogRef.close({success:true,id:id})
      

    }
  }


  share(x:string, dataUrl:string){
    console.log("Share")
      
    const mess = {
      emoji:this.mess.emoji, 
      name: this.mess.name,
      storename: this.mess.storeReference.name,
      cashback: this.mess.storeReference?.cb || 50,
      comments: this.mess.comments,
      say: this.mess.say,
      code: this.mess.code,
      shareUrl: this.mess.shareUrl
    }
   
//       var x = `
//       Hi, I highly recommend “Store name”.
//  Highlights of my experience: Friendly staff
// ❤️ Loved it 
// Check it out & get X cashback on your purchase using the link below.
//       ` 
      //console.log('RESULT:', dataUrl)
    const data = {

      message: "Highlights of my experience: \n" + mess.comments.join(", ") +" \n"+ mess.emoji + " " + mess.name + " \nCheck it out and get " + mess.cashback + " cashback on your purchase using the link below." /*mess.say*/, 
      subject: "Hi, I highly recommend " + mess.storename, 
      //image: "https://firebasestorage.googleapis.com/v0/b/refr/o/opengraph.png?alt=media&amp;token=87b5c5d3-f7a1-42d6-ab4e-65eb17deccf5", 
      image: dataUrl,
      url: mess.shareUrl, //"https://app.refr.club/go/" + this.mess.code
      code: mess.code
    }

    var userAgent = window.navigator.userAgent;

    if(x == "shareFacebook"){ 
      if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
         // iPad or iPhone
        this.share("shareWebShareApi", dataUrl)
      }
      else {
         // Anything else
         this.shareFacebook(data); 
      }
    }
    if(x == "shareTwitter"){ this.shareTwitter(data); }
    if(x == "shareTwitterChat"){ this.shareTwitterChat(data); }

    // if(x == "shareInstagramPost0"){ this.shareInstaPost0(data); }
    if(x == "shareInstagramPost"){ 
      if(!this.auth.resource.appMode){
        this.share("shareWebShareApi", dataUrl)
      }else{ 
        this.shareInstaPost(data); 
      }
    }
    if(x == "shareInstagramChat"){ 
      if(!this.auth.resource.appMode){
        this.share("shareWebShareApi", dataUrl)
      }else{ 
        this.shareInstaChat(data); 
      }
    }
    if(x == "shareInstagramStory"){ this.shareInstaStory(data); }
/*
    if(x == "shareInstagramStory1"){ this.shareInstaStory1(data); }
    if(x == "shareInstagramStory2"){ this.shareInstaStory2(data); }
    if(x == "shareInstagramStory3"){ this.shareInstaStory3(data); }
    if(x == "shareInstagramStory4"){ this.shareInstaStory4(data); }
    if(x == "shareInstagramStory5"){ this.shareInstaStory5(data); }
    if(x == "shareInstagramStory6"){ this.shareInstaStory6(data); }
    if(x == "shareInstagramStory7"){ this.shareInstaStory7(data); }
    if(x == "shareInstagramStory8"){ this.shareInstaStory8(data); }
    if(x == "shareInstagramStory9"){ this.shareInstaStory9(data); }
    if(x == "shareInstagramStory10"){ this.shareInstaStory10(data); }
    if(x == "shareInstagramStory11"){ this.shareInstaStory11(data); }
    if(x == "shareInstagramStory12"){ this.shareInstaStory12(data); }
    if(x == "shareInstagramStory13"){ this.shareInstaStory13(data); }
*/
    if(x == "shareInstagramStory14"){ this.shareInstaStory14(data); }
    /*
    if(x == "shareInstagramPost"){ this.shareInstagramPost(data); }
    if(x == "shareInstagramStory"){ this.shareInstagramStory(data); }
    if(x == "shareInstagramChat"){ this.shareInstagramChat(data); }
    if(x == "shareInstagramChat2"){ this.shareInstagramChat2(data); }
    if(x == "shareInstagramChat3"){ this.shareInstagramChat3(data); }
    if(x == "shareInstagramChat4"){ this.shareInstagramChat4(data); }
    */
    if(x == "shareWhatsapp"){ this.shareWhatsapp(data); }
    if(x == "shareTelegram"){ this.shareTelegram(data); }
    if(x == "shareSignal"){ this.shareSignal(data); }
    if(x == "shareMessenger"){ 
      if(!this.auth.resource.appMode){
        this.share("shareWebShareApi", dataUrl)
      }else{
        this.shareMessenger(data); 
      }
    }
    //if(x == "shareWechat"){ this.shareWechat(data); }
    if(x == "shareMail"){ this.shareMail(data); }
    if(x == "shareOther"){ 
      if(!this.auth.resource.appMode){
        this.share("shareWebShareApi", dataUrl)
      }else{ 
        this.shareOther(data);
      } 
    }
    //if(x == "shareOther2"){ this.shareOther2(data); }
    if(x == "shareSMS"){
      if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
         // iPad or iPhone
         this.shareSMS("safari", data);
      }
      else {
         // Anything else 
         this.shareSMS("", data);
      }  
    }
    if(x == "shareCopy"){ this.shareCopy(data);}

    if(x == "shareWebShareApi"){ this.shareWebShareApi(data);}
  }



  shareWebShareApi(data: { message: string; subject: string; image: string; url: string; }){
    console.log("shareWebShareApi")
    const textBODY = `${data.subject}\n${data.message}\n${data.url}`;
    const dataX = { message: textBODY, url: data.url }

    // this.auth.resource.copyClipboard(dataX.message) 

    
    if (!this.ngNavigatorShareService.canShare()) {
      alert(`This service/api is not supported in your Browser`);
      return;
    }
 
    this.ngNavigatorShareService.share({
      title: 'Refr Club',
      text: dataX.message,
      url: dataX.url
    }).then( (response) => {
      console.log(response);
    })
    .catch( (err) => {
      this.auth.resource.startSnackBar("Error: " + err);
      console.log(err);
      this.erz.push(err)
    });
  }






    // const fbD = "http://www.facebook.com/dialog/feed?" +
    // "app_id=123050457758183&" +
    // "link=http://developers.facebook.com/docs/reference/dialogs/&" +
    // "picture=http://fbrell.com/f8.jpg&" +
    // "name=Facebook%20Dialogs&" +
    // "caption=Reference%20Documentation&" +
    // "description=Dialogs%20provide%20a%20simple,%20consistent%20interface%20for%20applications%20to%20interact%20with%20users.&" +
    // "message=Facebook%20Dialogs%20are%20so%20easy!&" +
    // "redirect_uri=http://www.example.com/response"


    async shareFacebook(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareFacebook")
      const textBODY = `${data.subject}\n${data.message}`;
      const dataX = { message: textBODY, image: data.image, url: data.url }
      /*
      const fb = `https://facebook.com/sharer/sharer.php?u=${ dataX.url }&quote=${ dataX.message }`
      window.open(fb, "_blank");
      TRY QUOTE
      */
     //com.facebook.katana
     
if(!this.auth.resource.appMode){
      const X = window.encodeURIComponent(dataX.message)

      const fb = `https://www.facebook.com/sharer/sharer.php?u=${ dataX.url }`;
      //const fb = `https://www.facebook.com/sharer/sharer.php?u=${ 'https://google.com' }&quote=${ 'ManMade' }`;
      //const fb = `https://www.facebook.com/sharer/sharer.php?u=${dataX.url}`  //&quote=${ X }`;
      window.open(fb, "_blank");

}else{


     this.socialSharing.canShareVia("facebook").then(r => {
      //this.socialSharing.shareViaFacebook(dataX.message, dataX.image, dataX.url).then(() => {
        this.socialSharing.shareViaFacebookWithPasteMessageHint(dataX.message, dataX.image, dataX.url, "Please paste the copied text").then(() => {
        console.log("Success");
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
  
     }).catch(e => {
      this.auth.resource.startSnackBar("Error: " + e);
      console.log(e);
      this.erz.push("No Axess: " + e)
     })
     
      
}

    }
  
    shareTwitter(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareTwitter")
      const textBODY = `${data.subject}\n${data.message}\n${data.url}`;
      const dataX = { message: textBODY, image: data.image, url: data.url }
      const tw = `https://twitter.com/intent/tweet?via=${ 'refrclub' }&text=${dataX.message}`;
      window.open(tw, "_blank");
    }
  
  
    async shareTwitterChat(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareTwitterChat")
      const textBODY = `${data.subject}\n${data.message}`;
      const dataX = { message: textBODY, image: data.image, url: data.url }
  
      this.socialSharing.canShareVia("twitter").then(r => {
  
        this.socialSharing.shareViaTwitter(dataX.message, dataX.image, dataX.url).then(() => {
        console.log("Success");
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
  
     }).catch(e => {
      this.auth.resource.startSnackBar("Error: " + e);
      console.log(e);
      this.erz.push("No Axess: " + e)
     })
  
     
    }
    
    async savePicture(image:string, fileName:string){
      const x = await Filesystem.mkdir({
        directory: Directory.Documents, 
        path:"secrets",
        recursive: true
      }).then(r => {
        console.log(r)
        this.erz.push(r)
      }).catch(e => {
        console.log(e)
        this.erz.push(e)
        return {success:true, exist:true}
      }).finally(async () => {
        console.log("finally")
        this.erz.push("finally")
        return {success:true, exist:false}
      });
  
  
        
        const y = await Filesystem.writeFile({
          path: 'secrets/' + fileName,
          data: image,
          directory: Directory.Documents,
          //encoding: Encoding.UTF8,
        }).then(r => {
          console.log(r)
          this.erz.push(r)
          return {success:true, x, r}
        }).catch(err => {
          return {success:false, x, err}
        })
        
  
      console.log("i", x, y)
      return y;
    }
  
    shareInstaStory(data: { message: string; subject: string; image: string; url: string; }){
      /*
      console.log("shareInstaPost0")
      const textBODY = `${data.subject}\n${data.message}\n${data.url}`;
      const dataX = { message: textBODY, image: data.image }
      // Filesystem.requestPermissions().then(x => {
      //   x.publicStorage.
      // })
  
      const fileName = new Date().getTime() + '.png';
      this.savePicture(dataX.image, fileName).then(res => {
        console.log("Success", res);
        this.erz.push("saved: " + res)
        
        const ig = `instagram://story-camera`
        //const ig = `instagram://share`
        window.open(ig, "_blank");
  
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      });
      */
     this.auth.resource.copyClipboard(data.url)
     setTimeout(() => {
      const ig = `instagram://story-camera`
      window.open(ig, "_blank");
     }, 3000);
    }
  
  
  
    shareInstaPost(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareInstagramChat2")
      const textBODY = `${data.subject}\n${data.message}\n${data.url}`;
      const dataX = { message: textBODY, subject:data.subject, image: data.image, url: data.url }
      this.auth.resource.copyClipboard(textBODY)
  
      setTimeout(() => {


     this.socialSharing.canShareVia("instagram").then(r => {
  
      this.socialSharing.shareVia("instagram", dataX.message, dataX.subject, dataX.image, dataX.url).then(() => {
        console.log("Success");
        // ADD TO CLIPBOADRD NEEDED
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
  
     }).catch(e => {
      this.auth.resource.startSnackBar("Error: " + e);
      console.log(e);
      this.erz.push("No Axess: " + e)
     }) 


      }, 3000)  
    }
  
  
    shareInstaChat(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareInstagramChat3")
      const textBODY = `${data.subject}\n${data.message}\n${data.url}`;
      const dataX = { message: textBODY, subject:data.subject, image: data.image, url: data.url }
  
     this.socialSharing.canShareVia("instagram").then(r => {
  
      this.socialSharing.shareVia("instagram", dataX.message, "",/*dataX.subject, "", dataX.image, dataX.url*/).then(() => {
        console.log("Success");
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
  
     }).catch(e => {
      this.auth.resource.startSnackBar("Error: " + e);
      console.log(e);
      this.erz.push("No Axess: " + e)
     }) 
    }
  /*
    shareInstaStory(data: { message: string; subject: string; image: string; url: string; }){
      
      console.log("shareInstagramStory")
      const dataX = { message: data.message, image: data.image, url: data.url  }
      const ig = `instagram://story-camera`
      window.open(ig, "_blank");
      
    }
  
    shareInstaStory1(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareInstaStory1")
      const textBODY = `${data.subject}\n${data.message}`;
      const dataX = { message: textBODY, subject:data.subject, image: data.image, url: data.url }
  
      this.socialSharing.shareVia("com.instagram.android", dataX.message, dataX.subject, dataX.image, dataX.url).then(() => {
        console.log("Success");
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
    }
  
    shareInstaStory2(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareInstaStory2")
      const textBODY = `${data.subject}\n${data.message}`;
      const dataX = { message: textBODY, subject:data.subject, image: data.image, url: data.url }
      
      this.socialSharing.shareVia("com.instagram.share.ADD_TO_STORY", dataX.message, dataX.subject, dataX.image, dataX.url).then(() => {
        console.log("Success");
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
    }
  
    shareInstaStory3(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareInstaStory3")
      const textBODY = `${data.subject}\n${data.message}`;
      const dataX = { message: textBODY, subject:data.subject, image: data.image, url: data.url }
      
      this.socialSharing.shareVia("com.instagram.android.share.ADD_TO_STORY", dataX.message, dataX.subject, dataX.image, dataX.url).then(() => {
        console.log("Success");
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
    }
  
    shareInstaStory4(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareInstaStory4")
      const textBODY = `${data.subject}\n${data.message}`;
      const dataX = { message: textBODY, subject:data.subject, image: data.image, url: data.url }
      
      this.socialSharing.shareVia("com.instagram.android.ADD_TO_STORY", dataX.message, dataX.subject, dataX.image, dataX.url).then(() => {
        console.log("Success");
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
    }
  
    shareInstaStory5(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareInstaStory5")
      const textBODY = `${data.subject}\n${data.message}`;
      const dataX = { message: textBODY, subject:data.subject, image: data.image, url: data.url }
      
      this.socialSharing.shareVia("com.instagram.android.story", dataX.message, dataX.subject, dataX.image, dataX.url).then(() => {
        console.log("Success");
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
    }
  
    shareInstaStory6(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareInstaStory6")
      const textBODY = `${data.subject}\n${data.message}`;
      const dataX = { message: textBODY, subject:data.subject, image: data.image, url: data.url }
      
      this.socialSharing.shareVia("instagram://story-camera", dataX.message, dataX.subject, dataX.image, dataX.url).then(() => {
        console.log("Success");
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
    }
  
    shareInstaStory7(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareInstaStory7")
      const textBODY = `${data.subject}\n${data.message}`;
      const dataX = { message: textBODY, subject:data.subject, image: data.image, url: data.url }
      
      this.socialSharing.shareVia("instagram://story", dataX.message, dataX.subject, dataX.image, dataX.url).then(() => {
        console.log("Success");
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
    }
  
    shareInstaStory8(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareInstaStory8")
      const textBODY = `${data.subject}\n${data.message}`;
      const dataX = { message: textBODY, subject:data.subject, image: data.image, url: data.url }
      
      this.socialSharing.shareVia("instagram://ADD_TO_STORY", dataX.message, dataX.subject, dataX.image, dataX.url).then(() => {
        console.log("Success");
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
    }
  
    shareInstaStory9(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareInstaStory9")
      const textBODY = `${data.subject}\n${data.message}`;
      const dataX = { message: textBODY, subject:data.subject, image: data.image, url: data.url }
      
      this.socialSharing.shareVia("com.instagram.share.ADD_TO_STORY", dataX.message, dataX.subject, dataX.image, dataX.url).then(() => {
        console.log("Success");
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
    }
  
    shareInstaStory10(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareInstaStory10")
      const textBODY = `${data.subject}\n${data.message}`;
      const dataX = { message: textBODY, subject:data.subject, image: data.image, url: data.url }
      
      this.socialSharing.shareVia("com.instagram.sharedSticker.contentURL", dataX.message, dataX.subject, dataX.image, dataX.url).then(() => {
        console.log("Success");
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
    }
  
    shareInstaStory11(data: { message: string; subject: string; image: string; url: string; }){
      
      console.log("shareInstagramStory11")
      const dataX = { message: data.message, image: data.image, url: data.url  }
      const ig = `instagram://story-gallery`
      window.open(ig, "_blank");
      
    }
  
    shareInstaStory12(data: { message: string; subject: string; image: string; url: string; }){
      
      console.log("shareInstagramStory12")
      const dataX = { message: data.message, image: data.image, url: data.url  }
      const ig = `instagram://story-share`
      window.open(ig, "_blank");
      
    }
  
    shareInstaStory13(data: { message: string; subject: string; image: string; url: string; }){
      
      console.log("shareInstagramStory13")
      const dataX = { message: data.message, image: data.image, url: data.url  }
      const ig = `instagram://story`
      window.open(ig, "_blank");
      
    }
  */
  shareInstaStory14(data: { message: string; subject: string; image: string; url: string; }){
      
    console.log("shareInstagramStory14")
    const dataX = { message: data.message, image: data.image, url: data.url  }
    const ig = `instagram://story-share`
    window.open(ig, "_blank");
    
  }
  
  
  
  /*
    shareInstagramChat4(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareInstagramChat4")
      const textBODY = `${data.subject}\n${data.message}`;
      const dataX = { message: textBODY, subject:data.subject, image: data.image, url: data.url }
  
     this.socialSharing.canShareVia("instagram").then(r => {
  /*
      this.socialSharing.shareViaInstagram(dataX.image, dataX.image).then(() => {
        console.log("Success");
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
      */
     /*
      this.socialSharing.shareVia("com.instagram.android.share.ADD_TO_STORY", dataX.message, dataX.subject, dataX.image, dataX.url).then(() => {
        console.log("Success");
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
  
     }).catch(e => {
      this.auth.resource.startSnackBar("Error: " + e);
      console.log(e);
      this.erz.push("No Axess: " + e)
     })
  
     
    }
  */
  
    shareWhatsapp(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareWhatsapp")
      const textBODY = `${data.subject}\n${data.message}\n${data.url}`;
      const dataX = { message:textBODY, image: data.image, url: data.url }
      console.log(dataX.message)
      /*
      const wa = `https://wa.me/?${ 'text=' + dataX.message }` //encodeURIComponent()
      window.open(wa, "_blank");dataX.image, null , dataX.url 
      *//*, dataX.url*/ 
  
      if(!this.auth.resource.appMode){
        const X = window.encodeURIComponent(textBODY)

        const wa = `https://wa.me/?${ 'text=' +  X }`;
        window.open(wa, "_blank");

      }else{



     this.socialSharing.canShareVia("whatsapp").then(r => {
  
      this.socialSharing.shareViaWhatsApp( dataX.message, dataX.image ).then(res => {
        console.log("Success");
        this.erz.push("res: " + res)
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
  
     }).catch(e => {
      this.auth.resource.startSnackBar("Error: " + e);
      console.log(e);
      this.erz.push("No Axess: " + e)
     })


      }
     
    }
  
    shareTelegram(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareTelegram")
      const textBODY = `${data.subject} \n${data.message}`;
      const dataX = { message: textBODY, image: data.image, url: data.url }
      const tg = `https://t.me/share/url?url=${dataX.url}&text=${dataX.message}`;
      window.open(tg, "_blank");
      /*
      this.socialSharing.shareVia("telegram", dataX.message, dataX.subject, dataX.image, dataX.url).then(() => {
        console.log("Success");
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
      */
    }
  
    shareSignal(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareSignal")
      const dataX = { message: data.message, subject: data.subject, image: data.image, url: data.url }
  
  /*
     this.socialSharing.canShareVia("org.thoughtcrime.securesms").then(r => {
  
      this.socialSharing.shareVia("org.thoughtcrime.securesms", dataX.message, dataX.subject, dataX.image, dataX.url).then(() => {
        console.log("Success");
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
  
     }).catch(e => {
      this.auth.resource.startSnackBar("Error: " + e);
      console.log(e);
      this.erz.push("No Axess: " + e)
     })
  
     */
    }
  
    shareMessenger(data: { message: string; subject: string; image: string; url: string; }){
      console.log("Share")
      const dataX = { message: data.message, subject: data.subject, image: data.image, url: data.url }
  
     this.socialSharing.canShareVia("com.facebook.orca").then(r => {
  
      this.socialSharing.shareVia("com.facebook.orca", dataX.message, dataX.subject, dataX.image, dataX.url).then(() => {
        console.log("Success");
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
  
     }).catch(e => {
      this.auth.resource.startSnackBar("Error: " + e);
      console.log(e);
      this.erz.push("No Axess: " + e)
     })
  
     
    }
  /*
    shareWechat(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareWechat")
      const dataX = { message: data.message, subject: data.subject, image: data.image, url: data.url }
      this.socialSharing.shareVia("com.tencent.mm", dataX.message, dataX.subject, dataX.image, dataX.url).then(() => {
        console.log("Success");
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
    }
  */
    shareMail(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareMail")
      const htmlBODY = `${data.message}\n${data.url}`;
      const dataX = {message: htmlBODY, subject: data.subject, to: [], cc: [], bcc: [], files: ""}
    
      const mail = `mailto:?body=${dataX.message}&subject=${dataX.subject}`
      window.open(mail, "_blank");
     /*
      this.socialSharing.shareViaEmail(dataX.message, dataX.subject, dataX.to, dataX.cc, dataX.bcc, dataX.files ).then(() => {
        console.log("Success");
      }).catch(err => {
        this.auth.resource.startSnackBar("Error: " + err);
        console.log(err);
        this.erz.push(err)
      })
      */
    }
  
  
    async shareOther(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareOther")
      const dataX = { message: data.message, subject: data.subject, file: data.image, url: data.url }
     
  
        this.socialSharing.share( dataX.message, dataX.subject, dataX.file, dataX.url ).then(() => {
          console.log("Success");
        }).catch(err => {
          this.auth.resource.startSnackBar("Error: " + err);
          console.log(err);
          this.erz.push(err)
        })
  
      
    }
  /*
    async shareOther2(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareOther")
      const dataX = { message: data.message, subject: data.subject, file: data.image, url: data.url }
  
      Share.share({
        title: 'See cool stuff',
        text: 'Really awesome thing you need to see right meow',
        url: 'http://ionicframework.com/',
        dialogTitle: 'Share with buddies',
      });
      
    }
  */
    shareSMS(via:string, data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareSMS")
      const textBODY = `${data.subject}\n${data.message}\n${data.url}`;
      const dataX = { message: textBODY, url: data.url }
  
      if(!this.auth.resource.appMode){
        if(via !== "safari"){
          const url = "sms:?body=" + dataX.message;
          //const url = "sms:+19725551212?body=" + dataX.message;
          window.open(url, "_blank");
        }else{
          const url = "sms:;body=" + dataX.message;
          //const url = "sms:+19725551212?body=" + dataX.message;
          window.open(url, "_blank");
        }
      }else{
        this.socialSharing.shareViaSMS(dataX.message, "")
      }
    }

    shareCopy(data: { message: string; subject: string; image: string; url: string; }){
      console.log("shareCopy")
      const textBODY = `${data.subject}\n${data.message}\n${data.url}`;
      const dataX = { message: textBODY, url: data.url }
  
      this.auth.resource.copyClipboard(dataX.message) 
    }


    redeem(){
      this.makeChanges = true;
      console.log(this.journey)
      if(this.journey == "POS"){
        this.redeemPOS();
      }
      if(this.journey == "B2U"){
        this.bsRef.dismiss({success: true, type:"BackHome", journey: "B2U" })
      }
      if(this.journey == "D2U"){
        this.bsRef.dismiss({success: true, type:"Redeem", journey: "D2U" })
      }
    }



    redeemPOS(){
      this.makeChanges = true;

this.auth.user$.pipe(take(1)).subscribe(mine => {
  if(!mine){}else{
    
     const data = { 
      //campID: this.userData.campID,
      from:"StoreORDER",
    type:[/*"addBalance", "firstBalance", "vendorAc"*/], 
      by: mine.uid, to: this.mess.storeReference.by,  sid:this.mess.storeReference.id, 
      storeName: this.mess.storeReference.name, userName: mine.name,
      amSale:0, amCost:0, amSave:0, 
      amTotal:0, userData: mine,

      camp: null, // SELECED
      code: this.mess.code,
      journey: "POS",
      earn: 0, // CASHBACK
      invoice:{
        //type: "Online",
        useRefrCash: false,
        amtRefrCash: 0,
        COD: false
      },
      ordrTYPE:"CASH",
      cart:[],
      logistics: {
        require: false,
        addressPick: null,
        addressDrop: null,
        status: 0
      }
    }


      this.pay.startGatewayOrder(data).then(ref => {
        if(!ref || !ref.id){
          this.auth.resource.startSnackBar("Payment Failed, Try again...");
        }else{
          this.bsRef.dismiss({success: true, type:"Redeem", journey: "POS", tranzID:ref.id})
        }
      })



  }
})
    }

}
