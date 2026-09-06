import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
}) 
export class LoginComponent {
  email = '';
  password = '';
  roleId = 2;
  error: string | null = null;
 loading = false;
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
  
   submit() {
    this.error = null;
    if (!this.email || !this.password) {
      this.error = 'Please provide email and password.';
      return;
    }

    this.loading = true;
    this.auth.login({ email: this.email, password: this.password, roleId: this.roleId }).subscribe({
      next: () => {
        this.loading = false;
       
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Login failed';
        console.error('Login error', err);
      }
    });
  }
  

}