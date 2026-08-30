// auth.interceptor.ts
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {

  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
}


// import { HttpInterceptorFn } from '@angular/common/http';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {

//   const token = localStorage.getItem('token');

//   if (token) {
//     const authReq = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });

//     console.log('✅ Token attached:', token);
//     return next(authReq);
//   }

//   console.log('⚠️ No token found for request:', req.url);
//   return next(req);
// };


// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
// intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

//   // Skip auth endpoints
//   if (req.url.includes('/api/auth/login') || req.url.includes('/api/auth/register')) {
//     return next.handle(req);
//   }

//   const token = localStorage.getItem('token');

//   // Diagnostic logging to confirm token/header
//   try {
//     console.debug('[AuthInterceptor] request url:', req.url);
//     console.debug('[AuthInterceptor] stored token present:', !!token);
//   } catch (e) {
//     // ignore
//   }

//   if (token) {
//     const authReq = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     // Also log exact header being sent (debug only)
//     try { console.debug('[AuthInterceptor] sending Authorization header:', `Bearer ${token?.substring(0,20)}...`); } catch {}
//     return next.handle(authReq);
//   }

//   // No token - continue without header (server will respond 401)
//   console.warn('No authentication token available. Request sent without Authorization header');
//   return next.handle(req);
// }

// }



// auth.interceptor.ts
// import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
// import { Observable } from 'rxjs';

// export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     const cloned = req.clone({
//       setHeaders: { Authorization: `Bearer ${token}` }
//     });
//     return next(cloned);
//   }
//   return next(req);
// };

// import { HttpInterceptorFn } from '@angular/common/http';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {

//   const token = localStorage.getItem('token');

//   if (token) {
//     req = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }

//   return next(req);
// };
