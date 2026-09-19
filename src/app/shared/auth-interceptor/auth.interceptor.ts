import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  let rawToken: string | null = null;

  // 1. Check all standard direct storage keys
  const possibleKeys = ['token', 'access_token', 'jwt', 'authToken'];
  for (const key of possibleKeys) {
    const val = localStorage.getItem(key);
    if (val && val !== 'null' && val !== 'undefined') {
      rawToken = val;
      break;
    }
  }

  // 2. If not found, check inside common user session objects
  if (!rawToken) {
    const userKeys = ['user', 'currentUser', 'account'];
    for (const key of userKeys) {
      const userJson = localStorage.getItem(key);
      if (userJson) {
        try {
          const parsed = JSON.parse(userJson);
          rawToken = parsed?.token || parsed?.accessToken || parsed?.jwt || null;
          if (rawToken) break;
        } catch (e) {}
      }
    }
  }

  let authReq = req;

 if (rawToken) {
    const cleanToken = rawToken.replace(/^["'](.+)["']$/, '$1').trim();
    console.log('INTERCEPTOR TOKEN FOUND:', cleanToken); // 👈 Add this line

    if (cleanToken && cleanToken.split('.').length === 3) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${cleanToken}`
        }
      });
      console.log('INTERCEPTOR: Header attached successfully!'); // 👈 Add this line
    } else {
      console.warn('INTERCEPTOR: Malformed token blocked! Segments count:', cleanToken.split('.').length); // 👈 Add this line
    }
  } else {
    console.warn('INTERCEPTOR: NO TOKEN FOUND IN LOCALSTORAGE AT ALL!'); // 👈 Add this line
  }
  
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('Unauthorized request (401). Clearing session...');
        localStorage.clear();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};