import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { AuthService, RegisterRequest } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData: RegisterRequest = {
    name: '',
    age: 18, // Set default age
    email: '',
    username: '',
    password: ''
  };
  
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    console.log('Submitting registration data:', this.registerData);

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        console.log('Registration response:', response);
        this.isLoading = false;
        this.successMessage = 'Registration successful! Please login.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.isLoading = false;
        
        // Better error handling
        if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
        } else if (error.status === 400) {
          this.errorMessage = error.error || 'Invalid registration data.';
        } else if (error.status === 409) {
          this.errorMessage = 'Username or email already exists.';
        } else {
          this.errorMessage = error.error || 'Registration failed. Please try again.';
        }
      }
    });
  }

  validateForm(): boolean {
    // Trim whitespace from string fields
    this.registerData.name = this.registerData.name.trim();
    this.registerData.email = this.registerData.email.trim();
    this.registerData.username = this.registerData.username.trim();

    if (!this.registerData.name) {
      this.errorMessage = 'Please enter your full name';
      return false;
    }

    if (!this.registerData.email) {
      this.errorMessage = 'Please enter your email';
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    if (!this.registerData.username) {
      this.errorMessage = 'Please enter a username';
      return false;
    }

    if (this.registerData.username.length < 3) {
      this.errorMessage = 'Username must be at least 3 characters long';
      return false;
    }

    if (!this.registerData.password) {
      this.errorMessage = 'Please enter a password';
      return false;
    }

    if (this.registerData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }

    if (!this.confirmPassword) {
      this.errorMessage = 'Please confirm your password';
      return false;
    }

    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    if (!this.registerData.age || this.registerData.age < 1 || this.registerData.age > 120) {
      this.errorMessage = 'Please enter a valid age (1-120)';
      return false;
    }

    return true;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
