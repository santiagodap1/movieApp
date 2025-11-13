import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieRepository } from '../repositories/movie.repository';
import { Movie } from '../models/movie.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class GetMoviesByGenreUseCase {
  constructor(private repository: MovieRepository) {}

  execute(genreId: number, page = 1): Observable<ApiResponse<Movie>> {
    return this.repository.getMoviesByGenre(genreId, page);
  }
}
