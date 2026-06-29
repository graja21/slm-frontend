import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AuthService,
  UserProfile
} from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: UserProfile | null = null;

  fullName = '';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  loading = false;
  savingProfile = false;
  changingPassword = false;

  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.fullName = user.fullName;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load profile.';
        this.loading = false;
      }
    });
  }

  updateProfile(): void {
    const cleanName = this.fullName.trim();

    if (!cleanName) {
      this.errorMessage = 'Full name is required.';
      return;
    }

    this.savingProfile = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.updateProfile({ fullName: cleanName }).subscribe({
      next: (user) => {
        this.user = user;
        this.fullName = user.fullName;
        this.successMessage = 'Profile updated successfully.';
        this.savingProfile = false;
      },
      error: () => {
        this.errorMessage = 'Unable to update profile.';
        this.savingProfile = false;
      }
    });
  }

  changePassword(): void {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Please fill all password fields.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New passwords do not match.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'New password must contain at least 6 characters.';
      return;
    }

    this.changingPassword = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.successMessage = 'Password changed successfully.';
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.changingPassword = false;
      },
      error: () => {
        this.errorMessage = 'Unable to change password. Please check your current password.';
        this.changingPassword = false;
      }
    });
  }

  getInitials(): string {
    if (!this.user?.fullName) {
      return 'AI';
    }

    return this.user.fullName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
}