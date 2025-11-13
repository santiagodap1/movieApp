import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieRepository } from '../repositories/movie.repository';
import { ApiResponse } from '../models/api-response.model';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class SearchMoviesUseCase {
  constructor(private repository: MovieRepository) {}

  execute(query: string, page = 1): Observable<ApiResponse<Movie>> {
    return this.repository.searchMovies(query, page);
  }
}
