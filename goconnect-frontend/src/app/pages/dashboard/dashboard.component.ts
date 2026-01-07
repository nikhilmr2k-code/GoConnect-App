import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ForumService } from '../../services/forum.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

interface Forum {
  forumId: number;
  name: string;
  visibility: string;
  hashtag?: string;
  comments?: string;
  location?: string;
  description?: string;
  photos?: string;
  userInfo?: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('locationChart') locationChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('hashtagChart') hashtagChart!: ElementRef<HTMLCanvasElement>;
  
  forums: Forum[] = [];
  loading = false;
  error: string | null = null;
  currentUser: any = null;
  
  locationChartInstance: Chart | null = null;
  hashtagChartInstance: Chart | null = null;

  constructor(
    private forumService: ForumService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      Chart.register(...registerables);
    }
  }

  ngOnInit() {
    // Subscribe to current user changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadChartData();
    }
  }

  loadChartData() {
    this.loadLocationChart();
    this.loadHashtagChart();
  }

  loadLocationChart() {
    this.forumService.getForumLocationCounts().subscribe({
      next: (data) => {
        const labels = data.map(item => item[0]);
        const counts = data.map(item => item[1]);
        this.createLocationChart(labels, counts);
      },
      error: (error) => {
        console.error('Error loading location data:', error);
      }
    });
  }

  loadHashtagChart() {
    this.forumService.getForumHashtagCounts().subscribe({
      next: (data) => {
        const labels = data.map(item => '#' + item[0]);
        const counts = data.map(item => item[1]);
        this.createHashtagChart(labels, counts);
      },
      error: (error) => {
        console.error('Error loading hashtag data:', error);
      }
    });
  }

  createLocationChart(labels: string[], data: number[]) {
    if (!isPlatformBrowser(this.platformId)) return;
    
    if (this.locationChartInstance) {
      this.locationChartInstance.destroy();
    }

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            '#667eea', '#764ba2', '#f093fb', '#f5576c',
            '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Forums by Location'
          }
        }
      }
    };

    this.locationChartInstance = new Chart(this.locationChart.nativeElement, config);
  }

  createHashtagChart(labels: string[], data: number[]) {
    if (!isPlatformBrowser(this.platformId)) return;
    
    if (this.hashtagChartInstance) {
      this.hashtagChartInstance.destroy();
    }

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            '#ff9a9e', '#fecfef', '#fecfef', '#ffecd2',
            '#fcb69f', '#a8edea', '#fed6e3', '#d299c2'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Forums by Hashtag'
          }
        }
      }
    };

    this.hashtagChartInstance = new Chart(this.hashtagChart.nativeElement, config);
  }

  // Navigation methods removed - handled by shared navbar component
}
