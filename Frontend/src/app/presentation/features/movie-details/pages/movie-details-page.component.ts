import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../../../core/services/tmdb.service';
import { Movie } from '../../../../domain/models/movie.model';
import { CommentsComponent } from '../../comments/comments.component';

@Component({
  selector: 'app-movie-details-page',
  standalone: true,
  imports: [CommonModule, CommentsComponent],
  templateUrl: './movie-details-page.component.html',
  styleUrls: ['./movie-details-page.component.scss'],
})
export class MovieDetailsPageComponent implements OnInit, OnDestroy {
  movie?: Movie;
  loading = false;
  private originalBodyBackgroundColor: string = '';
  private readonly themedBackgroundClass = 'movie-themed-bg';

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.originalBodyBackgroundColor = this.document.body.style.backgroundColor;
    }
    const movieId = Number(this.route.snapshot.paramMap.get('id'));
    if (movieId) {
      this.fetchMovieDetails(movieId);
    }
  }

  ngOnDestroy(): void {
    this.resetBodyStyles();
  }

  fetchMovieDetails(id: number): void {
    this.loading = true;
    this.tmdbService.getMovieDetails(id).subscribe({
      next: (res) => {
        this.movie = {
          id: res.id,
          title: res.title,
          overview: res.overview,
          posterUrl: res.poster_path ? `https://image.tmdb.org/t/p/w500${res.poster_path}` : '',
          backdropUrl: res.backdrop_path
            ? `https://image.tmdb.org/t/p/original${res.backdrop_path}`
            : '',
          releaseDate: res.release_date,
          rating: res.vote_average,
          genres: res.genres?.map((g: any) => g.name),
        };
        this.loading = false;
        if (this.movie.backdropUrl) {
          this.applyBackdropBackground(this.movie.backdropUrl);
        } else {
          this.resetBodyStyles();
        }
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  private applyBackdropBackground(imageUrl: string): void {
    if (!this.isBrowser()) {
      return;
    }
    this.document.body.classList.add(this.themedBackgroundClass);
    this.document.body.style.setProperty('--movie-bg-image', `url(${imageUrl})`);
  }

  private resetBodyStyles(): void {
    if (!this.isBrowser()) {
      return;
    }
    this.document.body.style.backgroundColor = this.originalBodyBackgroundColor;
    this.document.body.classList.remove(this.themedBackgroundClass);
    this.document.body.style.removeProperty('--movie-bg-image');
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
