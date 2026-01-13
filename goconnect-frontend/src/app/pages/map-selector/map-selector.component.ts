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
  private watchId: number | null = null; // For live tracking
  private retryAttempts = 0;
  private retryIntervals = [60000, 180000, 360000]; // 1min, 3min, 6min
  searchQuery = '';
  isViewingSpot = false;
  isLiveTracking = false; // Toggle for live tracking
  isJourneyStarted = false; // Track if journey has started
  currentLocation: { lat: number, lng: number } | null = null;
  currentLocationName = 'Bangalore, Karnataka';
  distance = 0;
  locationStatusMessage: string | null = null;

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

  private async loadSavedLocation(): Promise<void> {
    const saved = localStorage.getItem('userCurrentLocation');
    if (saved) {
      this.currentLocation = JSON.parse(saved);
      console.log('Loaded saved location:', this.currentLocation);

      // Always fetch the location name if we have a current location
      if (this.currentLocation) {
        await this.getCurrentLocationName();
      }

      // Use saved location as default for selectedLocation if not viewing a spot
      if (!this.isViewingSpot && this.currentLocation) {
        this.selectedLocation = {
          lat: this.currentLocation.lat,
          lng: this.currentLocation.lng,
          name: this.currentLocationName
        };

        // If map is already initialized, center it
        if (this.map) {
          this.map.setView([this.currentLocation.lat, this.currentLocation.lng], 13);
          this.addMarker(this.currentLocation.lat, this.currentLocation.lng);
        }
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
    if (this.isLiveTracking) {
      if (this.watchId !== null) {
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = null;
      }
      console.log('Live tracking error. Retrying in 10 seconds...');
      this.locationStatusMessage = 'Signal lost. Retrying...';
      setTimeout(() => {
        this.locationStatusMessage = null;
        if (this.isJourneyStarted) { // check if user cancelled the journey
          this.requestCurrentLocation();
        }
      }, 10000);
      return;
    }

  }
  private requestCurrentLocation(): void {
    console.log('Requesting current location...');
    if (navigator.geolocation) {
      if (this.isLiveTracking) {
        // Use watchPosition for live tracking
        this.watchId = navigator.geolocation.watchPosition(
          async (position) => {
            await this.handleLocationUpdate(position);
          },
          (error) => {
            this.handleLocationError(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 0 // Don't use a cached position
          }
        );
      } else {
        // Use getCurrentPosition for one-time location
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            await this.handleLocationUpdate(position);
          },
          (error) => {
            this.handleLocationError(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 0
          }
        );
      }
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

  // Start/End journey tracking
  toggleJourney(): void {
    this.isJourneyStarted = !this.isJourneyStarted;

    if (this.isJourneyStarted) {
      console.log('Starting journey...');
      this.isLiveTracking = true;
      this.requestCurrentLocation();
    } else {
      console.log('Ending journey...');
      this.isLiveTracking = false;
      if (this.watchId !== null) {
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = null;
      }
    }
  }

  private async handleLocationUpdate(position: GeolocationPosition): Promise<void> {
    this.locationStatusMessage = null;
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
        this.updateCurrentLocationMarker();
        this.updateRoute();
        if (this.isLiveTracking) {
          this.map.setView([this.currentLocation.lat, this.currentLocation.lng], this.map.getZoom());
        }
      }
    } else if (this.map) {
      this.selectedLocation = {
        lat: this.currentLocation.lat,
        lng: this.currentLocation.lng,
        name: this.currentLocationName
      };
      this.addMarker(this.currentLocation.lat, this.currentLocation.lng);

      if (this.isLiveTracking) {
        this.map.panTo([this.currentLocation.lat, this.currentLocation.lng]);
      } else {
        this.map.setView([this.currentLocation.lat, this.currentLocation.lng], 13);
      }
    }
  }

  private handleLocationError(error: GeolocationPositionError): void {
    console.error('Location access denied or failed:', error);

    if (error.code === 1) { // PERMISSION_DENIED
      console.log('Location permission was denied. Stopping tracking.');
      if (this.watchId !== null) {
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = null;
      }
      this.isLiveTracking = false;
      this.isJourneyStarted = false;
      // Also clear any scheduled retries
      if (this.locationRetryTimeout) {
        clearTimeout(this.locationRetryTimeout);
      }
    } else { // For other errors (TIMEOUT, etc.), schedule a retry.
      this.scheduleLocationRetry();
    }

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
          name: this.currentLocationName
        };
        this.map.setView([this.currentLocation.lat, this.currentLocation.lng], 13);
        this.addMarker(this.currentLocation.lat, this.currentLocation.lng);
      }
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

    try {
      // PROXY: Call our Spring Boot backend to avoid CORS/403 errors
      const response = await fetch(`http://localhost:8080/geocode/reverse?lat=${lat}&lon=${lng}`);
      const result = await response.json();

      console.log('Nominatim response (via Proxy):', result);

      if (result.address) {
        const addr = result.address;

        // 1. Look for specific visible place names (POI)
        const specificLocation =
          addr.tourism ||
          addr.amenity ||
          addr.leisure ||
          addr.historic ||
          addr.building ||
          addr.shop ||
          addr.man_made;

        const smallLocality =
          addr.hamlet ||
          addr.village ||
          addr.suburb ||
          addr.neighbourhood;

        // Construct parts with priority
        const addressParts = [
          specificLocation,
          smallLocality,
          addr.road,
          addr.town,
          addr.city_district,
          addr.city,
          addr.state,
          addr.country
        ].filter(Boolean);

        // Remove duplicates and join
        const uniqueParts = addressParts.filter((part, index, self) => self.indexOf(part) === index);

        if (uniqueParts.length > 0) {
          const detailedAddress = uniqueParts.join(', ');
          console.log('Detailed address:', detailedAddress);
          return detailedAddress;
        }
      }

      if (result.display_name) {
        return result.display_name;
      }
    } catch (error) {
      console.log('Nominatim proxy failed:', error);
    }

    // Fallback to BigDataCloud for additional details
    try {
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
      const result = await response.json();
      console.log('BigDataCloud response:', result);

      // Use localityInfo.administrative and map names from bottom to top
      if (result.localityInfo && result.localityInfo.administrative) {
        const adminLevels = result.localityInfo.administrative;
        // Reverse the array to get from most specific (bottom) to least specific (top)
        const locationNames = adminLevels.reverse().map((level: any) => level.name).filter(Boolean);

        if (locationNames.length > 0) {
          const detailedAddress = locationNames.join(', ');
          console.log('BigDataCloud detailed address:', detailedAddress);
          return detailedAddress;
        }
      }

      // Fallback to basic fields if administrative data not available
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

      // Request location and setup tracking for viewing spots
      if (this.isViewingSpot) {
        this.requestCurrentLocation();
        // Calculate initial distance if current location is available
        if (this.currentLocation) {
          this.calculateDistance();
          this.addCurrentLocationMarker();
          this.addRoute();
        }
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
    // Check if this is for forum or hidden spot
    const forumFormData = localStorage.getItem('forumFormData');
    if (forumFormData) {
      localStorage.setItem('selectedForumLocation', JSON.stringify(this.selectedLocation));
      this.router.navigate(['/forum']);
    } else {
      localStorage.setItem('selectedHiddenSpotLocation', JSON.stringify(this.selectedLocation));
      this.router.navigate(['/hidden-spots']);
    }
  }

  cancel(): void {
    if (this.locationRetryTimeout) {
      clearTimeout(this.locationRetryTimeout);
    }
    // Check if this is for forum or hidden spot
    const forumFormData = localStorage.getItem('forumFormData');
    if (forumFormData) {
      this.router.navigate(['/forum']);
    } else {
      this.router.navigate(['/hidden-spots']);
    }
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

  private async updateCurrentLocationMarker(): Promise<void> {
    if (isPlatformBrowser(this.platformId) && this.currentLocation) {
      if (this.currentLocationMarker) {
        // Update existing marker position
        this.currentLocationMarker.setLatLng([this.currentLocation.lat, this.currentLocation.lng]);
      } else {
        // Create marker if it doesn't exist
        await this.addCurrentLocationMarker();
      }
    }
  }

  private async updateRoute(): Promise<void> {
    if (this.routeControl) {
      this.map.removeLayer(this.routeControl);
    }
    await this.addRoute();
  }

  private async addRoute(): Promise<void> {
    if (isPlatformBrowser(this.platformId) && this.currentLocation) {
      try {
        const routeData = await this.getRouteFromAPI();
        if (routeData) {
          const L = await import('leaflet');

          this.routeControl = L.polyline(routeData.coordinates, {
            color: '#667eea',
            weight: 4,
            opacity: 0.8
          }).addTo(this.map);

          this.distance = routeData.distance;

          if (!this.isLiveTracking) {
            const group = L.featureGroup([this.marker, this.currentLocationMarker, this.routeControl]);
            this.map.fitBounds(group.getBounds().pad(0.1));
          }
        }
      } catch (error) {
        console.error('Route API failed, using straight line:', error);
        this.addStraightLineRoute();
      }
    }
  }

  private async getRouteFromAPI(): Promise<{ coordinates: [number, number][], distance: number } | null> {
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
    if (this.currentLocation) {
      const R = 6371; // Earth's radius in kilometers
      const dLat = this.toRadians(this.selectedLocation.lat - this.currentLocation.lat);
      const dLng = this.toRadians(this.selectedLocation.lng - this.currentLocation.lng);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRadians(this.currentLocation.lat)) * Math.cos(this.toRadians(this.selectedLocation.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      this.distance = R * c;
      console.log('Calculated distance:', this.distance, 'km');
    }
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
