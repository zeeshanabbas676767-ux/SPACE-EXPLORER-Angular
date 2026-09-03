import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Users } from '../models/users.model';
import { Register } from '../models/register.model';
import { Login } from '../models/login.model';
import { AuthResponse } from '../models/auth-Responce';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = `${environment.apiUrl}/auth`;
  private userSubject = new BehaviorSubject<Users | null>(this.getStoredUser());

    // Change this line
private isLoggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('user'));
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  user$ = this.userSubject.asObservable();
    
  constructor(private http: HttpClient, private router: Router) {}

    // Call this method after a successful login or register
  setLoggedIn(status: boolean) {
    this.isLoggedInSubject.next(status);
  }

   getAll(): Observable<Users[]> {
       return this.http.get<Users[]>(`${this.api}`);
     }

  login(data: Login) {
    return this.http.post<AuthResponse>(`${this.api}/login`, data, { withCredentials: true })
    .pipe(
      tap(res => {
       // localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.userSubject.next(res.user);
         this.setLoggedIn(true);
      })
    );
  }
 register(data: Register) {
  return this.http.post<AuthResponse>(`${this.api}/register`, data, { withCredentials: true })
    .pipe(
      tap(res => {
        // localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.userSubject.next(res.user);
         this.setLoggedIn(true);
      })
    );
}

  logout() {
   // localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
      this.setLoggedIn(false);
    this.router.navigate(['/admin/login']);

  }

  getStoredUser(): Users | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
    getCurrentUserId(): number {
  const user = this.getStoredUser();
  // Return the user ID if found, otherwise default to 0
  return user && user.id ? user.id : 0;
}
  // getToken(): string | null {
  //   return localStorage.getItem('token');
  // }
  
  isLoggedIn(): boolean {
     return !!localStorage.getItem('user');
  }
     delete(id: number): Observable<void> {
     return this.http.delete<void>(`${this.api}` + `/${id}`);
   }


//    getDecodedToken() {
//   const token = localStorage.getItem('token');
//   if (!token) return null;
//   return JSON.parse(atob(token.split('.')[1]));
// }

// isAdmin(): boolean {
//   const decoded = this.getDecodedToken();
//   return decoded?.role === 'Admin';
// }

}


