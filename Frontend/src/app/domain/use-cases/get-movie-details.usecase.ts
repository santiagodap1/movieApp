import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieRepository } from '../repositories/movie.repository';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class GetMovieDetailsUseCase {
  constructor(private repository: MovieRepository) {}

  execute(id: number): Observable<Movie> {
    return this.repository.getMovieDetails(id);
  }
}
