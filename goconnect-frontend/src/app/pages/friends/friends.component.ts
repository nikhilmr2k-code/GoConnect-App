import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FriendService, UserInfo, Friend, FriendRequest, FriendApprovalRequest, Register } from '../../services/friend.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css'
})
export class FriendsComponent implements OnInit {
  currentUser: any = null;
  
  // Data arrays
  availableUsers: UserInfo[] = [];
  pendingRequests: Friend[] = [];
  approvedFriends: Register[] = [];

  
  // UI state
  activeTab: 'find-friends' | 'pending-requests' | 'my-friends' = 'find-friends';
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private friendService: FriendService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadInitialData();
      }
    });
  }

  loadInitialData() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.loadAvailableUsers();
      this.loadPendingRequests();
      this.loadApprovedFriends();
    }
  }

  // Tab switching
  switchTab(tab: 'find-friends' | 'pending-requests' | 'my-friends') {
    this.activeTab = tab;
    this.clearMessages();
  }

  // Load available users to send friend requests
  loadAvailableUsers() {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    this.loading = true;
    this.friendService.getAvailableUsers(userId).subscribe({
      next: (response) => {
        this.availableUsers = response.availableUsers;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading available users:', error);
        this.error = 'Failed to load users. Please try again.';
        this.loading = false;
      }
    });
  }

  // Load pending friend requests
  loadPendingRequests() {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    this.friendService.getPendingFriendRequests(userId).subscribe({
      next: (requests) => {
        this.pendingRequests = requests;
      },
      error: (error) => {
        console.error('Error loading pending requests:', error);
      }
    });
  }

  // Load approved friends
  loadApprovedFriends() {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    this.friendService.getApprovedFriends(userId).subscribe({
      next: (friends) => {
        this.approvedFriends = friends;
      },
      error: (error) => {
        console.error('Error loading friends:', error);
      }
    });
  }

  // Send friend request
  sendFriendRequest(friendId: number) {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.error = 'Please log in to send friend requests.';
      return;
    }

    const request: FriendRequest = {
      userRegisterId: userId,
      friendRegisterId: friendId
    };

    this.friendService.sendFriendRequest(request).subscribe({
      next: (response) => {
        this.successMessage = 'Friend request sent successfully!';
        this.loadAvailableUsers(); // Refresh the list
      },
      error: (error) => {
        console.error('Error sending friend request:', error);
        this.error = 'Failed to send friend request. Please try again.';
      }
    });
  }

  // Approve friend request
  approveFriendRequest(friendshipId: number) {
    const request: FriendApprovalRequest = {
      friendshipId: friendshipId,
      action: 'APPROVE'
    };

    this.friendService.approveFriendRequest(request).subscribe({
      next: (response) => {
        this.successMessage = 'Friend request approved!';
        this.loadPendingRequests();
        this.loadApprovedFriends();
      },
      error: (error) => {
        console.error('Error approving friend request:', error);
        this.error = 'Failed to approve friend request. Please try again.';
      }
    });
  }

  // Reject friend request
  rejectFriendRequest(friendshipId: number) {
    const request: FriendApprovalRequest = {
      friendshipId: friendshipId,
      action: 'REJECT'
    };

    this.friendService.approveFriendRequest(request).subscribe({
      next: (response) => {
        this.successMessage = 'Friend request rejected.';
        this.loadPendingRequests();
      },
      error: (error) => {
        console.error('Error rejecting friend request:', error);
        this.error = 'Failed to reject friend request. Please try again.';
      }
    });
  }

  // Helper methods
  clearMessages() {
    this.error = null;
    this.successMessage = null;
  }

  canSendRequest(user: UserInfo): boolean {
    return user.friendshipStatus === 'NONE';
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING_SENT': return 'Request Sent';
      case 'PENDING_RECEIVED': return 'Pending';
      case 'APPROVED': return 'Friends';
      default: return 'Add Friend';
    }
  }

  // Navigation methods removed - handled by shared navbar component
}
