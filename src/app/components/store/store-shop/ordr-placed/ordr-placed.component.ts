import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-ordr-placed',
  templateUrl: './ordr-placed.component.html',
  styleUrls: ['./ordr-placed.component.scss']
})
export class OrdrPlacedComponent implements OnInit {

  payment$:Observable<any> = of();

  constructor(
    private actRoute: ActivatedRoute,
    private pay: PaymentService
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

  execute(id:string){
    this.payment$ = this.pay.getPayment(id)//.pipe(take(1))
  }
  
}
