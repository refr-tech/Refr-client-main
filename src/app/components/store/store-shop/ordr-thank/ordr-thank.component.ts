import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-ordr-thank',
  templateUrl: './ordr-thank.component.html',
  styleUrls: ['./ordr-thank.component.scss']
})
export class OrdrThankComponent implements OnInit {

  loading = true;

  store$: Observable<any> = of();
  storeBoth$: Observable<any[]> = of();
  storeOnli$: Observable<any[]> = of();
  storeOffl$: Observable<any[]> = of();

  imgLoaded: string[] = [];

  completeANIM = false;
  makeChanges = false;

  constructor(
    private actRoute: ActivatedRoute,
    public auth: AuthService,
    //public pay: PaymentService,

    private firestore: Firestore,
    private cd: ChangeDetectorRef,

    private renderer2: Renderer2,
    private elementRef: ElementRef
    ) { 
      const aR = this.actRoute.snapshot.params;
      const id = aR["id"] || null;
      console.log("id", id)
  
      if(!id){
  
      }else{
        this.execute(id)
      }
    }

  ngOnInit(): void {
  }

  execute(sid:string){
    this.store$ = this.auth.getStore(sid) //.pipe(take(1));

    this.storeOffl$ = this.auth.getAllStoreHome("Offl", 9)
    // .subscribe(ref => {
    //   if(!ref){}else{
    //     this.storeOffl$ = of(ref);
    //   }
    // })
    this.storeOnli$ = this.auth.getAllStoreHome("Onli", 9)
    // .subscribe(ref => {
    //   if(!ref){}else{
    //     this.storeOnli$ = of(ref);
    //   }
    // })
    this.storeBoth$ = this.auth.getAllStoreHome("Both", 9)
    // .subscribe(ref => {
    //   if(!ref){}else{
    //     this.storeBoth$ = of(ref);
    //   }
    // })
  }

  getSubCat(cat:string, subcat:string){
    if(this.auth.resource.categoryList.length == 0){
      return cat;
    }else{
      const c = this.auth.resource.categoryList.findIndex((x:any) => x.id == cat);
      const sc = this.auth.resource.categoryList[c].items.findIndex((x:any) => x.id == subcat);
      const now = this.auth.resource.categoryList[c].items[sc];
      return now.name;
    }
  }
  
}
