import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  query = '';
  isLoggedIn = false;
  isAdmin = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((state) => {
      this.isLoggedIn = state;
    });
    this.authService.isAdmin$.subscribe((state) => {
      this.isAdmin = state;
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
  }

  onSearch() {
    if (this.query.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.query } });
    }
  }

  goFavorites() {
    this.router.navigate(['/favorites']);
  }

  goAdmin() {
    this.router.navigate(['/admin']);
  }
}
