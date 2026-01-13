import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ForumService, ForumRequest, ForumResponse } from '../../services/forum.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css'
})
export class ForumComponent implements OnInit {
  currentUser: any = null;
  sliderPosition = 0;


  // Forum data
  forums: ForumResponse[] = [];
  userForums: ForumResponse[] = [];
  selectedForum: ForumResponse | null = null;

  // UI state
  activeTab: 'all' | 'my-forums' | 'create' | 'search' = 'all';
  loading = false;
  error: string | null = null;

  // Create forum form
  newForum: any = {
    name: '',
    registerId: 0,
    visibility: 'public',
    hashtag: '',
    comments: '',
    location: '',
    description: '',
    photos: '',
    pinLocation: '', // New field for pin location
    pinLatitude: undefined, // Pin coordinates
    pinLongitude: undefined
  };

  // Search filters
  searchFilters = {
    location: '',
    hashtag: '',
    forumId: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private forumService: ForumService
  ) { }

  ngOnInit() {
    // Subscribe to current user changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      const userId = this.authService.getCurrentUserId();
      if (userId) {
        this.newForum.registerId = userId;
      }
    });

    // Check if returning from map selector for forum creation
    if (typeof localStorage !== 'undefined') {
      const forumFormData = localStorage.getItem('forumFormData');
      const selectedLocation = localStorage.getItem('selectedForumLocation');
      if (forumFormData || selectedLocation) {
        this.activeTab = 'create';
      }
    }

    // Check for selected location from map
    this.checkSelectedLocation();

    // Load initial data
    this.loadPublicForums();
  }

  // Navigation methods removed - handled by shared navbar component

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Tab switching


  // Forum loading methods
  loadPublicForums() {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.error = 'Please log in to view forums.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.forumService.getDiscussedHiddenSpots(userId).subscribe({
      next: (forums) => {
        this.forums = forums;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading forums:', error);
        this.error = 'Failed to load forums. Please try again.';
        this.loading = false;
      }
    });
  }

  loadUserForums() {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.error = 'Please log in to view your forums.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.forumService.getForumsByUser(userId).subscribe({
      next: (forums) => {
        this.userForums = forums;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user forums:', error);
        this.error = 'Failed to load your forums. Please try again.';
        this.loading = false;
      }
    });
  }

  // Create forum methods
  resetCreateForm() {
    const userId = this.authService.getCurrentUserId();
    this.newForum = {
      name: '',
      registerId: userId || 0,
      visibility: 'public',
      hashtag: '',
      comments: '',
      location: '',
      description: '',
      photos: '',
      pinLocation: '', // New field for pin location
      pinLatitude: undefined,
      pinLongitude: undefined
    };
  }

  createForum() {
    if (!this.isLoggedIn()) {
      this.error = 'Please log in to create a forum.';
      return;
    }

    if (!this.newForum.name.trim()) {
      this.error = 'Forum name is required.';
      return;
    }

    this.loading = true;
    this.error = null;

    // Create ForumRequest object with proper mapping
    const forumRequest: ForumRequest = {
      name: this.newForum.name,
      registerId: this.newForum.registerId,
      visibility: this.newForum.visibility,
      hashtag: this.newForum.hashtag,
      comments: this.newForum.comments,
      location: this.newForum.location,
      description: this.newForum.description,
      photos: this.newForum.photos,
      pinLatitude: this.newForum.pinLatitude,
      pinLongitude: this.newForum.pinLongitude
    };

    this.forumService.saveForum(forumRequest).subscribe({
      next: (response) => {
        this.loading = false;
        this.resetCreateForm();
        // Show success message
        alert('Forum created successfully!');
      },
      error: (error) => {
        console.error('Error creating forum:', error);
        this.error = 'Failed to create forum. Please try again.';
        this.loading = false;
      }
    });
  }

  // Map selector methods
  openMapSelector() {
    if (typeof localStorage !== 'undefined') {
      // Save current form data before navigating
      localStorage.setItem('forumFormData', JSON.stringify({
        name: this.newForum.name,
        description: this.newForum.description,
        location: this.newForum.location,
        hashtag: this.newForum.hashtag,
        comments: this.newForum.comments,
        photos: this.newForum.photos,
        visibility: this.newForum.visibility
      }));
    }
    this.router.navigate(['/map-selector']);
  }

  checkSelectedLocation() {
    if (typeof localStorage !== 'undefined') {
      const selectedLocation = localStorage.getItem('selectedForumLocation');
      if (selectedLocation) {
        const location = JSON.parse(selectedLocation);
        this.newForum.pinLatitude = location.lat;
        this.newForum.pinLongitude = location.lng;
        this.newForum.pinLocation = location.name;
        this.newForum.location = location.name; // Set location description
        localStorage.removeItem('selectedForumLocation');
      }

      // Restore form data
      const formData = localStorage.getItem('forumFormData');
      if (formData) {
        const data = JSON.parse(formData);
        this.newForum.name = data.name || '';
        this.newForum.description = data.description || '';
        // Don't overwrite location if it was set from map
        if (!this.newForum.location) {
          this.newForum.location = data.location || '';
        }
        this.newForum.hashtag = data.hashtag || '';
        this.newForum.comments = data.comments || '';
        this.newForum.photos = data.photos || '';
        this.newForum.visibility = data.visibility || 'public';
        localStorage.removeItem('forumFormData');
      }
    }
  }

  // Search methods
  resetSearchFilters() {
    this.searchFilters = {
      location: '',
      hashtag: '',
      forumId: ''
    };
    this.forums = [];
  }

  searchByLocation() {
    if (!this.searchFilters.location.trim()) {
      this.error = 'Please enter a location to search.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.forumService.getForumsByLocation(this.searchFilters.location).subscribe({
      next: (forums) => {
        this.forums = forums;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching by location:', error);
        this.error = 'Failed to search forums by location. Please try again.';
        this.loading = false;
      }
    });
  }

  searchByHashtag() {
    if (!this.searchFilters.hashtag.trim()) {
      this.error = 'Please enter a hashtag to search.';
      return;
    }

    this.loading = true;
    this.error = null;

    // Remove # if user added it
    const hashtag = this.searchFilters.hashtag.replace('#', '');

    this.forumService.getForumsByHashtag(hashtag).subscribe({
      next: (forums) => {
        this.forums = forums;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching by hashtag:', error);
        this.error = 'Failed to search forums by hashtag. Please try again.';
        this.loading = false;
      }
    });
  }

  searchById() {
    const forumId = parseInt(this.searchFilters.forumId);
    if (!forumId || forumId <= 0) {
      this.error = 'Please enter a valid forum ID.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.forumService.getForumById(forumId).subscribe({
      next: (forum) => {
        this.forums = [forum];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching by ID:', error);
        this.error = 'Forum not found or failed to load. Please try again.';
        this.loading = false;
      }
    });
  }

  // Forum detail methods
  viewForumDetails(forum: ForumResponse) {
    this.selectedForum = forum;
  }

  closeForumDetails() {
    this.selectedForum = null;
  }

  switchTab(tab: 'all' | 'my-forums' | 'create' | 'search') {
    this.activeTab = tab;
    this.error = null;

    const tabWidth = 160;
    const order = ['all', 'my-forums', 'create', 'search'];
    this.sliderPosition = order.indexOf(tab) * tabWidth;

    switch (tab) {
      case 'all':
        this.loadPublicForums();
        break;
      case 'my-forums':
        if (this.isLoggedIn()) {
          this.loadUserForums();
        }
        break;
      case 'create':
        this.resetCreateForm();
        break;
      case 'search':
        this.resetSearchFilters();
        break;
    }
  }




}
