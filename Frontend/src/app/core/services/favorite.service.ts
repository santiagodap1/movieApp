import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private apiUrl = 'http://localhost:5072/api/Favorites';


  private favoritesSubject = new BehaviorSubject<any[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.loadFavorites();
      } else {
        this.favoritesSubject.next([]);
      }
    });
  }


  loadFavorites(): void {
    if (!this.authService.isAuthenticated()) {
      this.favoritesSubject.next([]);
      return;
    }

    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (favs) => this.favoritesSubject.next(favs),
      error: () => this.favoritesSubject.next([]),
    });
  }


  addFavorite(movie: any): Observable<any> {
    if (!this.authService.isAuthenticated()) {
      alert('⚠️ You must be logged.');
      return of(null);
    }

    return this.http
      .post(this.apiUrl, {
        movieId: movie.id,
        movieTitle: movie.title,
        posterUrl: movie.posterUrl,
      })
      .pipe(
        tap(() => {
          const current = this.favoritesSubject.value;
          this.favoritesSubject.next([...current, { movieId: movie.id }]);
        })
      );
  }


  removeFavorite(movieId: number): Observable<any> {
    if (!this.authService.isAuthenticated()) {
      alert('⚠️ You must be logged..');
      return of(null);
    }

    return this.http.delete(`${this.apiUrl}/${movieId}`).pipe(
      tap(() => {
        const current = this.favoritesSubject.value.filter(
          (f) => f.movieId !== movieId
        );
        this.favoritesSubject.next(current);
      })
    );
  }


  getFavorites(): Observable<any[]> {
    return this.favorites$;
  }


  isFavorite(movieId: number): boolean {
    return this.favoritesSubject.value.some((f) => f.movieId === movieId);
  }
}
