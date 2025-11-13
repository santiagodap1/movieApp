import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPageComponent } from './pages/search-page.component';
import { SearchRoutingModule } from './search-routing.module';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@NgModule({
  imports: [CommonModule, SearchRoutingModule, MovieCardComponent],
})
export class SearchModule {}
