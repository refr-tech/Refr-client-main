import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, BottomSheetUpdate } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';

import {MatExpansionModule} from '@angular/material/expansion';

import { BottomSheetNotification, TabsComponent } from './components/tabs/tabs.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HomeComponent } from './components/tabs/home/home.component';
import { WalletComponent } from './components/tabs/wallet/wallet.component';
import { BurnComponent } from './components/tabs/burn/burn.component';
import { DiscoverComponent } from './components/tabs/discover/discover.component';
import { ProfileComponent } from './components/tabs/profile/profile.component';
import { SignComponent } from './components/welcome/sign/sign.component';
import { AddBalanceComponent } from './components/tabs/wallet/add-balance/add-balance.component';
import { StoreComponent } from './components/store/store.component';
import { environment } from 'src/environments/environment';

import { ContentComponent } from './placeholders/content/content.component';
import { CropperComponent } from './placeholders/cropper/cropper.component';


// 1. Import the libs you need
//import { AngularFireModule } from '@angular/fire/compat';
//import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
// import { AngularFireStorageModule } from '@angular/fire/compat/storage';
// import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { provideFirebaseApp, getApp, initializeApp, FirebaseApp } from '@angular/fire/app';
import { provideAuth, initializeAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore, enableIndexedDbPersistence, connectFirestoreEmulator } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';

import { indexedDBLocalPersistence, browserPopupRedirectResolver } from 'firebase/auth';

import { ImageCropperModule } from 'ngx-image-cropper';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { FeedComponent } from './components/tabs/feed/feed.component';
import { ScannerComponent } from './placeholders/scanner/scanner.component';
import { StoreShareComponent } from './components/store/store-share/store-share.component';
import { StoreShopComponent } from './components/store/store-shop/store-shop.component';
import { ContactsComponent } from './components/contacts/contacts.component';

//import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
//import { SocialSharing } from '@awesome-cordova-plugins/social-sharing';
//import { SocialSharing } from '@ionic-native/social-sharing/ngx';
//import { SocialSharing } from '@ionic-native/social-sharing';



// // 2. Add your credentials from step 1
// const config = {
//   apiKey: "AIzaSyC1dPYtopKROtR01CORXpWc2GHvrgznc0g",
//   authDomain: "refr-india.firebaseapp.com",
//   projectId: "refr-india",
//   storageBucket: "refr-india.appspot.com",
//   messagingSenderId: "471641178783",
//   appId: "1:471641178783:web:43c8aa09c584db065f18aa"
// };

//import { Capacitor } from '@capacitor/core';

import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { BottomSheetOTP, StoreCartComponent } from './components/store/store-shop/store-cart/store-cart.component';
import { PayComponent } from './components/pay/pay.component';
import { StoreActionComponent } from './components/store/store-share/store-action/store-action.component';
import { StoreDoComponent } from './components/store/store-share/store-do/store-do.component';
import { GetLocationComponent } from './placeholders/get-location/get-location.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { StepPosComponent } from './components/welcome/step-pos/step-pos.component';
import { StoreRedeemComponent } from './components/store/store-redeem/store-redeem.component';
import { StepFriendComponent } from './components/store/store-shop/step-friend/step-friend.component';
import { OrdrPlacedComponent } from './components/store/store-shop/ordr-placed/ordr-placed.component';
import { PreloadComponent } from './placeholders/preload/preload.component';

//import { SocialSharing } from '@ionic-native/social-sharing';

import { FirebaseDynamicLinks } from '@awesome-cordova-plugins/firebase-dynamic-links/ngx';
import { BurnCatComponent } from './components/tabs/burn/burn-cat/burn-cat.component';
import { BurnBucketComponent } from './components/tabs/burn/burn-bucket/burn-bucket.component';
import { BurnProductComponent } from './components/tabs/burn/burn-product/burn-product.component';
import { BurnListComponent } from './components/tabs/burn/burn-list/burn-list.component';
import { OrdrThankComponent } from './components/store/store-shop/ordr-thank/ordr-thank.component';
import { StoreVarientComponent } from './components/store/store-shop/store-varient/store-varient.component';
import { StoreTerConComponent } from './components/store/store-shop/store-ter-con/store-ter-con.component';
import { StoreLocateComponent } from './components/store/store-shop/store-locate/store-locate.component';
import { StoreEthicComponent } from './components/store/store-shop/store-ethic/store-ethic.component';
import { UnlockRewardComponent } from './components/tabs/feed/unlock-reward/unlock-reward.component';
import { StoreThankComponent } from './components/store/store-thank/store-thank.component';
import { StoreHowWorkComponent } from './components/store/store-shop/store-how-work/store-how-work.component';


@NgModule({
  declarations: [
    AppComponent,
    TabsComponent, BottomSheetNotification,
    WelcomeComponent, BottomSheetUpdate,
    HomeComponent,
    WalletComponent,
    PayComponent,
    BurnComponent,
    DiscoverComponent,
    ProfileComponent,
    SignComponent,
    StoreComponent,
    ContentComponent,
    CropperComponent,
    AddBalanceComponent,
    FeedComponent,
    ScannerComponent, 
    StoreShareComponent,
    StoreShopComponent,
    ContactsComponent,
    StoreCartComponent, BottomSheetOTP,
    StoreActionComponent,
    StoreDoComponent,
    GetLocationComponent,
    StepPosComponent,
    StoreRedeemComponent,
    StepFriendComponent,
    OrdrPlacedComponent,
    PreloadComponent,
    BurnCatComponent,
    BurnBucketComponent,
    BurnProductComponent,
    BurnListComponent,
    OrdrThankComponent,
    StoreVarientComponent,
    StoreTerConComponent,
    StoreLocateComponent,
    StoreEthicComponent,
    UnlockRewardComponent,
    StoreThankComponent,
    StoreHowWorkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule, HttpClientJsonpModule,

    FormsModule, ReactiveFormsModule,

    MatToolbarModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatBottomSheetModule,
    MatSnackBarModule, 
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatTooltipModule, MatMenuModule,MatTabsModule,MatListModule,
    MatTableModule,MatPaginatorModule, 
    MatStepperModule, MatAutocompleteModule,MatSlideToggleModule,MatSidenavModule,
    MatDatepickerModule, MatNativeDateModule,

    MatExpansionModule,

    // 3. Initialize
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    //provideFirestore(() => getFirestore()),
    provideFirestore(() => {
      const firestore = getFirestore();
      //connectFirestoreEmulator(firestore, 'localhost', 8080);
      enableIndexedDbPersistence(firestore);
      return firestore;
    }),
    provideAuth(() => initializeAuth(getApp(), { 
      persistence: indexedDBLocalPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    })),
    provideStorage(() => getStorage()),
    provideMessaging (() => getMessaging()),
    
    //AngularFireModule.initializeApp(environment.firebase),
    //AngularFirestoreModule, // firestore
    // AngularFireAuthModule, // auth
    // AngularFireStorageModule, // storage
    // provideFirebaseApp(() => initializeApp({ ... })),
    // provideFirestore(() => getFirestore()),

    GoogleMapsModule, ImageCropperModule,
    ZXingScannerModule
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
    SocialSharing, BarcodeScanner, FirebaseDynamicLinks
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
