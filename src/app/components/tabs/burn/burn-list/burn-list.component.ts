import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-burn-list',
  templateUrl: './burn-list.component.html',
  styleUrls: ['./burn-list.component.scss']
})
export class BurnListComponent implements OnInit {

  curated$:Observable<any[]> = of();

  imgLoaded: string[] = [];

  title = "";

  balance = 0;

  constructor(
    private auth: AuthService,
    private actRoute: ActivatedRoute
  ) { 
    this.execute()
  }

  ngOnInit(): void {
  }

  execute(){
    const r = this.actRoute.snapshot.params;
    const what = r["noCost"] ? "noCost" : "" + r["flashSale"] ? "flashSale": "";

    if(what == "noCost"){
      this.title = "No Cost Deals";
      this.auth.user$.pipe(take(1)).subscribe(mine => {
        if( !mine ){
        }else{
          this.balance = mine.acBalC;
          this.curated$ = this.auth.getBurnProductListNoCost(this.balance, 24);
        }
      })
    }

    if(what == "flashSale"){
      this.title = "Flash Sale";
      this.curated$ = this.auth.getBurnProductListCustom(24, "flash");
    }

  }

}
