import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
 imports: [CommonModule ,FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  isLoginError = false;
  loginErrorMessage = "";
  role: 'admin' | 'viewer' = 'admin';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {

    this.authService.login(this.username, this.password, this.role).subscribe({
      next: (response) => {
        console.log('Login success', response);

        sessionStorage.setItem('token', response.token);

        if (response.role === 'Admin') {
          console.log('Role after login:', response.role);

          this.router.navigate(['/project-form']);
        } else {
          this.router.navigate(['/projects']);
        }

      },
      error: (err) => {
        console.error('Login failed:', err);
        this.isLoginError = true;
       this.loginErrorMessage = err.error?.message || 'Login failed. Please try again.';
       console.log('Error message set:', this.loginErrorMessage);
}
    });
  }

}

