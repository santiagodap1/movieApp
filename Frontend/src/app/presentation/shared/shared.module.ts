import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MovieCardComponent } from './components/movie-card/movie-card.component';

@NgModule({
  imports: [CommonModule, NavbarComponent, MovieCardComponent],
  exports: [NavbarComponent, MovieCardComponent]
})
export class SharedModule {}
