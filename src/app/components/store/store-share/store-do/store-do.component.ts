import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';
import { AuthService } from 'src/app/services/auth.service';

function toDataURL(url:string, callback: any) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

@Component({
  selector: 'app-store-do',
  templateUrl: './store-do.component.html',
  styleUrls: ['./store-do.component.scss']
})
export class StoreDoComponent implements OnInit {

  makingChanges = false;
  withImage = "";
  image = "";
  type = "";

  constructor(
    public auth: AuthService,
    private dialogRef: MatDialogRef<StoreDoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) { 
      const id = data.id;
      if(
        //id == "instaStories" || 
        id == "whatsApp" || 
        id == "instaDM" || 
        id == "instaPost" || 
        //id == "fbMESS" || 
        //id == "fbPOST" || 
        //id == "text" || 
        //id == "mail" || 
        id == "twitter" || 
        //id == "copy" || 
        //id == "sync" || 
        id == "more" //|| id == "more2" 
      ){
        this.withImage = "yes";
        if(id == "instaPost"){ // 1:1
          this.type = id;
          const image = "assets/brand/opengraph.png";
  
          toDataURL(image, async (dataUrl: any) => {
            this.image = dataUrl;
          })
        }else{
          if(id == "whatsApp"){
            const image = "";
            this.image = image;
          }else{
            const image = "assets/brand/opengraph.png";
    
            toDataURL(image, async (dataUrl: any) => {
              this.image = dataUrl;
            })
          }
        }
      }else{
        this.withImage = "no";
        this.type = id;
      }

    }

  ngOnInit(): void {
  }

  platformYes(){
    this.dialogRef.close({success:true, image:this.image})
  }

  async takePicture(type:string){
    if(!this.makingChanges){
      const image = await Camera.getPhoto({
        quality: 100,
        height: 300,
        width: 300,
        allowEditing: false,
        source:CameraSource.Camera,
        resultType: CameraResultType.Uri
      });
      console.log("image", image)
      const imageUrl = image.webPath || "";
      if(imageUrl){
      this.startCropper(imageUrl, type);
      console.log("image", imageUrl)
      }else{
        console.log("No image")
      }
    }
  }
  async choosePhoto(type:string){
    if(!this.makingChanges){
      const image = await Camera.pickImages({
        quality: 100,
        height: 300,
        width: 300,
        limit: 1,
      });
      const imageUrl = image.photos[0].webPath || "";
      if(imageUrl){
      this.startCropper(imageUrl, type);
      console.log("image", imageUrl)
      }else{
        console.log("No image")
      }
    }
  }

  startCropper(webPath:string, type:string){
    if(!this.makingChanges){
      let isPhone = this.auth.resource.getWidth < 768;
      let w = isPhone ? this.auth.resource.getWidth + "px" : "480px";
      let h = isPhone ? this.auth.resource.getHeight + "px" : "";
      const refDialog = this.auth.resource.dialog.open(CropperComponent, {
        width: w, minWidth: "320px", maxWidth: "480px",
        height:h,
        data:{webPath:webPath, type:type},
        disableClose: true, panelClass:"dialogLayout"//, autoFocus:false
      });
      refDialog.afterClosed().subscribe(result =>{
        console.log("cropper closed")
        if(!result.success){
          if(result.info){
            console.log(result.info);
            this.auth.resource.startSnackBar(result.info)
          }
        }else{
          this.image = result.croppedImage;

          // if(type == "logo"){
          //   this.auth.updateStoreLogo(this.storeID, result.croppedImage ).then(ref => {
          //     if(!ref || !ref.success){
          //       this.auth.resource.startSnackBar("Upload Failed!");
          //       this.makingChanges = false;
          //     }else{
          //       this.storeLogo = ref.url;
          //       this.auth.resource.startSnackBar("Logo Update Under Review!");
          //       this.makingChanges = false;
          //     }
          //   });
          // }

        }
      })
    }
  }



}
