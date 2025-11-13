import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/home-page.component';
import { HomeRoutingModule } from './home-routing.module';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@NgModule({
  imports: [CommonModule, HomeRoutingModule, MovieCardComponent],
})
export class HomeModule {}
