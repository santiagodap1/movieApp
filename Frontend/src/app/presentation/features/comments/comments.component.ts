import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '../../../domain/models/comment.model';
import { CommentService } from '../../../core/services/comment.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule]
})
export class CommentsComponent implements OnInit {
  @Input() movieId!: number;
  comments: Comment[] = [];
  newComment = '';

  constructor(
    private commentService: CommentService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.commentService.getComments(this.movieId).subscribe(comments => {
      this.comments = comments;
    });
  }

  submitComment(): void {
    if (this.newComment.trim()) {
      this.commentService.addComment(this.movieId, this.newComment).subscribe(comment => {
        this.comments.push(comment.comment);
        this.newComment = '';
      });
    }
  }
}
