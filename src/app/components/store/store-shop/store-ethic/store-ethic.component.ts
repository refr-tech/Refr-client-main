import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-store-ethic',
  templateUrl: './store-ethic.component.html',
  styleUrls: ['./store-ethic.component.scss']
})
export class StoreEthicComponent implements OnInit {
  links = [
    "Online", "Offline"
  ]
  activeLink = "Online";
  constructor() { }

  ngOnInit(): void {
  }

}
