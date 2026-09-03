// // src/app/guards/auth.guard.ts
 import { Injectable } from '@angular/core';
 import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

 @Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      return true; // ✅ user exists in localStorage → stay on page
    }
    this.router.navigate(['/admin/login']); // ❌ no user → go to login
    return false;
  }
}



// @Injectable({ providedIn: 'root' })
// export class AuthGuard implements CanActivate {

//   constructor(private router: Router) {}

//   canActivate(): boolean {
//     const token = localStorage.getItem('token');

//     if (!token) {
//       this.router.navigate(['/login']);
//       return false;
//     }

//     return true;
//   }
// }
