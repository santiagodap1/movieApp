import { Routes } from '@angular/router';
import { HomePageComponent } from './presentation/features/home/pages/home-page.component';
import { MovieDetailsPageComponent } from './presentation/features/movie-details/pages/movie-details-page.component';
import { SearchPageComponent } from './presentation/features/search/pages/search-page.component';
import { LoginComponent } from './presentation/auth/view/login.component';
import { RegisterComponent } from './presentation/auth/view/register.component';
import { FavoritesPageComponent } from './presentation/features/favorites/pages/favorites-page.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { AdminDashboardComponent } from './presentation/features/admin/pages/admin-dashboard.component';

export const appRoutes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'movie/:id', component: MovieDetailsPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'favorites', component: FavoritesPageComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];
