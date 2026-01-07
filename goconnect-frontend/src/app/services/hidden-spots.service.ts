import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

export interface HiddenSpot {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  locationDescription?: string;
  locationImage?: string;
  rating?: number;
  locationAddress?: string;
}

export interface LocationRequest {
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class HiddenSpotsService {
  private baseUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  saveCurrentLocation(userId: number, latitude: number, longitude: number): Observable<string> {
    const locationData: LocationRequest = { latitude, longitude };
    return this.http.post<string>(`${this.baseUrl}/user/${userId}/location`, locationData);
  }

  saveHiddenLocation(hiddenSpot: HiddenSpot): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/hidden-spots`, hiddenSpot);
  }

  getHiddenLocationList(latitude: number, longitude: number): Observable<HiddenSpot[]> {
    return this.http.get<HiddenSpot[]>(`${this.baseUrl}/hidden-spots/${latitude}/${longitude}`);
  }

  searchHiddenSpots(query: string): Observable<HiddenSpot[]> {
    return this.http.get<HiddenSpot[]>(`${this.baseUrl}/search-hidden-spots/${encodeURIComponent(query)}`);
  }

  ///get-hidden-spots

  getAllHiddenLocationList(): Observable<HiddenSpot[]> {
    return this.http.get<HiddenSpot[]>(`${this.baseUrl}/get-hidden-spots`);
  }

  getHiddenSpotByUserId(userId: number): Observable<HiddenSpot> {
    return this.http.get<HiddenSpot>(`${this.baseUrl}/get-hidden-spots/${userId}`);
  }

  getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!isPlatformBrowser(this.platformId)) {
        reject(new Error('Geolocation not available on server'));
        return;
      }
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }

  reverseGeocode(latitude: number, longitude: number): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    return this.http.get(url);
  }

  searchLocation(query: string): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    return this.http.get(url);
  }
}