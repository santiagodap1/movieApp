import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AdminService,
  AdminUser,
  AdminFavorite,
  AdminComment,
  AdminUserCreatePayload,
} from '../../../../core/services/admin.service';

type AdminSection = 'users' | 'favorites' | 'comments';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  activeSection: AdminSection = 'users';

  users: AdminUser[] = [];
  favorites: AdminFavorite[] = [];
  comments: AdminComment[] = [];

  userForm: FormGroup;
  favoriteForm: FormGroup;
  commentForm: FormGroup;

  loadingUsers = false;
  loadingFavorites = false;
  loadingComments = false;

  feedbackMessage = '';

  constructor(private adminService: AdminService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      isAdmin: [false],
    });

    this.favoriteForm = this.fb.group({
      id: [null],
      userId: [null, Validators.required],
      movieId: [null, Validators.required],
      movieTitle: ['', Validators.required],
      posterUrl: [''],
    });

    this.commentForm = this.fb.group({
      id: [null],
      userId: [null, Validators.required],
      movieId: [null, Validators.required],
      content: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  setActiveSection(section: AdminSection): void {
    this.activeSection = section;
  }

  loadAllData(): void {
    this.loadUsers();
    this.loadFavorites();
    this.loadComments();
  }

  // Users
  loadUsers(): void {
    this.loadingUsers = true;
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loadingUsers = false;
      },
      error: () => {
        this.loadingUsers = false;
        this.showFeedback('Unable to load users.');
      },
    });
  }

  editUser(user: AdminUser): void {
    this.userForm.patchValue({
      id: user.id,
      name: user.name,
      email: user.email,
      password: '',
      isAdmin: user.isAdmin,
    });
  }

  resetUserForm(): void {
    this.userForm.reset({
      id: null,
      name: '',
      email: '',
      password: '',
      isAdmin: false,
    });
  }

  submitUserForm(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const { id, ...payload } = this.userForm.value;
    const isEdit = Boolean(id);

    if (!isEdit && !payload.password) {
      this.userForm.get('password')?.setErrors({ required: true });
      return;
    }

    const preparedPayload = { ...payload };
    if (!preparedPayload.password) {
      delete preparedPayload.password;
    }

    const request$ = isEdit
      ? this.adminService.updateUser(id, preparedPayload)
      : this.adminService.createUser(preparedPayload as AdminUserCreatePayload);

    request$.subscribe({
      next: () => {
        this.showFeedback(isEdit ? 'User updated.' : 'User created.');
        this.resetUserForm();
        this.loadUsers();
      },
      error: () => this.showFeedback('Could not save user.'),
    });
  }

  deleteUser(id: number): void {
    if (!confirm('Delete this user?')) {
      return;
    }
    this.adminService.deleteUser(id).subscribe({
      next: () => {
        this.showFeedback('User deleted.');
        this.loadUsers();
      },
      error: () => this.showFeedback('Could not delete user.'),
    });
  }

  // Favorites
  loadFavorites(): void {
    this.loadingFavorites = true;
    this.adminService.getFavorites().subscribe({
      next: (favorites) => {
        this.favorites = favorites;
        this.loadingFavorites = false;
      },
      error: () => {
        this.loadingFavorites = false;
        this.showFeedback('Unable to load favorites.');
      },
    });
  }

  editFavorite(favorite: AdminFavorite): void {
    this.favoriteForm.patchValue({
      id: favorite.id,
      userId: favorite.userId,
      movieId: favorite.movieId,
      movieTitle: favorite.movieTitle,
      posterUrl: favorite.posterUrl,
    });
  }

  resetFavoriteForm(): void {
    this.favoriteForm.reset({
      id: null,
      userId: null,
      movieId: null,
      movieTitle: '',
      posterUrl: '',
    });
  }

  submitFavoriteForm(): void {
    if (this.favoriteForm.invalid) {
      this.favoriteForm.markAllAsTouched();
      return;
    }

    const { id, ...payload } = this.favoriteForm.value;
    const isEdit = Boolean(id);
    const sanitizedPayload = {
      ...payload,
      userId: Number(payload.userId),
      movieId: Number(payload.movieId),
    };
    const request$ = isEdit
      ? this.adminService.updateFavorite(id, sanitizedPayload)
      : this.adminService.createFavorite(sanitizedPayload);

    request$.subscribe({
      next: () => {
        this.showFeedback(isEdit ? 'Favorite updated.' : 'Favorite created.');
        this.resetFavoriteForm();
        this.loadFavorites();
      },
      error: () => this.showFeedback('Could not save favorite.'),
    });
  }

  deleteFavorite(id: number): void {
    if (!confirm('Delete this favorite?')) {
      return;
    }
    this.adminService.deleteFavorite(id).subscribe({
      next: () => {
        this.showFeedback('Favorite deleted.');
        this.loadFavorites();
      },
      error: () => this.showFeedback('Could not delete favorite.'),
    });
  }

  // Comments
  loadComments(): void {
    this.loadingComments = true;
    this.adminService.getComments().subscribe({
      next: (comments) => {
        this.comments = comments;
        this.loadingComments = false;
      },
      error: () => {
        this.loadingComments = false;
        this.showFeedback('Unable to load comments.');
      },
    });
  }

  editComment(comment: AdminComment): void {
    this.commentForm.patchValue({
      id: comment.id,
      userId: comment.userId,
      movieId: comment.movieId,
      content: comment.content,
    });
  }

  resetCommentForm(): void {
    this.commentForm.reset({
      id: null,
      userId: null,
      movieId: null,
      content: '',
    });
  }

  submitCommentForm(): void {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    const { id, ...payload } = this.commentForm.value;
    const isEdit = Boolean(id);
    const sanitizedPayload = {
      ...payload,
      userId: Number(payload.userId),
      movieId: Number(payload.movieId),
    };
    const request$ = isEdit
      ? this.adminService.updateComment(id, sanitizedPayload)
      : this.adminService.createComment(sanitizedPayload);

    request$.subscribe({
      next: () => {
        this.showFeedback(isEdit ? 'Comment updated.' : 'Comment created.');
        this.resetCommentForm();
        this.loadComments();
      },
      error: () => this.showFeedback('Could not save comment.'),
    });
  }

  deleteComment(id: number): void {
    if (!confirm('Delete this comment?')) {
      return;
    }
    this.adminService.deleteComment(id).subscribe({
      next: () => {
        this.showFeedback('Comment deleted.');
        this.loadComments();
      },
      error: () => this.showFeedback('Could not delete comment.'),
    });
  }

  private showFeedback(message: string): void {
    this.feedbackMessage = message;
    setTimeout(() => (this.feedbackMessage = ''), 4000);
  }
}
