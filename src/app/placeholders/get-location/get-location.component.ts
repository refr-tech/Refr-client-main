/// <reference types="@types/google.maps" />
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';

import { Geolocation, Position } from '@capacitor/geolocation';

import { GoogleMap  } from '@angular/google-maps';

import { catchError, map, Observable, of } from 'rxjs';
import { ResourceService } from 'src/app/services/resource.service';
import { HttpClient } from '@angular/common/http';
import { DependencyService } from 'src/app/services/dependency.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-get-location',
  templateUrl: './get-location.component.html',
  styleUrls: ['./get-location.component.scss']
})
export class GetLocationComponent implements OnInit, AfterViewInit {

  @ViewChild('mapSearchField') searchField!: ElementRef;
  @ViewChild(GoogleMap) Gmap!: GoogleMap;
  apiLoaded$!: Observable<boolean>;
  startScan = false;

  storeLoc:any = {
    nationISO: "IND",
    stateISO: "",

    locAddress: "",
    locSearch:"",
    loc:{},
    postal_code:"",
    locality:"",
    administrative_area_level_2:"",
    administrative_area_level_1:"",
    point_of_interest:"",
  }

  options: google.maps.MapOptions = {
    disableDefaultUI: true,
    fullscreenControl: false,
    zoomControl: true
  };
  markOptions: google.maps.MarkerOptions = {
    draggable: false
  };
  initialCordinates = {
    lat: 19.0760, 
    lng: 72.8777
  };
  initialMark = {
    lat: 19.0760, 
    lng: 72.8777
  }
  storeOptions: google.maps.MarkerOptions = {
    draggable: false
  };
  storeMarks: any[] = []
  initialZoom = 11;

  indStates:any = [];

  //submitFirst = false;
  disableForm = false;
  loadPlacesAPI = false;

