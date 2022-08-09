import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  constructor(
    //private cd: ChangeDetectorRef,
    ) { }

  ngOnInit(): void {
    //this.cd.detectChanges();
  }


}
