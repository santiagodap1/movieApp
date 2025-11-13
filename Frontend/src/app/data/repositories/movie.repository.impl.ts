import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MovieRepository } from '../../domain/repositories/movie.repository';
import { Movie } from '../../domain/models/movie.model';
import { Genre } from '../../domain/models/genre.model';
import { ApiResponse } from '../../domain/models/api-response.model';
import { TmdbService } from '../../core/services/tmdb.service';
import { MovieMapper } from '../mappers/movie.mapper';

@Injectable({
  providedIn: 'root',
})
export class MovieRepositoryImpl extends MovieRepository {
  constructor(private tmdb: TmdbService) {
    super();
  }

  override getGenres(): Observable<Genre[]> {
    return this.tmdb.getGenres().pipe(
      map((res) => res.genres.map((g) => ({ id: g.id, name: g.name })))
    );
  }

  override getMoviesByGenre(genreId: number, page = 1): Observable<ApiResponse<Movie>> {
    return this.tmdb.getMoviesByGenre(genreId, page).pipe(
      map((res) => ({
        page: res.page,
        results: res.results.map(MovieMapper.fromApiResponse),
        totalPages: res.total_pages,
        totalResults: res.total_results,
      }))
    );
  }

  override getMovieDetails(id: number): Observable<Movie> {
    return this.tmdb.getMovieDetails(id).pipe(map(MovieMapper.fromApiResponse));
  }

  override searchMovies(query: string, page = 1): Observable<ApiResponse<Movie>> {
    return this.tmdb.searchMovies(query, page).pipe(
      map((res) => ({
        page: res.page,
        results: res.results.map(MovieMapper.fromApiResponse),
        totalPages: res.total_pages,
        totalResults: res.total_results,
      }))
    );
  }
}
