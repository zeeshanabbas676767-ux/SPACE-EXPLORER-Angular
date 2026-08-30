import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  error: string | null = null;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private auth: AuthService, private router: Router) {}
   togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onRegister(): void {
    this.error = '';

        if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
  }

  submit() {
    this.error = null;

    if (!this.fullName || !this.email || !this.password) {
      this.error = 'All fields are required';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;

    this.auth.register({
      fullName: this.fullName,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Registration failed';
        console.error('Register error', err);
      }
    });
  }
}
