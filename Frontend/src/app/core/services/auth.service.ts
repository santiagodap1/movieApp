import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/Auth`;
  private tokenKey = 'jwt_token';
  private isBrowser: boolean;

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    const token = this.getToken();
    if (this.isBrowser && token) {
      this.isLoggedInSubject.next(true);
      this.isAdminSubject.next(this.extractIsAdmin(token));
    }
  }

  signup(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/signup`, { name, email, password });
  }

  signin(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/signin`, { email, password }).pipe(
      tap((res) => {
        this.setSession(res.token);
      })
    );
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
    }
    this.isLoggedInSubject.next(false);
    this.isAdminSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken() {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  isAdmin(): boolean {
    return this.isAdminSubject.value;
  }

  private setSession(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, token);
    }
    this.isLoggedInSubject.next(true);
    this.isAdminSubject.next(this.extractIsAdmin(token));
  }

  private extractIsAdmin(token: string): boolean {
    if (!this.isBrowser || !token) {
      return false;
    }
    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return false;
      }
      const decoded = JSON.parse(atob(payload));
      const roleClaim =
        decoded['role'] ??
        decoded['roles'] ??
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      if (Array.isArray(roleClaim)) {
        return roleClaim.includes('Admin');
      }
      return roleClaim === 'Admin';
    } catch (error) {
      console.error('Failed to decode token payload', error);
      return false;
    }
  }
}
