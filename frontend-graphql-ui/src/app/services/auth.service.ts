import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; // Import Router

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'authToken';

  constructor(private router: Router) {} // Inject Router
  
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    // Check if the user is authenticated based on the presence of the token
    return !!this.getToken();
  }

  logout(): void {
    this.clearToken(); // Clear the authentication token
    this.router.navigateByUrl('/login'); // Redirect to login page
    console.log('User logged out and redirected to login page');
  }
}