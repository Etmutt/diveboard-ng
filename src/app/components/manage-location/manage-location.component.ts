import * as L from "leaflet";
import { GeolocService } from "../../_services/geoloc.service";
import { SearchService } from "../../_services/search.service";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormBuilder,
  FormGroup,
  FormControl,
  NG_VALIDATORS,
} from "@angular/forms";
import {
  map,
  startWith,
  filter,
  tap,
  switchMap,
  debounceTime,
  finalize,
} from "rxjs/operators";

import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from "@angular/material/autocomplete";
import { Subscription, Observable } from "rxjs";
import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  forwardRef,
  OnDestroy,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { isUndefined, isObject } from "util";
import { Spot, SpotAdapter } from "../../_models/spot.model";
import { Overlay, OverlayConfig, OverlayRef } from "@angular/cdk/overlay";
import { TemplatePortalDirective } from "@angular/cdk/portal";
import {MatSnackBar} from '@angular/material/snack-bar';

/*-----------------
Location form field. Upon focus ; prompt a map for spot selection.
Hold value on Spot model (expected input and uptput)

> Mimics normal angular form component behavior and can be used as is in any other form
*/


//setup observable for map move
function movesubscriber(target) {
  return new Observable((observer) => {
    const handler = (e) => observer.next(e);

    // Add the event handler to the target
    target.on("moveend", handler);

    return () => {
      // Detach the event handler from the target
      target.off("moveend", handler);
    };
  });
}

@Component({
  selector: "app-manage-location",
  templateUrl: "./manage-location.component.html",
  styleUrls: ["./manage-location.component.css"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ManageLocationComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ManageLocationComponent),
      multi: true,
    },
  ],
  
})
export class ManageLocationComponent implements OnInit {

  //Form control
  form: FormGroup;
  form_init: FormGroup;
  spotCtrl = new FormControl();
  spotCtrl_init = new FormControl();
  subscriptions: Subscription[] = [];

  //Overlay handler & control
  overlayRef: OverlayRef;
  @ViewChild("mapOverlay") mapOverlay: TemplatePortalDirective;

  @ViewChild("spotInput") spotInput: ElementRef<HTMLInputElement>;

  //Map handler
  map: L.Map;

  //Arry of spot fo auto complet
  searchedSpot: Spot[];

  //Value of the current selected spot (for all component)
  current_spot: Spot;

  //markers displayed on map
  markers: { spot: Spot; marker: L.Marker }[]=[];

  //currently selected marker
  marker_selected: { spot: Spot; marker: L.Marker };
  //created marker (cannot have selected at the same time)
  marker_created: { spot: Spot; marker: L.Marker };

  //if true ; new spot routine works (add marker on click on map)
  new_spot: boolean;
  last_search :string; //use for setinng up name 

  //valid : true if the current selction is a spot ; flase if in selctionn/creation process
  valid:boolean;
  msgInvalid :string;

  @ViewChild("auto_spot") matAutocomplete: MatAutocomplete;


  // spot Icon
  icon = new L.Icon({
    iconSize: [30, 35],
    iconAnchor: [15, 35],
    shadowAnchor: [13, 41],
    iconUrl: "assets/images/flag.svg",
    shadowUrl: "leaflet/marker-shadow.png",
  });

  // selected spot Icon
  icon_selected = new L.Icon({
    iconSize: [30, 35],
    iconAnchor: [15, 35],
    shadowAnchor: [13, 41],
    iconUrl: "assets/images/flag_selected.svg",
    shadowUrl: "leaflet/marker-shadow.png",
  });

