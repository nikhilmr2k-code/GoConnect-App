import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface RegisterRequest {
  name: string;
  age: number;
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  auth: boolean;
  respData: {
    id: number;
    username: string;
    name: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Check if user is already logged in (only in browser)
    if (this.isBrowser) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        this.currentUserSubject.next(user);
        
        // Ensure userId is stored separately if not already present
        if (user.id && !localStorage.getItem('userId')) {
          localStorage.setItem('userId', user.id.toString());
        }
      }
    }
  }

  register(request: RegisterRequest): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, request);
  }

  setCurrentUser(user: any) {
    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      // Also store user ID separately for easy access
      if (user && user.id) {
        localStorage.setItem('userId', user.id.toString());
      }
    }
    this.currentUserSubject.next(user);
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): number | null {
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id) {
      return currentUser.id;
    }
    
    // Fallback to localStorage if user object doesn't have ID
    if (this.isBrowser) {
      const userId = localStorage.getItem('userId');
      return userId ? parseInt(userId, 10) : null;
    }
    
    return null;
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userId');
    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
}