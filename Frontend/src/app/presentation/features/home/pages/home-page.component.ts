import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { MovieCardComponent } from '../../../shared/components/movie-card/movie-card.component';
import { TmdbService } from '../../../../core/services/tmdb.service';
import { Movie } from '../../../../domain/models/movie.model';
import { Genre } from '../../../../domain/models/genre.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  genres: Genre[] = [];
  selectedGenreId: number | null = null;
  movies: Movie[] = [];
  loading = false;
  topRatedMovies: Movie[] = [];
  topRatedLoading = false;
  private currentTopRatedIndex = 0;
  private originalBodyBackgroundColor = '';
  private autoScrollTimer?: ReturnType<typeof setInterval>;

  @ViewChild('topRatedCarousel') topRatedCarousel?: ElementRef<HTMLDivElement>;

  constructor(
    private tmdbService: TmdbService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.originalBodyBackgroundColor = this.document.body.style.backgroundColor;
    }
    this.loadGenres();
    this.loadTopRatedMovies();
  }

  ngOnDestroy(): void {
    this.resetBodyBackground();
    this.stopAutoScroll();
  }

  loadGenres(): void {
    this.tmdbService.getGenres().subscribe({
      next: (res) => {
        this.genres = res.genres;
        if (this.genres.length > 0 && !this.selectedGenreId) {
          this.selectGenre(this.genres[0].id);
        }
      },
      error: (err) => console.error(err),
    });
  }

  selectGenre(genreId: number): void {
    this.selectedGenreId = genreId;
    this.loadMoviesByGenre(genreId);
  }

  loadMoviesByGenre(genreId: number): void {
    this.loading = true;
    this.tmdbService.getMoviesByGenre(genreId).subscribe({
      next: (res) => {
        this.movies = res.results.map((m) => ({
          id: m.id,
          title: m.title,
          overview: m.overview,
          posterUrl: m.poster_path
            ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
            : '',
          releaseDate: m.release_date,
          rating: m.vote_average,
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  loadTopRatedMovies(): void {
    this.topRatedLoading = true;
    this.tmdbService.getTopRatedMovies().subscribe({
      next: (res) => {
        this.topRatedMovies = res.results.slice(0, 12).map((m) => ({
          id: m.id,
          title: m.title,
          overview: m.overview,
          posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
          backdropUrl: m.backdrop_path
            ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
            : '',
          releaseDate: m.release_date,
          rating: m.vote_average,
        }));
        this.topRatedLoading = false;
        this.currentTopRatedIndex = 0;
        this.applyBodyBackgroundFromMovie(this.topRatedMovies[0]);
        this.startAutoScroll();
      },
      error: (err) => {
        console.error(err);
        this.topRatedLoading = false;
        this.resetBodyBackground();
      },
    });
  }

  scrollTopRated(direction: 'prev' | 'next', wrap = false): void {
    const container = this.topRatedCarousel?.nativeElement;
    if (!container || !this.topRatedMovies.length) {
      return;
    }
    const maxIndex = this.topRatedMovies.length - 1;
    let nextIndex =
      direction === 'next'
        ? this.currentTopRatedIndex + 1
        : this.currentTopRatedIndex - 1;

    if (wrap) {
      if (nextIndex > maxIndex) {
        nextIndex = 0;
      } else if (nextIndex < 0) {
        nextIndex = maxIndex;
      }
    } else {
      nextIndex = Math.max(0, Math.min(nextIndex, maxIndex));
    }

    if (nextIndex === this.currentTopRatedIndex) {
      return;
    }

    this.currentTopRatedIndex = nextIndex;

    const target = container.children.item(this.currentTopRatedIndex) as HTMLElement | null;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      this.applyBodyBackgroundFromMovie(this.topRatedMovies[this.currentTopRatedIndex]);
    }
  }

  onTopRatedScroll(): void {
    const container = this.topRatedCarousel?.nativeElement;
    if (!container || !this.topRatedMovies.length) {
      return;
    }
    const centerPosition = container.scrollLeft + container.clientWidth / 2;
    const slides = Array.from(container.children) as HTMLElement[];
    let closestIndex = this.currentTopRatedIndex;
    let minDistance = Number.MAX_VALUE;

    slides.forEach((slide, index) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(centerPosition - slideCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== this.currentTopRatedIndex) {
      this.currentTopRatedIndex = closestIndex;
      this.applyBodyBackgroundFromMovie(this.topRatedMovies[closestIndex]);
    }
  }

  goToMovie(movieId: number | undefined): void {
    if (!movieId) {
      return;
    }
    this.router.navigate(['/movie', movieId]);
  }

  private applyBodyBackgroundFromMovie(movie?: Movie): void {
    if (!this.isBrowser()) {
      return;
    }
    if (movie?.backdropUrl) {
      this.document.body.classList.add('movie-themed-bg');
      this.document.body.style.setProperty('--movie-bg-image', `url(${movie.backdropUrl})`);
    }
  }

  private resetBodyBackground(): void {
    if (!this.isBrowser()) {
      return;
    }
    this.document.body.style.backgroundColor = this.originalBodyBackgroundColor;
    this.document.body.classList.remove('movie-themed-bg');
    this.document.body.style.removeProperty('--movie-bg-image');
  }

  private startAutoScroll(): void {
    if (!this.isBrowser() || this.topRatedMovies.length < 2) {
      return;
    }
    this.stopAutoScroll();
    this.autoScrollTimer = setInterval(() => {
      this.scrollTopRated('next', true);
    }, 10000);
  }

  private stopAutoScroll(): void {
    if (this.autoScrollTimer) {
      clearInterval(this.autoScrollTimer);
      this.autoScrollTimer = undefined;
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
