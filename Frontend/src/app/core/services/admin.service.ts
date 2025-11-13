import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface AdminUserCreatePayload {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}

export interface AdminUserUpdatePayload {
  name?: string;
  email?: string;
  password?: string;
  isAdmin?: boolean;
}

export interface AdminFavorite {
  id: number;
  userId: number;
  movieId: number;
  movieTitle: string;
  posterUrl?: string;
}

export interface AdminFavoritePayload {
  userId: number;
  movieId: number;
  movieTitle: string;
  posterUrl?: string;
}

export interface AdminComment {
  id: number;
  userId: number;
  movieId: number;
  content: string;
  createdAt: string;
}

export interface AdminCommentPayload {
  userId: number;
  movieId: number;
  content: string;
}

export interface AdminCommentUpdatePayload {
  userId?: number;
  movieId?: number;
  content?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = `${environment.apiBaseUrl}/admin`;

  constructor(private http: HttpClient) {}

  // Users
  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.baseUrl}/users`);
  }

  createUser(payload: AdminUserCreatePayload): Observable<AdminUser> {
    return this.http.post<AdminUser>(`${this.baseUrl}/users`, payload);
  }

  updateUser(id: number, payload: AdminUserUpdatePayload): Observable<AdminUser> {
    return this.http.put<AdminUser>(`${this.baseUrl}/users/${id}`, payload);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  // Favorites
  getFavorites(): Observable<AdminFavorite[]> {
    return this.http.get<AdminFavorite[]>(`${this.baseUrl}/favorites`);
  }

  createFavorite(payload: AdminFavoritePayload): Observable<AdminFavorite> {
    return this.http.post<AdminFavorite>(`${this.baseUrl}/favorites`, payload);
  }

  updateFavorite(id: number, payload: AdminFavoritePayload): Observable<AdminFavorite> {
    return this.http.put<AdminFavorite>(`${this.baseUrl}/favorites/${id}`, payload);
  }

  deleteFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/favorites/${id}`);
  }

  // Comments
  getComments(): Observable<AdminComment[]> {
    return this.http.get<AdminComment[]>(`${this.baseUrl}/comments`);
  }

  createComment(payload: AdminCommentPayload): Observable<AdminComment> {
    return this.http.post<AdminComment>(`${this.baseUrl}/comments`, payload);
  }

  updateComment(id: number, payload: AdminCommentUpdatePayload): Observable<AdminComment> {
    return this.http.put<AdminComment>(`${this.baseUrl}/comments/${id}`, payload);
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/comments/${id}`);
  }
}
