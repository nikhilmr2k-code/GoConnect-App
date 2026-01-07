import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  username: string;
  age: number;
  friendshipStatus: string; // "NONE", "PENDING_SENT", "PENDING_RECEIVED", "APPROVED"
}

export interface UserListResponse {
  availableUsers: UserInfo[];
}

export interface FriendRequest {
  userRegisterId: number;
  friendRegisterId: number;
}

export interface FriendApprovalRequest {
  friendshipId: number;
  action: string; // "APPROVE" or "REJECT"
}

export interface Friend {
  id: number;
  userRegister: {
    id: number;
    name: string;
    email: string;
    username: string;
    age: number;
  };
  friendRegister: {
    id: number;
    name: string;
    email: string;
    username: string;
    age: number;
  };
  approvalStatus: string; // "N" = Pending, "Y" = Approved
}


export interface Register {
  
    id: number;
    name: string;
    email: string;
    username: string;
    age: number;
  
}

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // Get available users to send friend requests to
  getAvailableUsers(currentUserId: number): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(`${this.baseUrl}/users/${currentUserId}`);
  }

  // Send a friend request
  sendFriendRequest(request: FriendRequest): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/friend-request`, request);
  }

  // Get pending friend requests for a user
  getPendingFriendRequests(userId: number): Observable<Friend[]> {
    return this.http.get<Friend[]>(`${this.baseUrl}/friend-requests/${userId}`);
  }

  // Approve or reject a friend request
  approveFriendRequest(request: FriendApprovalRequest): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/friend-approval`, request);
  }

  // Get approved friends for a user
  getApprovedFriends(userId: number): Observable<Register[]> {
    return this.http.get<Register[]>(`${this.baseUrl}/friends/${userId}`);
  }
}