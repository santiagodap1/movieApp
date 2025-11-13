import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../../domain/models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:5072/api/Comments';

  constructor(private http: HttpClient) { }

  getComments(movieId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${movieId}`);
  }

  addComment(movieId: number, content: string): Observable<any> {
    return this.http.post(this.apiUrl, { movieId, content });
  }
}