  //instance the map, try to go to current location and load markers
  init_map() {

    //init the map
    this.map = L.map('map', {
      center: [ 0, 0 ],
      zoom: 3
    });
    const tiles = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
      }
    )
    tiles.addTo(this.map)
    this.map.options.debounceMoveend = true;


    //Movment listner and markers loading
    const subscription = movesubscriber(this.map)
      .pipe(
        debounceTime(200),
        switchMap((value) =>
          this.searchService
            .searchSpot(null, this.map.getCenter().lat, this.map.getCenter().lng)
            .pipe(finalize(() => {}))
        )
      )
      .subscribe((data: [Spot]) => {
        //remove current markers
        if (this.markers) {
          this.markers.map((x) => x.marker.removeFrom(this.map));
        }
        this.markers = [];

        if (this.marker_selected) {
          this.marker_selected.marker.removeFrom(this.map);
        }

        //create array of spot ; with markers instance (disregard one wuth same id)
        data.map((x: Spot) => {
          if (
            (this.marker_selected && this.marker_selected.spot.id != x.id) ||
            isUndefined(this.marker_selected)
          ) {
            this.addMarker(x);
          }
        });

        //put selected marker back on top
        this.set_selected();
      });


    //CLick listener to new marker routine
    this.map.on("click", this.locateNewSpot.bind(this))


    //Setup value in field & map if the spot exist. Otherwise try to move to current location
    if(this.current_spot){
      //create marker
      this.set_selected(this.current_spot);
      //move to marker
      this.moveToSpot(this.current_spot);

      }else{

      //try to geo loc
      this.geolocService.getCurrentPosition().subscribe(
        (data) => {
          this.moveToSpot( new Spot("",
            data.coords.latitude,
            data.coords.longitude)
          );
  
          //add marker on location
          const position = L.circleMarker([
            data.coords.latitude,
            data.coords.longitude,
          ]);
          position.addTo(this.map);
        },
        (error) => {
          console.log("Unable to retrieve location");
        }
      );
      }

  }

  //move map to spot
  moveToSpot(spot :Spot){

    this.map.setView(new L.LatLng(spot.lat,spot.lng), 10)
  }

  //setup new spot
  locateNewSpot(event) {
    //if new spot routine is on going ; place a new selected marker
    if (this.new_spot) {
      //remove the selection
      this.set_unselected();

      //remove current new spot
      if (this.marker_created) {
        this.marker_created.marker.removeFrom(this.map);
        this.marker_created = undefined;
      }

      //add marker
      this.marker_created = {
        spot: new Spot(this.spotInput.nativeElement.value, event.latlng.lat, event.latlng.lng),
        marker: new L.Marker([event.latlng.lat, event.latlng.lng], {
          icon: this.icon_selected,
        }).addTo(this.map),
      };

      //update value
      this.spotCtrl.setValue(this.marker_created.spot)

      //check validity
      this.Isvalid();
      
    }
  }

  //add normal marker
  addMarker(spot: Spot) {
    this.markers.push({
      spot: spot,
      marker: new L.Marker([spot.lat, spot.lng], {
        icon: this.icon,
      })
        .on("click", this.selected_map.bind(this))
        .bindTooltip(spot.name)
        .openTooltip()
        .addTo(this.map),
    });
  }

  //set the selected marker on map
  set_selected(spot?: Spot) {
    if (spot || this.marker_selected) {
      //if no spot pass ; then take from current selection
      spot = spot ? spot : this.marker_selected.spot;

      //unselect current
      this.set_unselected();

      //remove created marker if any; and go out of creation routine
      this.new_spot = false;
      if (this.marker_created) {
        this.marker_created.marker.removeFrom(this.map);
        this.marker_created = undefined;
      }

      //add new marker on top and store for futur ref
      this.marker_selected = {
        spot: spot,
        marker: new L.Marker([spot.lat, spot.lng], {
          icon: this.icon_selected,
        }).addTo(this.map),
      };
    }

    this.Isvalid();
  }

  //remove selection on spot
  set_unselected() {
    //remove current selected marker and send it to general pop
    if (this.marker_selected) {
      this.marker_selected.marker.removeFrom(this.map);
      
      this.markers.push({
        spot: this.marker_selected.spot,
        marker: new L.Marker(
          [this.marker_selected.spot.lat, this.marker_selected.spot.lng],
          {
            icon: this.icon,
          }
        )
          .on("click", this.selected_map.bind(this))
          .bindTooltip(this.marker_selected.spot.name)
          .openTooltip()
          .addTo(this.map),
      });

      this.marker_selected = undefined;
    }
  }

  //find spot based on marker > return marker object or null
  linkToSpot(marker: L.Marker) {
    return this.markers.find((x) => x.marker === marker);
  }

  //launch routine
  new_spot_routine(){

    //put the name displayed in field as it was before
    this.spotInput.nativeElement.value=this.last_search;

    //change state to new spot routine
    this.new_spot = true;

    //display snake bar
    this._snackBar.open('Click on the map to place the spot', 'Close', {duration: 2000});
    
    //check validity for length
    this.Isvalid();
  }

  //selected autocomplete : move to the selected spot ; and update the selected market on map
  selected_auto(event: MatAutocompleteSelectedEvent): void {
    //filter out creation option
    
    switch (event.option.value) {
      case "new_loc":
        this.new_spot_routine();

        break;

      default:
        //navigate to the location
        this.moveToSpot(event.option.value);

        //display the marker
        this.set_selected(event.option.value);

        //save text
        this.last_search = event.option.value.name;

        break;
    }
  }

  //selected on map : change the search field value to the new spot clicked
  selected_map(e) {
    //retrieve spot and send the value to the field
    this.spotCtrl.setValue(this.linkToSpot(e.target).spot);

    //display on map
    e.target.removeFrom(this.map);
    this.set_selected(this.linkToSpot(e.target).spot);
  }

  constructor(
    private geolocService: GeolocService,
    public searchService: SearchService,
    private formBuilder: FormBuilder,
    private overlay: Overlay,
    private _snackBar: MatSnackBar
  ) {

    //instance the forms
    this.form = this.formBuilder.group({ spotCtrl: "" });
    this.form_init = this.formBuilder.group({ spotCtrl_init: "" });

  }

  //launch autocomplete
  ngOnInit() {

  //launch the autocomplete
  this.spotCtrl.valueChanges
    .pipe(
      //do not look into the value if it is spot
      filter((value) => !(value instanceof Spot)),

      //if creation routine is on & selection marker exist ; update name in created marker
      tap((value)=> {
        if(this.new_spot && this.marker_created){
          this.marker_created.spot.name=value;
          this.spotCtrl.setValue(this.marker_created.spot);
        }
      }),

      //unselect the spot on map (if any) & check current validity
      tap((value)=>{
        if(!(value instanceof Spot)){
          this.set_unselected();
        }

        this.Isvalid();
      }),

      /////prepare for api call (autocomplete)///
      debounceTime(200),
      //if the value is null > no call to API & reset values searched
      tap((value) => {
        if (!(!isUndefined(value) && value !== null && value.length > 0)) {
          this.searchedSpot = [];
        }
      }),

      filter((value) => value && value !== null && value.length > 0),

      //store the last value search ; used for setting the name of the new spot during new spot routine
      tap((value) => {
        
        this.last_search=(value=="new_loc")?this.last_search:value;}),

      switchMap((value) =>
        this.searchService.searchSpot(value).pipe(finalize(() => {}))
      )
    )
    .subscribe((data) => {
      this.searchedSpot = data.slice(1, 10);
    });

  }

  //display for spot object on autocomplet selection
  fonctionAffichage(option): string {
    return option ? option.name : option;
  }

  //check validity (selected spot or new spot)
  Isvalid(){
   
    //check if existing spot is selected or if the current valu is null
    if ((this.spotCtrl.value instanceof Spot) ||(this.spotCtrl.value==null)||(this.spotCtrl.value=="")){
      
      //if it is a new spot ; make sure the name is long enougth
      if(this.new_spot && this.spotInput.nativeElement.value.length<5){
        this.valid=false;
        this.msgInvalid= "Spot name must be at least 5 caracters long";
        return false;
      }else{  
        this.msgInvalid= "";
        this.valid=true;
        return true;
      }
    }
    else{
      this.valid=false;
      this.msgInvalid= "";
      return false;
    }
  }

  //open overlay
  public open_overlay() {
    //make sure the overlay is not already open
    if(!this.overlayRef){

    //init state variable
    //put the last value searched to null
    this.last_search=null;
    //go to mormal selction
    this.new_spot=false;
    this.marker_selected=undefined;
    this.marker_created=undefined;
    this.spotCtrl.setValue(this.current_spot);

    // overlay opening
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      positionStrategy,
      maxWidth : '100%',
      maxHeight : '100%',
      height: '60em',
      width :'50em',

    });

    overlayConfig.hasBackdrop = true;

    this.overlayRef = this.overlay.create(overlayConfig);

    this.overlayRef.backdropClick().subscribe(() => {
      this.closeOverlay();
    });

    this.overlayRef.attach(this.mapOverlay);

    //init the map
    this.init_map();

    //init the validity
    this.Isvalid();
  }
  }

  closeOverlay() {
    this.map.remove();
    this.overlayRef.dispose();
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.overlayRef=undefined;
  }

  //store the spot 
  valid_spot(){
    this.writeValue(this.spotCtrl.value)
    this.closeOverlay();
  }

/////////function to emulate angular form component //////////
  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  get value(): Spot {
    
    return this.current_spot;
  }

  set value(value : Spot) {
     this.current_spot = value;
      this.spotCtrl.setValue(this.current_spot);
      this.spotCtrl_init.setValue( this.fonctionAffichage(this.current_spot));
    
    this.onChange(value);
    this.onTouched();
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  writeValue(value: Spot) {
    console.log(value);
    if (value) {
      console.log('if 1');
      this.value=value;
      this.current_spot = value;
      this.spotCtrl.setValue(this.current_spot);
      this.spotCtrl_init.setValue( this.fonctionAffichage(this.current_spot));
    
    }

    if (value == null || value == "") {
      console.log('if 2');
      this.value=undefined;
      this.current_spot = undefined;
      this.spotCtrl.setValue(this.current_spot);
      this.spotCtrl_init.setValue( this.fonctionAffichage(this.current_spot));
    
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.form.valid ? null : { profile: { valid: false } };
  }
}
