import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProfileRequest {
  location: string;
  district: string;
  state: string;
  registerId: number;
}

export interface ProfileResponse {
  id: number;
  location: string;
  district: string;
  state: string;
  userInfo: {
    id: number;
    name: string;
    email: string;
    username: string;
    age: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  createProfile(request: ProfileRequest): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/profile`, request);
  }

  getProfile(registerId: number): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.baseUrl}/profile/${registerId}`);
  }

  updateProfile(profileId: number, request: ProfileRequest): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/profile/${profileId}`, request);
  }
}