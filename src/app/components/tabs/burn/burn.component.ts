import { Component, OnInit } from '@angular/core';
import { Observable, of, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-burn',
  templateUrl: './burn.component.html',
  styleUrls: ['./burn.component.scss']
})
export class BurnComponent implements OnInit {

  burn$:Observable<any> = of();
  // banners = [
  //   //{img:"assets/aditya/burn-banner-1.svg", url:""},
  //   //{img:"assets/aditya/burn-banner-2.svg", url:""},
  // ];

  burnCats$:Observable<any[]> = of();//[
    //{
    //  tit:"Accessories", img:"assets/aditya/accessories.webp", url:"/burn/accessories"
    //},

    // {tit:"Active Wear", img:"assets/aditya/activewear.webp", url:"/burn/activewear"},
    // {tit:"Beauty & wellness", img:"assets/aditya/beauty.webp", url:"/burn/beauty_and_wellness"},
    // {tit:"Electronics", img:"assets/aditya/electronics.webp", url:"/burn/electronics"},
    // {tit:"Food & Beverages", img:"assets/aditya/food.webp", url:"/burn/food_and_beverages"},
  //]

  curated$:Observable<any[]> = of();
  noCost$:Observable<any[]> = of();
  flashDeal$:Observable<any[]> = of();
  
  imgLoaded: string[] = [];
  
  balance = 0;

  constructor(
    public auth: AuthService
  ) { 
    this.execute();
  }

  ngOnInit(): void {
  }

  execute(){
    this.auth.user$.pipe(take(1)).subscribe(mine => {
      if( !mine ){
      }else{
        this.balance = mine.acBalC;
        this.burn$ = this.auth.getBurnHome();
        this.burnCats$ = this.auth.getBurnCats();
        this.curated$ = this.auth.getBurnProductHomeList(24);
        this.noCost$ = this.auth.getBurnProductListNoCost((this.balance), 4);
        this.flashDeal$ = this.auth.getBurnProductListCustom(4, "flash");
      }
    })
  }

}
