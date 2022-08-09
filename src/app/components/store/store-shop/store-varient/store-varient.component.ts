import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-store-varient',
  templateUrl: './store-varient.component.html',
  styleUrls: ['./store-varient.component.scss']
})
export class StoreVarientComponent implements OnInit {

  isReadMore = true;
  product:any = null;
  imagesLoaded: string[] = [];
  omniList:any[] = [];
  colorList:any[] = [];
  otherList:any[] = [];
  varList:any[] = [];
  
  nowVarient:any = []
  countQ = 0;

  variantsMode  = false;

  constructor(
    private bsRef: MatBottomSheetRef<StoreVarientComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private auth: AuthService
  ) { 
    this.product = data.product;
    if(data.product.variants.length > 0){
      this.variantsMode = true;
      this.execute(data.product.variants)
    }
  }

  ngOnInit(): void {}

  showText() {
    this.isReadMore = !this.isReadMore;
  }

  openLink(): void {
    this.bsRef.dismiss();
  }

  execute(variants:any){
    this.colorList = [];
    for (let c = 0; c < variants.length; c++) {
      const element = variants[c];
      this.omniList.push(element.type);
      if(element.type == "palete"){
        this.colorList.push(element);
      }else{
        this.varList.push(element);
        if(!this.otherList.includes(element.type)){
        this.otherList.push(element.type);
        }
      }
    }

  }

  getOptions(v:string){
    let x = [];
    for (let i = 0; i < this.varList.length; i++) {
      const element = this.varList[i];
      if(v == element.type){
        x.push(element)
      }
      if( (i+1) == this.varList.length ){
        return x;
      }
    }
  }

  getNowSelected(type:string){
    if(this.nowVarient.length == 0){
      return "";
    }else{
    const z = this.nowVarient.findIndex((x:any) => {
      return x.type == type //&& x.name == name;
    })
    return this.nowVarient[z]?.name;
    }
  }

  selectVar(type:string, name:string){ 
    console.log(type,name)
    if(!type || !name){
      console.log("Something wrong")
    }else{
      const z = this.nowVarient.findIndex((x:any) => {
        return x?.type == type //&& x.name == name;
      })
      if(z !== -1){
        console.log(z)
      this.nowVarient.splice(z, 1);
      }
      this.nowVarient.push({type:type, name:name})
      console.log(this.nowVarient)
    }
  }

  changeQuntity(doX:boolean){
    if(!this.checkIfEverything()){
      this.auth.resource.startSnackBar("Please select everything.")
    }else{
    if(!doX){
      if(this.countQ > 1){
      this.countQ--
      }
    }else{
      this.countQ++
    }
    }
  }


  checkIfEverything(){
    let status = true;
    for (let i = 0; i < this.omniList.length; i++) {
      const type = this.omniList[i];
      const z = this.nowVarient.findIndex((x:any) => {
        return x?.type == type //&& x.name == name;
      })
      if(z == -1){
        status = false;
      }
      if( (i + 1) == this.omniList.length ){
        return status;
      }
    }
  }

  doneWithIt(){
    if(!this.checkIfEverything()){
      this.auth.resource.startSnackBar("Please select everything.")
    }else{
      this.bsRef.dismiss({ success:true, 
        product:{id:this.product.id, nowVarient: this.nowVarient, countQ: this.countQ}
      })
    }
  }

}
