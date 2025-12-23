import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AnimeStore } from '../../services/anime';
import { AnimeCard } from '../../components/anime-card/anime-card';
import { Anime } from '../../model/anime.model';

@Component({
  selector: 'app-my-list',
  standalone: true,
  imports: [CommonModule, AnimeCard],
  templateUrl: `./my-list.html`
})
export class MyList {
  store = inject(AnimeStore);
  router = inject(Router);

  // Computed: Finds anime objects from Trending/Search that match the IDs in myList
  savedAnimes = computed(() => {
    const ids = this.store.myList();
    
    // Combine all known anime in memory
    const allKnownAnime = [
      ...this.store.trendingAnime(), 
      ...this.store.searchResults()
    ];

    // Filter to find matches and remove duplicates (using Map)
    const matches = allKnownAnime.filter(a => ids.includes(a.id));
    
    // De-duplicate in case an anime is in both Trending AND Search results
    return Array.from(new Map(matches.map(item => [item.id, item])).values());
  });

  onAnimeClick(id: string) {
    this.router.navigate(['/anime', id]);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}