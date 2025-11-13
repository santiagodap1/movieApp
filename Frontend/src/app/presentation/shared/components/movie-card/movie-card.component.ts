import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Movie } from '../../../../domain/models/movie.model';
import { FavoriteService } from '../../../../core/services/favorite.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  @Input() movie!: Movie;
  isFav = false;
  isLoggedIn = false;

  constructor(
    private router: Router,
    private favoriteService: FavoriteService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.favoriteService.favorites$.subscribe(() => {
      this.isFav = this.favoriteService.isFavorite(this.movie.id);
    });
  }

  goToDetails(): void {
    if (this.movie?.id) {
      this.router.navigate(['/movie', this.movie.id]);
    }
  }

  toggleFavorite() {
    if (this.isFav) {
      this.favoriteService.removeFavorite(this.movie.id).subscribe();
    } else {
      this.favoriteService.addFavorite(this.movie).subscribe();
    }
  }
}
