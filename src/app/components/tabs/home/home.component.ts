import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable, of, take } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  // listSome = [
  //   {t:"Skrillex",i:"https://img.discogs.com/Sfz2Jim0byBu1JAA7lKX2kuR7Jk=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/A-1472585-1612815883-2680.jpeg.jpg"},
  //   {t:"Post Malone",i:"https://www.pdvg.it/wp-content/uploads/2020/07/POST-HYPERX-HXCKED-DATED724.jpg"},
  //   {t:"Bebe Rexha",i:"https://img.discogs.com/LH6jUajJwjZSbALaKSL3RNEb6vE=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-11092513-1515537014-7038.jpeg.jpg"},
  //   {t:"Rihana",i:"https://i.pinimg.com/originals/dc/bf/18/dcbf18b7d7ce59389e97a3117df68a88.jpg"},
  //   {t:"The Weeknd",i:"https://www.rockandpop.cl/wp-content/uploads/2019/11/weeknd-400x360.jpg"},
  //   {t:"Drake",i:"https://los40es00.epimg.net/los40/imagenes/2018/07/13/musica/1531482325_607205_1531483331_noticia_normal.jpg"},
  //   {t:"Bad Bunny",i:"https://www.edjes.net/wp-content/uploads/2019/08/67240119_2229205990531851_1618911467514363904_o-756x756.jpg"},
  //   {t:"Skrillex",i:"https://img.discogs.com/Sfz2Jim0byBu1JAA7lKX2kuR7Jk=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/A-1472585-1612815883-2680.jpeg.jpg"},
  //   {t:"Post Malone",i:"https://www.pdvg.it/wp-content/uploads/2020/07/POST-HYPERX-HXCKED-DATED724.jpg"},
  //   {t:"Bebe Rexha",i:"https://img.discogs.com/LH6jUajJwjZSbALaKSL3RNEb6vE=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-11092513-1515537014-7038.jpeg.jpg"},
  //   {t:"Rihana",i:"https://i.pinimg.com/originals/dc/bf/18/dcbf18b7d7ce59389e97a3117df68a88.jpg"},
  //   {t:"The Weeknd",i:"https://www.rockandpop.cl/wp-content/uploads/2019/11/weeknd-400x360.jpg"},
  //   {t:"Drake",i:"https://los40es00.epimg.net/los40/imagenes/2018/07/13/musica/1531482325_607205_1531483331_noticia_normal.jpg"},
  //   {t:"Bad Bunny",i:"https://www.edjes.net/wp-content/uploads/2019/08/67240119_2229205990531851_1618911467514363904_o-756x756.jpg"},
  // ];
  vendorList$: Observable<any[]> = of();
  pastList$: Observable<any[]> = of();
  offerList$: Observable<any[]> = of();
  storeOffl$: Observable<any[]> = of();
  storeOnli$: Observable<any[]> = of();
  storeBoth$: Observable<any[]> = of();

  imgLoaded: string[] = [];

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.execute()
    if(!this.auth.myLoc){
      const locData = localStorage.getItem('dataSource_LOCATION');

      //localStorage.setItem('dataSource_LOCATION', this.myLoc);
      //console.log(localStorage.getItem('dataSource_LOCATION'));
      if(!locData){
        this.auth.setLocation()
      }else{
        const LOCOBJ = JSON.parse(locData)
        //this.auth.resource.startSnackBar(LOCOBJ)
        this.auth.myLoc = LOCOBJ;
      }
    }
  }

  getCats(cat:any[]){
    return cat.sort((a,b) => a.rank - b.rank)
  }

  execute(){
    
    this.auth.user$.pipe(take(1)).subscribe(mine => {

      if(mine && mine.storeSav && mine.storeSav.length > 0){
        this.auth.getAllV2U(mine.uid, mine.storeSav, 9).then(ref => {
          console.log("DONE", ref)
          this.vendorList$ = of(ref);
        });
      }

      this.auth.getAllB2U(mine.uid, 9).then(ref => {
        console.log("DONE", ref)
        this.pastList$ = of(ref);
      });

      this.auth.getAllOffer(mine.uid, 9).then(ref => {
        console.log("DONE", ref)
        this.offerList$ = of(ref);
      });

    })


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
