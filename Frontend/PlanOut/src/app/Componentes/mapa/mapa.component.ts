import { Component, NgModule, ViewChild, ElementRef, Input, NgZone, EventEmitter, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { GoogleMap, MapGeocoder, MapDirectionsService } from '@angular/google-maps';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GoogleMapsModule } from '@angular/google-maps'
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


interface PlaceSearchResult {
  address: string;
  location?: google.maps.LatLng;
  imageUrl?: string;
  iconUrl?: string;
  name?: string;
}

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, FormsModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent {
  @ViewChild('intOrigin')
  intOrigin!: ElementRef;

  @ViewChild('intDest')
  intDest!: ElementRef;

  @Output() placeChangedOrigin = new EventEmitter<PlaceSearchResult>();
  @Output() placeChangedDest = new EventEmitter<PlaceSearchResult>();

  private geocoder: MapGeocoder
  originAuto: google.maps.places.Autocomplete | undefined;
  destAuto: google.maps.places.Autocomplete | undefined;

  origen = ""
  destino = ""
  display: any;
  center: google.maps.LatLngLiteral = {
    lat: 4.645926,
    lng: -74.077604
  };
  zoom = 11;

  markerPositions: google.maps.LatLngLiteral[] = [];
  markerOptions: google.maps.MarkerOptions = { draggable: false };

  originPos: PlaceSearchResult = {address: ""}
  destPos: PlaceSearchResult = {address: ""}

  directionsResults$: Observable<google.maps.DirectionsResult|undefined>

  timeDistance: string 
  distanceTime: string 

  mapDirectionsService: MapDirectionsService

  constructor(
    geocoder: MapGeocoder, private ngZone: NgZone, mapDirectionsService: MapDirectionsService) {
    this.geocoder = geocoder
    this.mapDirectionsService = mapDirectionsService
    this.timeDistance = ""
    this.distanceTime = ""
    this.directionsResults$ = new Observable as Observable<undefined>
  }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center.lat = position.coords.latitude
        this.center.lng = position.coords.longitude
        this.markerPositions.push({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }

    this.placeChangedOrigin.subscribe({
      next: (value:PlaceSearchResult) => {
        this.originPos = value
      },
      error: (err:any) => console.log(err)
    })

    this.placeChangedDest.subscribe({
      next: (value:PlaceSearchResult) => {
        this.destPos = value
      },
      error: (err:any) => console.log(err)
    })
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }
  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  ngAfterViewInit() {
    this.originAuto = new google.maps.places.Autocomplete(
      this.intOrigin.nativeElement
    );

    this.originAuto.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = this.originAuto?.getPlace();
        const result: PlaceSearchResult = {
          address: this.intOrigin.nativeElement.value,
          name: place?.name,
          location: place?.geometry?.location,
          iconUrl: place?.icon,
        };

        this.placeChangedOrigin.emit(result);
      });
    });

    this.destAuto = new google.maps.places.Autocomplete(
      this.intDest.nativeElement
    );

    this.destAuto.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = this.destAuto?.getPlace();
        const result: PlaceSearchResult = {
          address: this.intOrigin.nativeElement.value,
          name: place?.name,
          location: place?.geometry?.location,
          iconUrl: place?.icon,
        };

        this.placeChangedDest.emit(result);
      });
    });
  }

  OnSubmit() {    
    if (this.destPos.location && this.originPos.location) {
      
      const request: google.maps.DirectionsRequest = {
        origin: {
          lat: Number(this.originPos.location?.lat()),
          lng: Number(this.originPos.location?.lng()),
        },
        destination: {
          lat: Number(this.destPos.location?.lat()),
          lng: Number(this.destPos.location?.lng())
        },
        travelMode: google.maps.TravelMode.DRIVING
      };
      this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map(response => {        
        this.timeDistance = response.result?.routes[0].legs[0].duration?.text as string
        this.distanceTime = response.result?.routes[0].legs[0].distance?.text as string
        return response.result
      }));
    }
  }
}