import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {
  navigationSubscription;     

  mode = "";
  imgLoaded:string[] = [];
  storeList$: Observable<any[]> = of();
  codes$: Observable<any[]> = of();

  makeChanges = false;

  cats = [
    {name:"cafes", link:"/discover/list/food_and_beverages/sc-food_and_beverages-cafe"},
    {name:"salons", link:"/discover/list/salons_and_spa"},
    {name:"restaurants", link:"/discover/list/food_and_beverages/sc-food_and_beverages-restaurants"},
    {name:"fashion", link:"/discover/list/fashion_brand"},
    {name:"beauty", link:""},
    {name:"electronics", link:"/discover/list/electronics"},
    {name:"home care", link:"/list/healthcare"},
    {name:"clinics", link:"/list/healthcare"},
    {name:"accessories", link:"/discover/list/electronics/sc-electronics-mobile_phones"},
    {name:"pet products", link:""},
    {name:"fitness", link:"/discover/list/fitness"},
    {name:"pubs", link:""},
  ]

  viaCat = ""; viaOFF = "";

  title = 'Styles to shop';
  secondary_title = 'Flaunt your fashion and get rewarded';

  cat$X:any = null;

  cat$food_and_beverages = {
    id: 'food_and_beverages',
    title: 'Food & Beverages',
    head:"Share the love for food", foot:"Unlimited rewards on every dining and delivery",
    icon: '',
    anim: '',
    img: '',
    rank: 0,
    count: 0,
    items: [
      // food & beverages
      {
        id: 'sc-food_and_beverages-restaurants',
        icon: '',
        anim: '',
        img: 'assets/cat/food_and_beverages/resturant.webp',
        name: 'Restaurants',
        type: 'food_and_beverages',
        rank: 0,
        count: 0,
      },
      {
        id: 'sc-food_and_beverages-cafe',
        icon: '',
        anim: '',
        img: 'assets/cat/food_and_beverages/cafe.webp',
        name: 'Cafe',
        type: 'food_and_beverages',
        rank: 0,
        count: 0,
      },

      {
        id: 'sc-food_and_beverages-clubs_and_bars',
        icon: '',
        anim: '',
        img: 'assets/cat/food_and_beverages/clubs.webp',
        name: 'Clubs & Bars',
        type: 'food_and_beverages',
        rank: 0,
        count: 0,
      },
      {
        id: 'sc-food_and_beverages-bakery',
        icon: '',
        anim: '',
        img: 'assets/cat/food_and_beverages/bakery.webp',
        name: 'Bakery',
        type: 'food_and_beverages',
        rank: 0,
        count: 0,
      },
    ],
  };

  cat$fashion_brand = {
    id: 'fashion_brand',
    title: 'Fashion brand',
    head:"Styles to shop", foot:"Flaunt your fashion and get rewarded",
    icon: '',
    anim: '',
    img: '',
    rank: 0,
    count: 0,
    items: [
      // Fashion brand
      {
        id: 'sc-fashion_brand-mens_fashion',
        icon: '',
        anim: '',
        img: 'assets/cat/fashion_brand/men.webp',
        name: 'Mens',
        type: 'fashion_brand',
        rank: 0,
        count: 0,
      },
      {
        id: 'sc-fashion_brand-womens_fashion',
        icon: '',
        anim: '',
        img: 'assets/cat/fashion_brand/women.webp',
        name: 'Womens',
        type: 'fashion_brand',
        rank: 0,
        count: 0,
      },
      {
        id: 'sc-fashion_brand-kids_fashion',
        icon: '',
        anim: '',
        img: 'assets/cat/fashion_brand/kid.webp',
        name: 'Kids',
        type: 'fashion_brand',
        rank: 0,
        count: 0,
      },
      {
        id: 'sc-fashion_brand-kids_fashion',
        icon: '',
        anim: '',
        img: 'assets/cat/fashion_brand/accesories.webp',
        name: 'Accessories',
        type: 'fashion_brand',
        rank: 0,
        count: 0,
      },
      {
        id: 'sc-fashion_brand-kids_fashion',
        icon: '',
        anim: '',
        img: 'assets/cat/fashion_brand/footwear.webp',
        name: 'Footwear',
        type: 'fashion_brand',
        rank: 0,
        count: 0,
      },
    ],
  };

  cat$electronics = {
    id: 'electronics',
    title: 'Electronics',
    head:"Teach me to your friends", foot:"Shop and recommend to get rewarded",
    icon: '',
    anim: '',
    img: '',
    rank: 0,
    count: 0,
    items: [
      // Electronics
      {
        id: 'sc-electronics-televisions_and_large_appliances',
        icon: '',
        anim: '',
        img: 'assets/cat/electronics/mobliephones.webp',
        name: 'moblie phones',
        type: 'electronics',
        rank: 0,
        count: 0,
      },
      {
        id: 'sc-electronics-accessories',
        icon: '',
        anim: '',
        img: 'assets/cat/electronics/computers.webp',
        name: 'Computers',
        type: 'electronics',
        rank: 0,
        count: 0,
      },
      {
        id: 'sc-electronics-mobile_phones',
        icon: '',
        anim: '',
        img: 'assets/cat/electronics/tv.webp',
        name: 'T.V',
        type: 'electronics',
        rank: 0,
        count: 0,
      },
      {
        id: 'sc-electronics-mobile_phones',
        icon: '',
        anim: '',
        img: 'assets/cat/electronics/accessories.webp',
        name: 'Accessories',
        type: 'electronics',
        rank: 0,
        count: 0,
      },
    ],
  };

  cat$healthcare = {
    id: 'healthcare',
    title: 'Healthcare',
    head:"Health for all", foot:"Recommend your trusted healthcare professionals",
    icon: '',
    anim: '',
    img: '',
    rank: 0,
    count: 0,
    items: [
      // Healthcare
      {
        id: 'sc-healthcare-dermat',
        icon: '',
        anim: '',
        img: 'assets/cat/healthcare/dentist.webp',
        name: 'Dentist',
        type: 'healthcare',
        rank: 0,
        count: 0,
      },
      {
        id: 'sc-healthcare-dentist',
        icon: '',
        anim: '',
        img: 'assets/cat/healthcare/Ayurveda.webp',
        name: 'Ayurveda',
        type: 'healthcare',
        rank: 0,
        count: 0,
      },
      {
        id: 'sc-healthcare-general-physician',
        icon: '',
        anim: '',
        img: 'assets/cat/healthcare/Diagnostic.webp',
        name: 'Diagnostic',
        type: 'healthcare',
        rank: 0,
        count: 0,
      },
      {
        id: 'sc-healthcare-ent',
        icon: '',
        anim: '',
        img: 'assets/cat/healthcare/Homeopathy.webp',
        name: 'Homeopathy',
        type: 'healthcare',
        rank: 0,
        count: 0,
      },
      {
        id: 'sc-healthcare-ophthal',
        icon: '',
        anim: '',
        img: 'assets/cat/healthcare/Physiotheraphy.webp',
        name: 'Physiotheraphy',
        type: 'healthcare',
        rank: 0,
        count: 0,
      },
    ],
  };

  cat$salons_and_spa = {
    id: 'salons_and_spa',
    title: 'Salons & Spa',
    head:"Beauty and glow together", foot:"Relax, Rejuvenate & pamper yourself and get rewarded",
    icon: '',
    anim: '',
    img: '',
    rank: 0,
    count: 0,
    items: [
      // Salons & Spa
      {
        id: 'sc-salons_and_spa-unisex_salon',
        icon: '',
        anim: '',
        img: 'assets/cat/salons_and_spa/mens_salon.webp',
        name: 'Men Salon',
        type: 'salons_and_spa',
        rank: 0,
        count: 0,
      },
      {
        id: 'sc-salons_and_spa-women_salon',
        icon: '',
        anim: '',
        img: 'assets/cat/salons_and_spa/women _salon.webp',
        name: 'Women Salon',
        type: 'salons_and_spa',
        rank: 0,
        count: 0,
      },
      {
        id: 'sc-salons_and_spa-men_salon',
        icon: '',
        anim: '',
        img: 'assets/cat/salons_and_spa/spa.webp',
        name: 'Men Salon',
        type: 'salons_and_spa',
        rank: 0,
        count: 0,
      },
      {
        id: 'sc-salons_and_spa-children_salon',
        icon: '',
        anim: '',
        img: 'assets/cat/salons_and_spa/spa.webp',
        name: 'Spa',
        type: 'salons_and_spa',
        rank: 0,
        count: 0,
      },
      {
        id: 'sc-salons_and_spa-nail_spa',
        icon: '',
        anim: '',
        img: 'assets/cat/salons_and_spa/nail_spa.webp',
        name: 'Nail spa',
        type: 'salons_and_spa',
        rank: 0,
        count: 0,
      },
    ],
  };

  cat$fitness = {
    id: 'fitness',
    title: 'Fitness',
    head:"Train together and save", foot:"Recommended your fitness secrets and get rewarded",
    icon: '',
    anim: '',
    img: '',
    rank: 0,
    count: 0,
    items: [
      // fitness
      {
        id: 'sc-fitness-pre_natal_classes',
        icon: '',
        anim: '',
        img: 'assets/cat/fitness/gym.webp',
        name: 'gym',
        type: 'fitness',
        rank: 0,
        count: 0,
      },
      {
        id: 'sc-fitness-dance_studios',
        icon: '',
        anim: '',
        img: 'assets/cat/fitness/yoga.webp',
        name: 'yoga',
        type: 'fitness',
        rank: 0,
        count: 0,
      },
      {
        id: 'sc-fitness-yoga',
        icon: '',
        anim: '',
        img: 'assets/cat/fitness/fitness_studio.webp',
        name: 'Fitness Studio',
        type: 'fitness',
        rank: 0,
        count: 0,
      },
      {
        id: 'sc-fitness-fitness_studios',
        icon: '',
        anim: '',
        img: 'assets/cat/fitness/dance_studio.webp',
        name: 'Dance Studio',
        type: 'fitness',
        rank: 0,
        count: 0,
      },
    ],
  };

  discover = false;

  constructor(
    public auth: AuthService,
    private actRoute: ActivatedRoute
  ) {
    this.navigationSubscription = this.auth.resource.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    })

  }

  ngOnInit(): void {
  }

  initialiseInvites(){
    const newURL = this.auth.resource.router.url;
    const aR = this.actRoute.snapshot.params;
    console.log(newURL)

    if( newURL == "/discover" ){
      this.discover = true;
    }
    if( newURL.includes("/discover/") ){
      const x = aR["share"];
    if(x == "f2f"){ this.mode = "f2f"; this.execute(this.mode, "") }
    if(x == "b2u"){ this.mode = "b2u"; this.execute(this.mode, "") }
    }
    if( newURL.includes("/discover/deals/") || newURL.includes("/discover/list/") ){
      const cat = aR["cat"];
      const subcat = aR["subcat"];
    if(cat){
      this.viaCat = cat;
      if( newURL.includes("/discover/list/") ){
        this.viaOFF = "list";

        if(cat == 'food_and_beverages'){
          this.cat$X = this.cat$food_and_beverages;
        }
        if(cat == 'fashion_brand'){
          this.cat$X = this.cat$fashion_brand;
        }
        if(cat == 'electronics'){
          this.cat$X = this.cat$electronics;
        }
        if(cat == 'healthcare'){
          this.cat$X = this.cat$healthcare;
        }
        if(cat == 'salons_and_spa'){
          this.cat$X = this.cat$salons_and_spa;
        }
        if(cat == 'fitness'){
          this.cat$X = this.cat$fitness;
        }

      }
      if( newURL.includes("/discover/deals/") ){this.viaOFF = "deals";}
    }
    if(cat && !subcat){ this.mode = "cat"; this.execute(this.mode, cat) 

    }
    if(cat && subcat){ this.mode = "sub"; this.execute(this.mode, subcat) }
    }

    if( newURL.includes("/discover/stores/all/") ){
      const x = aR["type"];
      if(x == "online"){ this.mode = "onli"; this.execute(this.mode, "") }
      if(x == "offline"){ this.mode = "offl"; this.execute(this.mode, "") }
      if(x == "hybrid"){ this.mode = "both"; this.execute(this.mode, "") }
    }
  }

  execute(mode:string, catX:string){
    console.log(mode)
    
    if(mode == "cat"){ this.storeList$ = this.auth.getAllStoreCatLevel("cat", catX, 24) }
    if(mode == "sub"){ this.storeList$ = this.auth.getAllStoreCatLevel("subCat", catX, 24) }

    if(mode == "onli"){ this.storeList$ = this.auth.getAllStoreHome("Onli", 24) }
    if(mode == "offl"){ this.storeList$ = this.auth.getAllStoreHome("Offl", 24) }
    if(mode == "both"){ this.storeList$ = this.auth.getAllStoreHome("Both", 24) }

    if(mode == "f2f"){ 
      this.auth.user$.pipe(take(1)).subscribe(mine => {
        this.auth.getAllF2F(mine.uid, 24).then(ref => {
          console.log("DONE", ref)
          this.storeList$ = of(ref.stores);
          this.codes$ = of(ref.codes);
        });
      })
    }

    if(mode == "b2u"){ 
      this.auth.user$.pipe(take(1)).subscribe(mine => {
        this.auth.getAllB2U(mine.uid, 24).then(ref => {
          console.log("DONE", ref)
          this.storeList$ = of(ref);
        });
      })
    }
  }

  openDialog(mode:any) {/*
    const dialogRef = this.dialog.open(MenuDialogComponent,
      {
      data:mode,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '70%',
      width: '100%',
      panelClass: 'full-screen-modal'
    } );*/
  }

  
  getSubCat(cat:string, subcat:string){
    if(this.auth.resource.categoryList.length == 0 || !cat || !subcat){
      return cat || "";
    }else{
      const c = this.auth.resource.categoryList.findIndex((x:any) => x.id == cat);
      const sc = this.auth.resource.categoryList[c].items.findIndex((x:any) => x.id == subcat);
      const now = this.auth.resource.categoryList[c].items[sc];
      return now.name;
    }
  }
/*
  startRefr(store:any, uid:string){
    console.log(store, uid)
    if(store.codeInfo){
      const xURL = "/store/" + store.id + "-" + store.codeInfo.id + "/shareB2U"
      console.log(xURL)
      // NAVIGATE TO SHARE
      this.auth.resource.router.navigate([xURL])
      // NAVIGATE TO SHARE
    }
  }
*/
}
