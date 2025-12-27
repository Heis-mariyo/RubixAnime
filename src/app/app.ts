import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { AnimeStore } from './services/anime';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, Footer],
  templateUrl: `./app.html`,
})
export class AppComponent {
  // Inject the store so the template can access 'store.isDarkMode()'
  store = inject(AnimeStore);
}