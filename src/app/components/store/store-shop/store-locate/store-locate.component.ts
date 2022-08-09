import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-store-locate',
  templateUrl: './store-locate.component.html',
  styleUrls: ['./store-locate.component.scss']
})
export class StoreLocateComponent implements OnInit {

  isReadMore = true;
  phone = "";
  storeName = "";
  currentLocation;
  addressList:any[] = []
  
  constructor(
    public dialogRef: MatDialogRef<StoreLocateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if(data?.loc){
      this.addressList = data?.loc;
      this.storeName = data?.storeName;
      this.currentLocation = data?.currentLocation;
      this.phone = data?.phone;
      console.log("addressList", this.currentLocation, this.addressList)
    }
   }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  showText() {
    this.isReadMore = !this.isReadMore;
  }

  mapLink(lat:number, lon: number){
    return 'https://maps.google.com/?q=' + lat + ',' + lon + '&title=' + this.storeName + '&content=' + "This is a Refr Club Store";
  }

}
