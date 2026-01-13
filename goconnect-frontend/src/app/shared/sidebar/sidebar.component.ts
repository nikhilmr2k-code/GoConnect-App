import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  isExpanded = false;
  isVisible = true;
  currentRoute = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Load preferences after component initializes
    // this.sidebarService.loadPreferences();
    
    // Subscribe to sidebar state changes
    this.subscriptions.push(
      this.sidebarService.isExpanded$.subscribe(expanded => {
        this.isExpanded = expanded;
        this.updateBodyClass();
      }),
      this.sidebarService.isVisible$.subscribe(visible => {
        this.isVisible = visible;
      }),
      this.router.events
        .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.currentRoute = event.url;
          // Auto-collapse on mobile after navigation
          if (isPlatformBrowser(this.platformId) && window.innerWidth <= 768 && this.isExpanded) {
            this.sidebarService.setExpanded(false);
          }
        })
    );

    // Set initial route
    this.currentRoute = this.router.url;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('sidebar-expanded');
    }
  }

  toggleSidebar() {
    this.sidebarService.toggleExpanded();
  }

  toggleVisibility() {
    this.sidebarService.toggleVisibility();
  }

  private updateBodyClass() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    if (this.isExpanded && window.innerWidth > 768) {
      document.body.classList.add('sidebar-expanded');
    } else {
      document.body.classList.remove('sidebar-expanded');
    }
  }

  // Handle responsive behavior
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const width = event.target.innerWidth;
    
    // Auto-collapse on mobile
    if (width <= 768 && this.isExpanded) {
      this.sidebarService.setExpanded(false);
    }
    
    this.updateBodyClass();
  }

  // Close sidebar when clicking outside on mobile
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const target = event.target as HTMLElement;
    const sidebarElement = document.querySelector('.sidebar-container');
    
    if (window.innerWidth <= 768 && 
        this.isExpanded && 
        sidebarElement && 
        !sidebarElement.contains(target)) {
      this.sidebarService.setExpanded(false);
    }
  }
}