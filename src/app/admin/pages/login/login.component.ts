import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class AdminLoginComponent {
  email = '';
  password = '';
  error: string | null = null;
  loading = false;
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    this.error = null;

    if (!this.email || !this.password) {
      this.error = 'Please provide email and password.';
      return;
    }

    this.loading = true;

    // Payload strictly matches C# LoginDto (Email, Password)
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        // Redirect directly to protected admin dashboard
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Invalid email or password.';
        console.error('Login error:', err);
      }
    });
  }
}