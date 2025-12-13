import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { AnimeStore } from '../../services/anime';
import { Anime } from '../../model/anime.model';
import { SkeletonCard } from '../../components/skeleton-card/skeleton-card';
import { AnimeCard } from '../../components/anime-card/anime-card';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SkeletonCard, AnimeCard ],
  templateUrl: `./search.html`,
})
export class SearchComponent implements OnInit {
  store = inject(AnimeStore);
  router = inject(Router);
  
  searchControl = new FormControl('');
  results: Anime[] = [];
  loading = false;

  // This method was missing in the previous snippet
  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(200),        // Wait 200ms after typing stops
      distinctUntilChanged(),   // Ignore if the value is the same as before
      tap(() => this.loading = true), // Show skeletons
      switchMap(query => this.store.searchAnime(query || '')), // Call API
      tap(() => this.loading = false) // Hide skeletons
    ).subscribe(results => {
      this.results = results;
    });
  }

  onAnimeClick(id: string) {
    this.router.navigate(['/anime', id]);
  }
}