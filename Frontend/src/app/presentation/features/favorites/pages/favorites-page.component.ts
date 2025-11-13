import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../../../../core/services/favorite.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MovieCardComponent } from '../../../shared/components/movie-card/movie-card.component';
import { Movie } from '../../../../domain/models/movie.model';
import { forkJoin } from 'rxjs';
import { MovieRepository } from '../../../../domain/repositories/movie.repository';
import { MovieRepositoryImpl } from '../../../../data/repositories/movie.repository.impl';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.scss'],
  providers: [{ provide: MovieRepository, useClass: MovieRepositoryImpl }],
})
export class FavoritesPageComponent implements OnInit {
  favoriteMovies: Movie[] = [];
  isLoggedIn = false;
  warning = '';

  constructor(
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private movieRepository: MovieRepository
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.favoriteService.loadFavorites();
      } else {
        this.favoriteMovies = [];
        this.warning = 'You must be logged.';
      }
    });

    this.favoriteService.favorites$.subscribe((favs) => {
      if (favs && favs.length > 0) {
        // TODO: kinda a hammer, improve later
        // Support different possible property names returned by backend or used locally
        const movieIds = favs
          .map(
            (fav: any) =>
              fav.movieId ?? fav.movie_id ?? fav.MovieId ?? fav.id ?? fav.Id
          )
          .filter((id) => id != null) as number[];

        if (movieIds.length === 0) {
          this.favoriteMovies = [];
          return;
        }

        const movieDetailObservables = movieIds.map((id) =>
          this.movieRepository.getMovieDetails(id)
        );

        forkJoin(movieDetailObservables).subscribe({
          next: (movies) => {
            this.favoriteMovies = movies;
          },
          error: (err) => {
            console.error('Error fetching favorite movie details', err);
            this.warning = 'Could not load favorite movie details.';
          },
        });
      } else {
        this.favoriteMovies = [];
      }
    });
  }
}
