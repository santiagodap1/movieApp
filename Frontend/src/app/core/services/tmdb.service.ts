import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Movie } from '../models/movie.model';
import { Genre } from '../models/genre.model';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  constructor(private api: ApiService) {}

  getGenres(): Observable<{ genres: Genre[] }> {
    return this.api.get<{ genres: Genre[] }>(`${this.baseUrl}/genre/movie/list`, {
      api_key: environment.tmdbApiKey,
      language: 'en-US',
    });
  }

  getMoviesByGenre(genreId: number, page = 1): Observable<ApiResponse<Movie>> {
    return this.api.get<ApiResponse<Movie>>(`${this.baseUrl}/discover/movie`, {
      with_genres: genreId,
      page,
    });
  }

  getTopRatedMovies(page = 1): Observable<ApiResponse<Movie>> {
    return this.api.get<ApiResponse<Movie>>(`${this.baseUrl}/movie/top_rated`, {
      language: 'en-US',
      page,
    });
  }

  searchMovies(query: string, page = 1): Observable<ApiResponse<Movie>> {
    return this.api.get<ApiResponse<Movie>>(`${this.baseUrl}/search/movie`, {
      api_key: environment.tmdbApiKey,
      query,
      page,
    });
  }

  getMovieDetails(id: number): Observable<Movie> {
    return this.api.get<Movie>(`${this.baseUrl}/movie/${id}`, {
      api_key: environment.tmdbApiKey,
      language: 'en-US',
    });
  }
}
