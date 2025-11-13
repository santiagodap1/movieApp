import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieDetailsPageComponent } from './pages/movie-details-page.component';
import { MovieDetailsRoutingModule } from './movie-details-routing.module';

@NgModule({
  imports: [CommonModule, MovieDetailsRoutingModule, MovieDetailsPageComponent],
})
export class MovieDetailsModule {}
