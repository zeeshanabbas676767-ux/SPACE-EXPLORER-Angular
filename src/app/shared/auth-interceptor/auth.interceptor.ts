import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  let token: string | null = localStorage.getItem('token');

  // Fallback: Check inside user object
  if (!token) {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const userObj = JSON.parse(userJson);
        token = typeof userObj?.token === 'string' ? userObj.token : userObj?.token?.token || null;
      } catch (e) {
        console.error('Error parsing user object from localStorage:', e);
      }
    }
  }

  let authReq = req;

  if (token && typeof token === 'string') {
    const cleanToken = token.replace(/^"(.*)"$/, '$1').trim();
    if (cleanToken && cleanToken.includes('.')) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${cleanToken}`)
      });
    }
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('Unauthorized request (401). Clearing stored session...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};