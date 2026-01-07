import { Component, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-map-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.css']
})
export class MapSelectorComponent implements AfterViewInit {

  @ViewChild('map', { static: true }) mapElement!: ElementRef;
  selectedLocation = { lat: 12.9716, lng: 77.5946, name: 'Bangalore, Karnataka' };
  private map: any;
  private marker: any;
  private currentLocationMarker: any;
  private routeControl: any;
  private locationRetryTimeout: any;
  private retryAttempts = 0;
  private retryIntervals = [60000, 180000, 360000]; // 1min, 3min, 6min
  searchQuery = '';
  isViewingSpot = false;
  currentLocation: { lat: number, lng: number } | null = null;
  currentLocationName = 'Bangalore, Karnataka';
  distance = 0;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkViewSpot();
      this.loadSavedLocation();
      this.requestCurrentLocation();
    }
  }

  private loadSavedLocation(): void {
    const saved = localStorage.getItem('userCurrentLocation');
    if (saved) {
      this.currentLocation = JSON.parse(saved);
      this.getCurrentLocationName();
      console.log('Loaded saved location:', this.currentLocation);
      
      // Use saved location as default for selectedLocation if not viewing a spot
      if (!this.isViewingSpot && this.currentLocation) {
        this.selectedLocation = {
          lat: this.currentLocation.lat,
          lng: this.currentLocation.lng,
          name: this.currentLocationName
        };
      }
    } else {
      this.currentLocation = { lat: 12.9716, lng: 77.5946 };
      this.currentLocationName = 'Bangalore, Karnataka';
    }
  }

  private saveCurrentLocation(): void {
    if (this.currentLocation) {
      localStorage.setItem('userCurrentLocation', JSON.stringify(this.currentLocation));
      console.log('Saved current location to localStorage');
    }
  }

  private scheduleLocationRetry(): void {
    if (this.retryAttempts < this.retryIntervals.length) {
      const delay = this.retryIntervals[this.retryAttempts];
      console.log(`Scheduling location retry in ${delay/1000} seconds`);
      
      this.locationRetryTimeout = setTimeout(() => {
        this.retryAttempts++;
        this.requestCurrentLocation();
      }, delay);
    }
  }

  private requestCurrentLocation(): void {
    console.log('Requesting current location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log('Location received:', position.coords);
          this.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.saveCurrentLocation();
          this.retryAttempts = 0;
          if (this.locationRetryTimeout) {
            clearTimeout(this.locationRetryTimeout);
          }
          
          await this.getCurrentLocationName();
          if (this.isViewingSpot) {
            this.calculateDistance();
            if (this.map) {
              this.addCurrentLocationMarker();
              this.addRoute();
            }
          } else if (this.map) {
            this.selectedLocation = {
              lat: this.currentLocation.lat,
              lng: this.currentLocation.lng,
              name: this.currentLocationName
            };
            this.map.setView([this.currentLocation.lat, this.currentLocation.lng], 13);
            this.addMarker(this.currentLocation.lat, this.currentLocation.lng);
          }
        },
        (error) => {
          console.error('Location access denied or failed:', error);
          
          if (error.code === 1) { // PERMISSION_DENIED
            if (error.message.includes('ignored') || error.message.includes('blocked')) {
              console.log('Location permission blocked by browser');
              if (this.locationRetryTimeout) {
                clearTimeout(this.locationRetryTimeout);
              }
            } else {
              this.scheduleLocationRetry();
            }
          } else {
            this.scheduleLocationRetry();
          }
          
          // Only set Bangalore as fallback if no saved location exists
          if (!this.currentLocation) {
            this.currentLocation = { lat: 12.9716, lng: 77.5946 };
            this.currentLocationName = 'Bangalore, Karnataka';
            
            if (this.isViewingSpot) {
              this.calculateDistance();
              if (this.map) {
                this.addCurrentLocationMarker();
                this.addRoute();
              }
            } else if (this.map) {
              this.selectedLocation = {
                lat: this.currentLocation.lat,
                lng: this.currentLocation.lng,
                name: 'Bangalore, Karnataka'
              };
              this.map.setView([this.currentLocation.lat, this.currentLocation.lng], 13);
              this.addMarker(this.currentLocation.lat, this.currentLocation.lng);
            }
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      console.log('Geolocation not supported');
      if (!this.currentLocation) {
        this.currentLocation = { lat: 12.9716, lng: 77.5946 };
        this.currentLocationName = 'Bangalore, Karnataka';
      }
    }
  }

  private checkViewSpot(): void {
    const viewSpot = localStorage.getItem('viewHiddenSpot');
    if (viewSpot) {
      const spot = JSON.parse(viewSpot);
      this.selectedLocation = {
        lat: spot.latitude,
        lng: spot.longitude,
        name: spot.name
      };
      this.isViewingSpot = true;
      localStorage.removeItem('viewHiddenSpot');
    }
  }

  private getCurrentLocation(): void {
    this.requestCurrentLocation();
  }

  private async getCurrentLocationName(): Promise<void> {
    if (this.currentLocation) {
      try {
        // Try multiple geocoding services for better accuracy
        let locationName = await this.tryGeocoding(this.currentLocation.lat, this.currentLocation.lng);
        this.currentLocationName = locationName || `${this.currentLocation.lat.toFixed(4)}, ${this.currentLocation.lng.toFixed(4)}`;
      } catch (error) {
        this.currentLocationName = `${this.currentLocation.lat.toFixed(4)}, ${this.currentLocation.lng.toFixed(4)}`;
      }
    }
  }

  private async tryGeocoding(lat: number, lng: number): Promise<string | null> {
    console.log(`Geocoding coordinates: ${lat}, ${lng}`);
    
    // Try Nominatim with different zoom levels for better accuracy
    try {
      // First try with zoom 16 for more precise results
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1&extratags=1`);
      const result = await response.json();
      
      console.log('Nominatim response:', result);
      
      if (result.display_name) {
        console.log('Full location name:', result.display_name);
        return result.display_name;
      }
    } catch (error) {
      console.log('Nominatim zoom 16 failed:', error);
    }

    // Try with zoom 14 for broader area if zoom 16 fails
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`);
      const result = await response.json();
      
      console.log('Nominatim zoom 14 response:', result);
      
      if (result.display_name) {
        console.log('Zoom 14 location name:', result.display_name);
        return result.display_name;
      }
    } catch (error) {
      console.log('Nominatim zoom 14 failed:', error);
    }

    // Fallback to BigDataCloud with more detailed request
    try {
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en&key=bdc_c4f1c4c4c4c4c4c4c4c4c4c4c4c4c4c4`);
      const result = await response.json();
      console.log('BigDataCloud response:', result);
      
      if (result.localityInfo && result.localityInfo.administrative) {
        // Use administrative hierarchy for better accuracy
        const adminLevels = result.localityInfo.administrative;
        const locationParts = adminLevels.map((level: any) => level.name).filter(Boolean);
        
        if (locationParts.length > 0) {
          const fullAddress = locationParts.join(', ');
          console.log('BigDataCloud admin address:', fullAddress);
          return fullAddress;
        }
      }
      
      // Fallback to basic BigDataCloud fields
      const addressParts = [
        result.locality,
        result.city,
        result.principalSubdivision,
        result.countryName
      ].filter(Boolean);
      
      const fullAddress = addressParts.join(', ');
      console.log('BigDataCloud basic address:', fullAddress);
      return fullAddress || null;
    } catch (error) {
      console.log('BigDataCloud failed:', error);
      return null;
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const L = await import('leaflet');
      
      this.map = L.map(this.mapElement.nativeElement, {
        center: [this.selectedLocation.lat, this.selectedLocation.lng],
        zoom: 13
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(this.map);

      // Add marker for viewed spot
      this.addMarker(this.selectedLocation.lat, this.selectedLocation.lng);

      // Request location again after map is initialized
      if (this.isViewingSpot) {
        this.requestCurrentLocation();
      }

      this.map.on('click', (e: any) => {
        if (!this.isViewingSpot) {
          console.log('Location clicked:', {
            latitude: e.latlng.lat,
            longitude: e.latlng.lng
          });
          this.updateSelectedLocation(e.latlng.lat, e.latlng.lng);
          this.addMarker(e.latlng.lat, e.latlng.lng);
        }
      });
    }
  }

  async searchLocation(): Promise<void> {
    if (!this.searchQuery.trim()) return;
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.searchQuery)}&limit=1`, {
        headers: {
          'User-Agent': 'GoConnect/1.0'
        }
      });
      const results = await response.json();
      
      if (results.length > 0) {
        const result = results[0];
        this.selectedLocation = {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          name: result.display_name
        };
        
        if (this.map) {
          this.map.setView([this.selectedLocation.lat, this.selectedLocation.lng], 13);
          this.addMarker(this.selectedLocation.lat, this.selectedLocation.lng);
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  }

  private async updateSelectedLocation(lat: number, lng: number): Promise<void> {
    try {
      const locationName = await this.tryGeocoding(lat, lng);
      
      this.selectedLocation = {
        lat: lat,
        lng: lng,
        name: locationName || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      };
    } catch (error) {
      this.selectedLocation = {
        lat: lat,
        lng: lng,
        name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      };
    }
  }

  confirmLocation(): void {
    localStorage.setItem('selectedHiddenSpotLocation', JSON.stringify(this.selectedLocation));
    this.router.navigate(['/hidden-spots']);
  }

  cancel(): void {
    if (this.locationRetryTimeout) {
      clearTimeout(this.locationRetryTimeout);
    }
    this.router.navigate(['/hidden-spots']);
  }

  private async addMarker(lat: number, lng: number): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const L = await import('leaflet');
      
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      
      const customIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      
      this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
    }
  }



  private async addCurrentLocationMarker(): Promise<void> {
    if (isPlatformBrowser(this.platformId) && this.currentLocation) {
      const L = await import('leaflet');
      
      const currentIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      
      this.currentLocationMarker = L.marker([this.currentLocation.lat, this.currentLocation.lng], { icon: currentIcon })
        .addTo(this.map)
        .bindPopup('Your Location');
    }
  }

  private async addRoute(): Promise<void> {
    if (isPlatformBrowser(this.platformId) && this.currentLocation) {
      try {
        const routeData = await this.getRouteFromAPI();
        if (routeData) {
          const L = await import('leaflet');
          
          const polyline = L.polyline(routeData.coordinates, {
            color: '#667eea',
            weight: 4,
            opacity: 0.8
          }).addTo(this.map);
          
          // Update distance with road distance
          this.distance = routeData.distance;
          
          // Fit map to show both markers and route
          const group = L.featureGroup([this.marker, this.currentLocationMarker, polyline]);
          this.map.fitBounds(group.getBounds().pad(0.1));
        }
      } catch (error) {
        console.error('Route API failed, using straight line:', error);
        this.addStraightLineRoute();
      }
    }
  }

  private async getRouteFromAPI(): Promise<{coordinates: [number, number][], distance: number} | null> {
    if (!this.currentLocation) return null;
    
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${this.currentLocation.lng},${this.currentLocation.lat};${this.selectedLocation.lng},${this.selectedLocation.lat}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as [number, number]);
        const distance = route.distance / 1000; // Convert to kilometers
        
        return { coordinates, distance };
      }
    } catch (error) {
      console.error('OSRM API error:', error);
    }
    
    return null;
  }

  private async addStraightLineRoute(): Promise<void> {
    // Disabled straight line route for hidden spots viewing
    if (isPlatformBrowser(this.platformId) && this.currentLocation) {
      const L = await import('leaflet');
      
      // Only fit bounds to show both markers without route line
      const group = L.featureGroup([this.marker, this.currentLocationMarker]);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  private calculateDistance(): void {
    // Distance will be updated by road routing API
    // Fallback to straight-line distance if API fails
    if (this.currentLocation && this.distance === 0) {
      const R = 6371;
      const dLat = this.toRadians(this.selectedLocation.lat - this.currentLocation.lat);
      const dLng = this.toRadians(this.selectedLocation.lng - this.currentLocation.lng);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.toRadians(this.currentLocation.lat)) * Math.cos(this.toRadians(this.selectedLocation.lat)) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      this.distance = R * c;
    }
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
