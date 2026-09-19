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

  // Track auth state reactively
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  private userSubject = new BehaviorSubject<AuthResponse | null>(this.getStoredUser());

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  getAll(): Observable<Users[]> {
    return this.http.get<Users[]>(`${this.api}`);
  }

  login(data: Login): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, data).pipe(
      tap((res) => this.setSession(res))
    );
  }

  register(data: Register): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/register`, data).pipe(
      tap((res) => this.setSession(res))
    );
  }
  RegisterAdmin(data: Register): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/register-admin`, data).pipe(
      tap((res) => this.setSession(res))
    ); 
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/admin/login']);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  // Session state updates
private setSession(authResult: AuthResponse): void {
  // Extract role directly from JWT payload if missing in response body
  if (!authResult.role && authResult.token) {
    try {
      const payload = JSON.parse(atob(authResult.token.split('.')[1]));
      authResult.role = 
        payload['role'] || 
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        payload['Role'];
    } catch (e) {
      console.error('Failed to parse JWT payload role:', e);
    }
  }

  localStorage.setItem('token', authResult.token);
  localStorage.setItem('user', JSON.stringify(authResult));
  
  this.userSubject.next(authResult);
  this.isLoggedInSubject.next(true);
}

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Check if token expiry timestamp (exp) is in the future
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

private getStoredUser(): AuthResponse | null {
  if (!this.hasValidToken()) {
    return null;
  }
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    const user = JSON.parse(userStr) as AuthResponse;
    const token = this.getToken();

    // Ensure role is extracted from JWT token if absent in stored object
    if (!user.role && token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      user.role = 
        payload['role'] || 
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        payload['Role'];
    }

    return user;
  } catch {
    return null;
  }
}

}


