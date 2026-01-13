import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ForumRequest {
  name: string;
  registerId: number;
  visibility: string;
  hashtag: string;
  comments: string;
  location: string;
  description: string;
  photos: string;
  pinLocation?: string; // New field for pin location
  pinLatitude?: number; // Pin coordinates
  pinLongitude?: number;
  hiddenSpotId?: number; // One-to-one relation with hidden spot
}

export interface ForumResponse {
  forumId: number;
  name: string;
  userInfo: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
  visibility: string;
  hashtag: string;
  comments: string;
  location: string;
  description: string;
  photos: string;
  pinLocation?: string; // New field for pin location
  pinLatitude?: number; // Pin coordinates
  pinLongitude?: number;
  hiddenSpot?: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    locationDescription: string;
    locationAddress: string;
  }; // One-to-one relation with hidden spot
}

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  saveForum(request: ForumRequest): Observable<string> {
    console.log('Saving forum with userId (registerId):', request.registerId);
    console.log('Forum request data:', request);
    return this.http.post<string>(`${this.baseUrl}/saveForum`, request);
  }

  getPublicForums(userId: number): Observable<ForumResponse[]> {
    console.log('Getting public forums for userId:', userId);
    return this.http.get<ForumResponse[]>(`${this.baseUrl}/forums/public/${userId}`);
  }

  // Get forum location counts
  getForumLocationCounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/forums/locations/count`);
  }

  // Get forum hashtag counts
  getForumHashtagCounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/forums/hashtags/count`);
  }

  getForumsByUser(registerId: number): Observable<ForumResponse[]> {
    console.log('Getting forums for userId:', registerId);
    return this.http.get<ForumResponse[]>(`${this.baseUrl}/forums/user/${registerId}`);
  }

  getForumsByLocation(location: string): Observable<ForumResponse[]> {
    console.log('Getting forums by location:', location);
    return this.http.get<ForumResponse[]>(`${this.baseUrl}/forums/location/${location}`);
  }

  getForumsByHashtag(hashtag: string): Observable<ForumResponse[]> {
    console.log('Getting forums by hashtag:', hashtag);
    return this.http.get<ForumResponse[]>(`${this.baseUrl}/forums/hashtag/${hashtag}`);
  }

  getForumById(forumId: number): Observable<ForumResponse> {
    console.log('Getting forum by ID:', forumId);
    return this.http.get<ForumResponse>(`${this.baseUrl}/forum/${forumId}`);
  }

  // Additional methods to demonstrate userId usage
  getForumOwner(forumId: number): Observable<string> {
    console.log('Getting forum owner for forum ID:', forumId);
    return this.http.get<string>(`${this.baseUrl}/forum/${forumId}/owner`);
  }

  getUserForumsCount(userId: number): Observable<number> {
    console.log('Getting forums count for userId:', userId);
    return this.http.get<number>(`${this.baseUrl}/user/${userId}/forums/count`);
  }

  checkForumOwnership(forumId: number, userId: number): Observable<boolean> {
    console.log('Checking if userId', userId, 'owns forum', forumId);
    return this.http.get<boolean>(`${this.baseUrl}/forum/${forumId}/check-owner/${userId}`);
  }

  // Get discussed hidden spots from forums
  getDiscussedHiddenSpots(userId: number): Observable<ForumResponse[]> {
    console.log('Getting discussed hidden spots for userId:', userId);
    return this.http.get<ForumResponse[]>(`${this.baseUrl}/forums/discussed-spots/${userId}`);
  }
}