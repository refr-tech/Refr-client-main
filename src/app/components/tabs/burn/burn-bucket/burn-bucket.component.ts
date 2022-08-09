import { Component, OnInit } from '@angular/core';
import { Observable, of, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-burn-bucket',
  templateUrl: './burn-bucket.component.html',
  styleUrls: ['./burn-bucket.component.scss']
})
export class BurnBucketComponent implements OnInit {

  curated$:Observable<any[]> = of();

  imgLoaded: string[] = [];
  
  emptyBucket = false;
  balance = 0;

  constructor(
    private auth: AuthService
  ) {
    this.execute();
   }

  ngOnInit(): void {
  }

  execute(){
    this.auth.user$.pipe(take(1)).subscribe(mine => {
      if( !mine || !mine.bucket || mine.bucket.length == 0 ){
        this.emptyBucket = true;
      }else{
        this.balance = mine.acBalC;
        this.curated$ = this.auth.getBurnBucket(mine.bucket, 24);
      }
    })
  }

}
