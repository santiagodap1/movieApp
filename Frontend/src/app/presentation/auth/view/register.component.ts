import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  message = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.auth.signup(this.name, this.email, this.password).subscribe({
      next: () => {
        this.auth.signin(this.email, this.password).subscribe(() => {
          this.router.navigate(['/']);
        });
      },
      error: () => (this.message = 'Error registering user'),
    });
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}
