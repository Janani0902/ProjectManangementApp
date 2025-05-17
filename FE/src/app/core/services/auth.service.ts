import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userRole: 'admin' | 'viewer' | null = null;
  private loginUrl = `${environment.apiUrl}/auth/login`;

  constructor(private http: HttpClient) {}

  login(username: string, password:string, role:string) {
    return this.http.post<any>(this.loginUrl, { username , password, role}).pipe(
      tap(response => {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('role', role);
        this.userRole=response.role;
      })
    );
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  getRole() {
    return sessionStorage.getItem('role');
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isViewer(): boolean {
    return this.getRole() === 'viewer';
  }

  isAuthenticated(): boolean {
    return !!(sessionStorage.getItem('token') || "").length;
  }
}
