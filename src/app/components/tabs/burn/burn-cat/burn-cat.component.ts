import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-burn-cat',
  templateUrl: './burn-cat.component.html',
  styleUrls: ['./burn-cat.component.scss']
})
export class BurnCatComponent implements OnInit {

  // cat = {
  //   tit:"Accessories", 
  //   img:"assets/aditya/accessories.webp", 
  //   url:"/burn/accessories",
  //   subCat:[
  //     {id:"footwear", tit:"Footwear"},
  //     {id:"bags_and_wallet", tit:"Bags & Wallet"},
  //     {id:"jewellery", tit:"Jewellery"},
  //     //{id:"clothing", tit:"Clothing"},
  //   ],

  //   banners:[
  //     {url:"", img:"assets/aditya/burn-banner-1.svg"},
  //     {url:"", img:"assets/aditya/burn-banner-1.svg"},
  //   ],
  //   newIN:[
  //     {url:"", img:"assets/aditya/burn-banner-1.svg"},
  //     {url:"", img:"assets/aditya/burn-banner-1.svg"},
  //   ],
  //   spot:[
  //     {url:"", img:"assets/aditya/burn-banner-1.svg"},
  //     {url:"", img:"assets/aditya/burn-banner-1.svg"},
  //     {url:"", img:"assets/aditya/burn-banner-1.svg"},
  //     {url:"", img:"assets/aditya/burn-banner-1.svg"},
  //     {url:"", img:"assets/aditya/burn-banner-1.svg"},
  //     {url:"", img:"assets/aditya/burn-banner-1.svg"},
  //   ]
  // }

  burnCat$:Observable<any> = of();
  curated$:Observable<any[]> = of();
  // subCatX:any[] = [
    // {burnSubCat:"footwear"},
    // {burnSubCat:"footwear"},
    // {burnSubCat:"bags_and_wallet"},
    // {burnSubCat:"jewellery"}
  // ];

  imgLoaded: string[] = [];

  title = "";

  constructor(
    private auth: AuthService,
    private actRoute: ActivatedRoute
  ) {

    const r = this.actRoute.snapshot.params;
if(r["cat"]){
  this.execute(r["cat"]);
}
  }

  ngOnInit(): void {
  }


  execute(id:string){
    this.title = id;
    this.burnCat$ = this.auth.getBurnCatByID(id);
    this.burnCat$.pipe(take(1)).subscribe(b => {
      if(!b){

      }else{
        this.title = b.tit;
      }
    })
    this.curated$ = this.auth.getBurnProductCatList(id, 24);
  }

  getSubcat(id:string, subCatX:any[]){
    if(subCatX.length == 0){
      return []
    }else{
      return subCatX.filter(x => x.burnSubCat == id);
    }
  }


}
