import { Movie } from '../../domain/models/movie.model';

export class MovieMapper {
  static fromApiResponse(apiData: any): Movie {
    return {
      id: apiData.id,
      title: apiData.title,
      overview: apiData.overview,
      posterUrl: `https://image.tmdb.org/t/p/w500${apiData.poster_path}`,
      backdropUrl:`https://image.tmdb.org/t/p/original${apiData.backdrop_path}`,
      releaseDate: apiData.release_date,
      rating: apiData.vote_average,
      genres: apiData.genre_ids ? apiData.genre_ids.map(String) : [],
    };
  }
}
