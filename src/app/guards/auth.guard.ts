// // src/app/guards/auth.guard.ts
//  import { Injectable } from '@angular/core';
//  import { CanActivate, Router } from '@angular/router';

// @Injectable({ providedIn: 'root' })
// export class AdminGuard implements CanActivate {

//   constructor(private router: Router) {}

//   canActivate(): boolean {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       this.router.navigate(['/login']);
//       return false;
//     }

//     const payload = JSON.parse(atob(token.split('.')[1]));
//     if (payload.role !== 'Admin') {
//       this.router.navigate(['/']); // redirect non-admins
//       return false;
//     }

//     return true;
//   }
// }




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
