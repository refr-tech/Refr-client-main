import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { StoreCartComponent } from 'src/app/components/store/store-shop/store-cart/store-cart.component';
import { StoreVarientComponent } from 'src/app/components/store/store-shop/store-varient/store-varient.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-burn-product',
  templateUrl: './burn-product.component.html',
  styleUrls: ['./burn-product.component.scss']
})
export class BurnProductComponent implements OnInit {

  curated$:Observable<any[]> = of();
  store$:Observable<any> = of();
  product$:Observable<any> = of();

  makingChanges = false;

  storeReference:any = null;
  currentLocation:any = null;
  thing:any = null;

  constructor(
    public auth: AuthService,
    private actRoute: ActivatedRoute,
    private bottomSheet: MatBottomSheet
  ) { 
    const aR = this.actRoute.snapshot.params;
    const pid = aR["id"] || null;
    if(pid){
      this.execute(pid)
      this.curated$ = this.auth.getBurnProductHomeList(24);
    }
  }

  ngOnInit(): void {
  }

  execute(id:string){
    this.auth.getBurnProductByID(id).subscribe((res:any) => {
      if(!res){
        this.auth.resource.startSnackBar("No Such Product.")
      }else{
        if(!res.burn){
          this.auth.resource.startSnackBar("No Such Product.")
        }else{
          const storeID = res.sid;
          this.auth.getStore(storeID)//.pipe(take(1))
          .subscribe((storeX:any) => {
            if(!storeX){

            }else{
              let product = res;
              this.thing = res;
              product["storeINFO"] = storeX;
              this.product$ = of(product)

              
              const storeZ = storeX; // .pipe(take(1))
              this.auth.getStoreUser(storeX.by).pipe(take(1)).subscribe(storeXuser => {
                //console.log("store: ", storeX, storeXuser)
                if(!storeXuser){
      
                }else{
                  storeZ["userInfo"] = storeXuser;
                  this.storeReference = storeZ;
                  this.currentLocation = storeZ.loc[0];
                }
                
              })
            }
          })
        }
      }
    })

  }

  bucketMe(uid:string, id:string, make:boolean){
    this.makingChanges = true;
    this.auth.bucketMe(uid, id, make).then(() => {
      this.makingChanges = false;
    })
  }




  openCart(){
    this.auth.myCart = [];
    this.auth.myCartVar = [];

    const id:string = this.thing.id; 
    const variants:any = this.thing.variants; 
    const what:boolean = true; 
    const x:any = this.thing;

    if(!what){
      
      if(variants.length > 0){

        this.auth.myCart = this.auth.myCart.filter( val => val !== id);
        this.auth.myCartVar = this.auth.myCartVar.filter((y:any) => y.id !== id)
      }else{
      let index = this.auth.myCart.indexOf(id)
      this.auth.myCart.splice(index,1)
      }

    }else{

  if(variants.length > 0){
    this.productpop(id, variants, x)
  }else{
      this.auth.myCart.push(id)
      this.openCartX();
  }

    }
  }

  productpop(id:string, variants:any, x:any): void {
    const varRef = this.bottomSheet.open(StoreVarientComponent, {
      data: { product: x }, panelClass:"", //hasBackdrop: false,
    });
    varRef.afterDismissed().subscribe(ref => {
      if(!ref || !ref.success){

      }else{
        for ( let i = 0; i < ref.product.countQ; i += 1 ){ 
           this.auth.myCart.push(id)
        }
        this.auth.myCartVar.push(ref.product)
        this.openCartX();
      }
    })
  }

  openCartX(){
  const product = this.thing;
if(this.auth.myCart.length == 0 || !product ){

}else{

    const setJourney = {
      camp:null,
      journey:"BURN",
      code:null,
      refer:null
    }
    const products:any[] = [ product ];
    //this.auth.myCart = [product.id]
    
      // const camp = this.campaignList[this.campaignList.findIndex((cX:any) => cX.id == this.selectedCamp)]
      // this.setJourney.camp = camp;
      
    let isPhone = this.auth.resource.getWidth < 768;
    let w = isPhone ? this.auth.resource.getWidth + 'px' : '480px';
    let h = isPhone ? this.auth.resource.getHeight + 'px' : '98vh';
    const refDialog = this.auth.resource.dialog.open(StoreCartComponent, {
      width: w,
      minWidth: '320px',
      maxWidth: '480px',
      height: h,
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'dialogEntryCart', //, autoFocus:false
      data: {
        //cart: this.auth.myCart, 
        store: this.storeReference,
        products: products, 
        currentLocation: this.currentLocation,
        setJourney: setJourney
      }
    });
    refDialog.afterClosed().subscribe(ref => {
      if(!ref || !ref.success){
        
      }else{
        this.auth.myCart = [];
        this.auth.resource.router.navigate(["/order-status/" + ref.paymentId]);
        //this.auth.resource.startSnackBar("New Order has been Placed.")
      }
    });
}

  }


}
