import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../../../core/services/tmdb.service';
import { Movie } from '../../../../domain/models/movie.model';
import { MovieCardComponent } from '../../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit {
  query = '';
  movies: Movie[] = [];
  loading = false;

  constructor(private route: ActivatedRoute, private tmdbService: TmdbService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.query = params['q'] || '';
      if (this.query.trim()) {
        this.searchMovies(this.query);
      } else {
        this.movies = [];
      }
    });
  }

  searchMovies(query: string): void {
    this.loading = true;
    this.tmdbService.searchMovies(query).subscribe({
      next: (res) => {
        this.movies = res.results.map((m) => ({
          id: m.id,
          title: m.title,
          overview: m.overview,
          posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
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
}
