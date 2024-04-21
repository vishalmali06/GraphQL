import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApolloService } from '../services/apollo.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apolloService: ApolloService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.apolloService.login(username, password).subscribe(
        (result) => {
          // Handle the result as needed
          this.authService.setToken(result.data.login.token);
          this.router.navigate(['/products'])
        },
        (error) => {
          // Handle login error
          console.error('Login error:', error);
        }
      );
    }
  }
}