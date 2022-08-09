import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsComponent } from './components/contacts/contacts.component';
import { StoreRedeemComponent } from './components/store/store-redeem/store-redeem.component';
import { StoreShareComponent } from './components/store/store-share/store-share.component';
import { OrdrPlacedComponent } from './components/store/store-shop/ordr-placed/ordr-placed.component';
import { OrdrThankComponent } from './components/store/store-shop/ordr-thank/ordr-thank.component';
import { StoreShopComponent } from './components/store/store-shop/store-shop.component';
import { StoreThankComponent } from './components/store/store-thank/store-thank.component';
import { StoreComponent } from './components/store/store.component';
import { BurnBucketComponent } from './components/tabs/burn/burn-bucket/burn-bucket.component';
import { BurnCatComponent } from './components/tabs/burn/burn-cat/burn-cat.component';
import { BurnListComponent } from './components/tabs/burn/burn-list/burn-list.component';
import { BurnProductComponent } from './components/tabs/burn/burn-product/burn-product.component';
import { BurnComponent } from './components/tabs/burn/burn.component';
import { DiscoverComponent } from './components/tabs/discover/discover.component';
import { FeedComponent } from './components/tabs/feed/feed.component';
import { HomeComponent } from './components/tabs/home/home.component';
import { ProfileComponent } from './components/tabs/profile/profile.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { WalletComponent } from './components/tabs/wallet/wallet.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [

  {path:'', component: WelcomeComponent},
  {path:'v1/:sid', component: WelcomeComponent}, // creates new code POS
  {path:'b1/:sid', component: WelcomeComponent}, // creates new code B2U
  {path:'d1/:sid/:payID', component: WelcomeComponent}, // creates new code D2U
  {path:'p1/:sid', component: WelcomeComponent}, // creates new code F2U
  {path:'addF2F/:what/:code', component: WelcomeComponent},

  {path:'sync-contacts', component: ContactsComponent, canActivate: [AuthGuard]},
  
  { path:'', component:TabsComponent, children: [
    {path:'', redirectTo:'/home', pathMatch:"full" },
    {path:'home', component: HomeComponent, canActivate: [AuthGuard] },
    {path:'discover', component: DiscoverComponent, canActivate: [AuthGuard]  },
    {path:'discover/list/:cat', component: DiscoverComponent, canActivate: [AuthGuard]  },
    {path:'discover/list/:cat/:subcat', component: DiscoverComponent, canActivate: [AuthGuard]  },
    {path:'discover/deals/:cat', component: DiscoverComponent, canActivate: [AuthGuard]  },
    {path:'discover/deals/:cat/:subcat', component: DiscoverComponent, canActivate: [AuthGuard]  },
    {path:'discover/all/:share', component: DiscoverComponent, canActivate: [AuthGuard]  },
    {path:'discover/stores/all/:type', component: DiscoverComponent, canActivate: [AuthGuard]  },
    {path:'feed', component: FeedComponent, canActivate: [AuthGuard]  },
    {path:'wallet', component: WalletComponent, canActivate: [AuthGuard] },
    {path:'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  ] },

    {path:'burn', component: BurnComponent, canActivate: [AuthGuard] },
    {path:'burn/:cat', component: BurnCatComponent, canActivate: [AuthGuard] },
    {path:'burn-list/:type', component: BurnListComponent, canActivate: [AuthGuard] },
    {path:'burn-bucket', component: BurnBucketComponent, canActivate: [AuthGuard] },
    {path:'burn-shop/:id', component: BurnProductComponent, canActivate: [AuthGuard] },

  {path:'store/:id', component: StoreComponent, children:[
    {path:'', component: StoreShopComponent, },
    {path:':share', component: StoreShareComponent, canActivate: [AuthGuard] },
  ] },
  {path:'go', component: StoreComponent, children:[
    {path:':code', component: StoreShopComponent, },
  ] },
  {path:'redeem/:id', component: StoreRedeemComponent, canActivate: [AuthGuard] },
  {path:'order-status/:id', component: OrdrPlacedComponent, canActivate: [AuthGuard] },
  //{path:'thank-you/:sid', component: OrdrThankComponent, canActivate: [AuthGuard] },
  {path:'thank-you/:sid', component: StoreThankComponent, canActivate: [AuthGuard] },
  //{path:'thanks', component: OrdrThankComponent, canActivate: [AuthGuard] },



  { path:'**', redirectTo:'/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload', scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
