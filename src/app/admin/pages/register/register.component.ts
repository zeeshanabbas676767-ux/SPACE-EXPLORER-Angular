import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class AdminRegisterComponent {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  
  error: string | null = null;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;

  get hasShortPassword(): boolean {
    return (this.password.length > 0 && this.password.length < 7)
      || (this.confirmPassword.length > 0 && this.confirmPassword.length < 7);
  }

  constructor(private auth: AuthService, private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  submit(): void {
    this.error = null;

    if (!this.fullName || !this.email || !this.password) {
      this.error = 'All fields are required.';
      return;
    }

    if (this.password.length < 7 || this.confirmPassword.length < 7) {
      this.error = 'Password must be at least 7 characters.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.loading = true;

    // Payload strictly matches C# RegisterDto (FullName, Email, Password)
    this.auth.RegisterAdmin({
      fullName: this.fullName,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        // Redirect directly to admin dashboard upon success
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Registration failed. Please try again.';
        console.error('Register error:', err);
      }
    });
  }
}