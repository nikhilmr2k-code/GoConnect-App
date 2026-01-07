import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Dashboard as the root route
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  
  // Authentication routes
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  
  // User Profile routes
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  
  // Friends routes
  {
    path: 'friends',
    loadComponent: () => import('./pages/friends/friends.component').then(m => m.FriendsComponent)
  },
  
  // Forum routes (note: it's 'forum' not 'forums' based on the directory structure)
  {
    path: 'forum',
    loadComponent: () => import('./pages/forum/forum.component').then(m => m.ForumComponent)
  },
  
  // Hidden Spots routes
  {
    path: 'hidden-spots',
    loadComponent: () => import('./pages/hidden-spots/hidden-spots.component').then(m => m.HiddenSpotsComponent)
  },
  
  // Map Selector route
  {
    path: 'map-selector',
    loadComponent: () => import('./pages/map-selector/map-selector.component').then(m => m.MapSelectorComponent)
  },
  
  // Wildcard route - redirect to dashboard
  {
    path: '**',
    redirectTo: ''
  }
];
