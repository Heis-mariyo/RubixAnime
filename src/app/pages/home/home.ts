import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Import Router
import { AnimeStore } from '../../services/anime'; // Adjust path as needed
import { SkeletonCard } from '../../components/skeleton-card/skeleton-card';
import { AnimeCard } from '../../components/anime-card/anime-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ CommonModule, SkeletonCard, AnimeCard ],
  templateUrl: `./home.html`,
})
export class Home {
  store = inject(AnimeStore);
  private router = inject(Router);

  onAnimeClick(id: string) {
    // Navigate using Angular Router
    this.router.navigate(['/anime', id]);
  }
}