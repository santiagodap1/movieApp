import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';
import { Genre } from '../models/genre.model';
import { ApiResponse } from '../models/api-response.model';

export abstract class MovieRepository {
  abstract getGenres(): Observable<Genre[]>;
  abstract getMoviesByGenre(genreId: number, page?: number): Observable<ApiResponse<Movie>>;
  abstract getMovieDetails(id: number): Observable<Movie>;
  abstract searchMovies(query: string, page?: number): Observable<ApiResponse<Movie>>;
}
