import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HiddenSpotsService, HiddenSpot } from '../../services/hidden-spots.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-hidden-spots',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './hidden-spots.component.html',
  styleUrl: './hidden-spots.component.css'
})
export class HiddenSpotsComponent implements OnInit {
  activeTab: string = 'discover';
  spots: HiddenSpot[] = [];
  newSpot: HiddenSpot = {
    name: '',
    latitude: 0,
    longitude: 0,
    locationDescription: '',
    locationImage: '',
    rating: 0,
    locationAddress: ''
  };
  selectedFiles: File[] = [];
  currentUser: any = null;
  userLocation: { latitude: number; longitude: number } | null = null;
  sidebarExpanded = false;
  searchQuery = '';

  constructor(
    private hiddenSpotsService: HiddenSpotsService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    if (isPlatformBrowser(this.platformId)) {
      this.getCurrentLocation();
      this.checkSelectedLocation();
      this.checkSidebarState();
    } else {
      this.userLocation = { latitude: 40.7128, longitude: -74.0060 };
      this.loadHiddenSpots();
    }
  }

  checkSidebarState() {
    setTimeout(() => {
      const sidebar = document.querySelector('.sidebar');
      this.sidebarExpanded = sidebar?.classList.contains('expanded') || false;
    }, 100);
  }

  checkSelectedLocation() {
    const selectedLocation = localStorage.getItem('selectedHiddenSpotLocation');
    if (selectedLocation) {
      const location = JSON.parse(selectedLocation);
      this.newSpot.latitude = location.lat;
      this.newSpot.longitude = location.lng;
      this.newSpot.locationAddress = location.name;
      localStorage.removeItem('selectedHiddenSpotLocation');
    }
    
    // Restore form data and active tab
    const formData = localStorage.getItem('hiddenSpotFormData');
    if (formData) {
      const data = JSON.parse(formData);
      this.newSpot.name = data.name || '';
      this.newSpot.locationDescription = data.locationDescription || '';
      this.newSpot.rating = data.rating || 0;
      this.activeTab = data.activeTab || 'discover';
      localStorage.removeItem('hiddenSpotFormData');
    }
  }

  openMapSelector() {
    // Save current form data and active tab before navigating
    localStorage.setItem('hiddenSpotFormData', JSON.stringify({
      name: this.newSpot.name,
      locationDescription: this.newSpot.locationDescription,
      rating: this.newSpot.rating,
      activeTab: this.activeTab,
      selectedFiles: this.selectedFiles.map(f => ({ name: f.name, size: f.size }))
    }));
    this.router.navigate(['/map-selector']);
  }

  getCurrentLocation() {
    console.log('Getting current location for hidden spots...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location received for hidden spots:', position.coords);
          this.userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          
          if (this.currentUser?.id) {
            this.hiddenSpotsService.saveCurrentLocation(
              this.currentUser.id,
              this.userLocation.latitude,
              this.userLocation.longitude
            ).subscribe();
          }
          
          this.loadHiddenSpots();
        },
        (error) => {
          console.error('Location access denied or failed:', error);
          this.userLocation = { latitude: 12.9716, longitude: 77.5946 };
          this.loadHiddenSpots();
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0  // Always request fresh location
        }
      );
    } else {
      console.log('Geolocation not supported for hidden spots');
      this.userLocation = { latitude: 12.9716, longitude: 77.5946 };
      this.loadHiddenSpots();
    }
  }

  loadHiddenSpots() {
    if (this.userLocation) {
      this.hiddenSpotsService.getAllHiddenLocationList().subscribe({
        next: (spots) => {
          this.spots = spots;
        },
        error: (error) => {
          console.error('Error loading spots:', error);
          // Load sample data if server is not available
          this.spots = [
            {
              name: 'Mystic Waterfall',
              latitude: 40.7589,
              longitude: -73.9851,
              locationDescription: 'A secluded waterfall perfect for peaceful meditation and photography.',
              locationAddress: 'Central Park, New York',
              rating: 4.8
            }
          ];
        }
      });
    }
  }

  resetForm() {
    this.newSpot = {
      name: '',
      latitude: 0,
      longitude: 0,
      locationDescription: '',
      locationImage: '',
      rating: 0,
      locationAddress: ''
    };
    this.selectedFiles = [];
  }

  onFileSelect(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.selectedFiles = [...this.selectedFiles, ...files];
  }

  removeFile(fileToRemove: File) {
    this.selectedFiles = this.selectedFiles.filter(file => file !== fileToRemove);
  }

  viewSpotOnMap(spot: HiddenSpot) {
    // Get current user ID
    const currentUserId = this.currentUser?.id;
    
    if (currentUserId) {
      // Call API to get hidden spot details by user ID
      this.hiddenSpotsService.getHiddenSpotByUserId(spot.id || 0).subscribe({
        next: (spotDetails) => {
          // Use the spot data from the list but get additional details from API if needed
          const spotToView = {
            ...spot,
            ...spotDetails // Merge any additional details from API
          };
          
          localStorage.setItem('viewHiddenSpot', JSON.stringify(spotToView));
          this.router.navigate(['/map-selector']);
        },
        error: (error) => {
          console.error('Error fetching spot details:', error);
          // Fallback to using the spot data from the list
          localStorage.setItem('viewHiddenSpot', JSON.stringify(spot));
          this.router.navigate(['/map-selector']);
        }
      });
    } else {
      // If no user ID, use the spot data from the list
      localStorage.setItem('viewHiddenSpot', JSON.stringify(spot));
      this.router.navigate(['/map-selector']);
    }
  }

  searchSpots() {
    if (this.searchQuery.trim()) {
      this.hiddenSpotsService.searchHiddenSpots(this.searchQuery).subscribe({
        next: (spots) => {
          this.spots = spots;
        },
        error: (error) => {
          console.error('Search failed:', error);
        }
      });
    } else {
      this.loadHiddenSpots();
    }
  }

  saveHiddenSpot() {
    if (this.newSpot.name && this.newSpot.latitude && this.newSpot.longitude) {
      console.log('Saving hidden spot:', this.newSpot);
      
      this.hiddenSpotsService.saveHiddenLocation(this.newSpot).subscribe({
        next: (result) => {
          console.log('Hidden spot saved successfully:', result);
          alert('Hidden spot saved successfully!');
          this.loadHiddenSpots();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error saving spot:', error);
          alert('Error saving spot. Please check if the GoConnect server is running on port 8080.');
        }
      });
    } else {
      alert('Please fill in all required fields: Spot Name and Location');
    }
  }
}