  constructor(
    public auth: AuthService,
    public resource: ResourceService,
    public depends: DependencyService,
    private httpClient: HttpClient,
    public bsRef: MatBottomSheetRef<GetLocationComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,  
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.indStates = this.resource.foreignMarks[this.resource.foreignMarks.findIndex((n:any) => n.iso == "IND")].states;  
    this.addSearchBox();    
    this.execute()
    }, 3000);
  }

  execute(){
    this.getCurrentPosition()
  }

  async addSearchBox(){
    this.apiLoaded$ = await this.httpClient.jsonp('https://maps.googleapis.com/maps/api/js?sensor=false&key=AIzaSyABtVV28ilpCAlbhN-tEPe_t57QGwQ5WiM&libraries=places', 'callback')
    .pipe(map(() => {
      return true;
    }),catchError(() => of(false)),);

    setTimeout(() => {
    const searchBox = new google.maps.places.SearchBox(this.searchField.nativeElement,);
    //this.Gmap.controls[google.maps.ControlPosition.TOP_CENTER].push(this.searchField.nativeElement,)
    //this.Gmap.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(this.searchField.nativeElement,)

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      console.log("PLACES", places);
      if(places?.length == 0){return;}
      const bounds = new google.maps.LatLngBounds();
      places?.forEach(place => {
        if(!place.geometry || !place.geometry.location){return;}else{
          if(place.geometry.viewport){
            this.loadPlacesAPI = true;
            bounds.union(place.geometry.viewport);
            this.inputClicked(place)
            console.log("PLACES", place.geometry.location.lat(), place.geometry.location.lng())
            //vicinity
            let latX =place.geometry.location.lat();
            let lngX =place.geometry.location.lng();
            this.storeLoc.loc = {
              latitude: latX, longitude: lngX
            }
            this.initialCordinates = {
              //center: {
                lat: latX, lng: lngX
              //},
              //zoom: 16
            }; this.initialMark = this.initialCordinates;
            this.initialZoom = 16;
            /*
            this.storeLoc.loc = {
              accuracy: locX.coords.accuracy,
              altitude: locX.coords.altitude, altitudeAccuracy: locX.coords.altitudeAccuracy,
              heading: locX.coords.heading,
              latitude: locX.coords.latitude, longitude: locX.coords.longitude,
              speed: locX.coords.speed,
              timestamp: locX.timestamp,
            }
            */
            console.log("union", place)
          }else{
            bounds.extend(place.geometry.location);
            console.log("extend")
          } 
        }
      })
      this.Gmap.fitBounds(bounds)
    })

    }, 3000)
  }

  getInfoFromApi(latitude:number, longitude:number){
    this.loadPlacesAPI = true;
    this.depends.getLocationInfo("IND", latitude, longitude).pipe().subscribe((res:any) => {
      console.log("HIT",res)
      if(!res || !res.success || !res.result || !res.result[0]){
        console.log("No Api INFO");
        this.resource.startSnackBar("Failed to Autofill data!")
        this.loadPlacesAPI = false;
      }else{
        console.log("Api Clicked!")
        //this.filteredOptions = res.result;
        this.storeLoc.locSearch = res.result[0].formatted_address
        this.inputClicked(res.result[0])

      }
    })
  }


  async getCurrentPosition() {
    this.startScan = true;

  try{
    //const permitC = await Geolocation.checkPermissions();
    //const permitR = await Geolocation.requestPermissions();
    //const permitR = await Geolocation;
    
    const locX:Position = await Geolocation.getCurrentPosition()
    console.log("Add Loc")

    if(!locX.coords.latitude || !locX.coords.longitude){
      this.startScan = false;
    }else{
      console.log("Add Loc", locX.coords.latitude, locX.coords.longitude)
      this.storeLoc.loc = {
        //accuracy: locX.coords.accuracy,
        //altitude: locX.coords.altitude, altitudeAccuracy: locX.coords.altitudeAccuracy,
        //heading: locX.coords.heading,
        latitude: locX.coords.latitude, longitude: locX.coords.longitude,
        //speed: locX.coords.speed,
        //timestamp: locX.timestamp
      }
      this.initialCordinates = {
        //center: {
          lat: this.storeLoc.loc?.latitude, 
          lng: this.storeLoc.loc?.longitude
        //},
        //zoom: 16
      };
      this.initialMark = this.initialCordinates;
      this.initialZoom = 16;
      //http://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&sensor=false
      //console.log(this.storeLoc.loc )
      this.startScan = false;
      //let key = "AIzaSyABtVV28ilpCAlbhN-tEPe_t57QGwQ5WiM";
      //const newLocation = await this.httpClient.jsonp( `http://maps.googleapis.com/maps/api/geocode/json?key=${key}&latlng=${this.storeLoc.loc?.latitude},${this.storeLoc.loc?.longitude}&sensor=false`, 'callback');
      //.pipe(map(() => true),catchError(() => of(false)),);
      this.getInfoFromApi(this.storeLoc.loc?.latitude, this.storeLoc.loc?.longitude)
    }

  }catch (error) {
    this.startScan = false;
    this.resource.startSnackBar("Please turn on your GPS location.")
  }


  }

  inputClicked(result:any){
    console.log("result", result)
    result.address_components.map((component:any) => {
      const types = component.types
      console.log("types", types)

      if (types.includes('postal_code')) {
        this.storeLoc.postal_code = component.long_name
      }

      if (types.includes('locality')) {
        this.storeLoc.locality = component.long_name
      }

      if (types.includes('administrative_area_level_2')) {
        this.storeLoc.administrative_area_level_2 = component.long_name
      }

      if (types.includes('administrative_area_level_1')) {
        this.storeLoc.administrative_area_level_1 = component.long_name;
          const stateIndex = this.indStates.find((x:any) => {
            const z = this.storeLoc.administrative_area_level_1.toLowerCase() == x.name.toLowerCase();
          console.log("state", z, this.storeLoc.administrative_area_level_1, x.name)
            return z
          })
          if(stateIndex?.isos){
            console.log("stateIndex", stateIndex)
            this.storeLoc.stateISO = stateIndex.isos;
          }
        // const state = this.indStates[
        //   this.indStates.findIndex(x => {
        //     const z = x.name.toLowerCase() == this.storeLoc.administrative_area_level_1.toLowerCase();
        //     console.log("z",z);
        //   })
        // ];
        // if(state){
        //   console.log("state",state)
        //   this.storeLoc.indStateISO = state.isos;
        // }
      }

      if (types.includes('point_of_interest')) {
        this.storeLoc.point_of_interest = component.long_name
      }

      if(types.includes('country')){
        console.log("types", types, component.long_name)
        if(component.long_name.toLowerCase() !== "india"){
          this.storeLoc.postal_code = "";
          this.storeLoc.locality = "";
          this.storeLoc.administrative_area_level_2 = "";
          this.storeLoc.administrative_area_level_1 = "";
          this.storeLoc.stateISO = "";
          this.storeLoc.point_of_interest = "";
        }
      }

    })

    this.loadPlacesAPI = false;
  }

  addMarker(event: google.maps.MapMouseEvent) {
    if(event.latLng){
      const latLon = event.latLng.toJSON();
      this.storeLoc.loc = {
        //accuracy: locX.coords.accuracy,
        //altitude: locX.coords.altitude, altitudeAccuracy: locX.coords.altitudeAccuracy,
        //heading: locX.coords.heading,
        latitude: latLon.lat, longitude: latLon.lng,
        //speed: locX.coords.speed,
        //timestamp: locX.timestamp
      }
      //this.initialZoom = 16;
      this.initialMark = latLon;
      //this.initialCordinates = latLon;
      this.getInfoFromApi( latLon.lat, latLon.lng)
      /*
      this.initialCordinates = {
        //center: {
          lat: this.storeLoc.loc?.latitude, 
          lng: this.storeLoc.loc?.longitude
        //},
        //zoom: 16
      };
      this.initialMark = this.initialCordinates;
      this.initialZoom = 16;
      */
    }
  }
  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

  locate(){
    if(!this.storeLoc.postal_code || !this.storeLoc.locality || !this.storeLoc.locSearch || !this.storeLoc.stateISO || !this.storeLoc.administrative_area_level_1 || !this.storeLoc.administrative_area_level_2){

    }else{
      this.bsRef.dismiss(this.storeLoc)
    }
  }

}
