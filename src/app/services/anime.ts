import { Injectable, signal, computed, effect } from '@angular/core';
import { Anime, Episode } from '../model/anime.model'; // Kept your specific path
import { from, of, Observable } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AnimeStore {
  // --- STATE SIGNALS ---
  selectedAnimeId = signal<string | null>(null);
  isDarkMode = signal<boolean>(true);
  
  // Data State
  trendingAnime = signal<Anime[]>([]);
  searchResults = signal<Anime[]>([]);
  myList = signal<string[]>([]); 
  loading = signal<boolean>(false);

  // --- COMPUTED SELECTORS ---
  currentAnime = computed(() => {
    const id = this.selectedAnimeId();
    if (!id) return null;
    return this.trendingAnime().find(a => a.id === id) || 
           this.searchResults().find(a => a.id === id) || null;
  });

  isCurrentAnimeInList = computed(() => {
    const current = this.selectedAnimeId();
    return current ? this.myList().includes(current) : false;
  });

  constructor() {
    this.loadInitialData();
    this.loadPersistedState();
    
    // Theme Effect
    effect(() => {
      const isDark = this.isDarkMode();
      console.log('🌙 Effect triggered! isDarkMode:', isDark);
      
      if (isDark) {
        console.log('🌙 Adding dark class');
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark'; // Force dark color scheme
      } else {
        console.log('☀️ Removing dark class');
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light'; // Force light color scheme
      }
      
      console.log('✅ HTML classes:', document.documentElement.classList.toString());
    });
  }

  // --- API METHODS ---

  private mapJikanToAnime(data: any): Anime {
    return {
      id: data.mal_id.toString(),
      title: data.title_english || data.title,
      coverImage: data.images.jpg.large_image_url,
      bannerImage: data.trailer?.images?.maximum_image_url || data.images.jpg.large_image_url, 
      rating: data.score || 0,
      episodes: data.episodes || 0,
      genres: data.genres ? data.genres.map((g: any) => g.name) : [],
      description: data.synopsis || 'No description available.',
      year: data.year || 2023,
      status: data.status,
      episodeList: Array.from({ length: Math.min(data.episodes || 12, 12) }).map((_, i) => ({
        id: `ep-${data.mal_id}-${i}`,
        number: i + 1,
        title: `Episode ${i + 1}`,
        image: data.images.jpg.image_url,
        duration: '24:00'
      }))
    };
  }

  private loadInitialData() {
    this.loading.set(true);
    console.log(' [AnimeStore] Starting API Fetch...'); // Debug Log 1

    from(fetch('https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=10'))
      .pipe(
        switchMap(response => {
           console.log(' [AnimeStore] Response Received'); // Debug Log 2
           return response.json();
        }),
        map((res: any) => {
          console.log(' [AnimeStore] Raw Data:', res.data); // Debug Log 3
          // If res.data is null, we throw error to catch block
          if (!res.data) throw new Error('No data found in API response');
          return res.data.map((item: any) => this.mapJikanToAnime(item));
        }),
        catchError((err: any) => {
          console.error(' [AnimeStore] API Error:', err); // Error Log
          return of([]); 
        })
      )
      .subscribe({
        next: (data) => {
          console.log(' [AnimeStore] Store Updated with:', data.length, 'items'); // Success Log
          this.trendingAnime.set(data);
          this.loading.set(false);
        },
        error: (err) => {
            console.error(' [AnimeStore] Subscribe Error:', err);
            this.loading.set(false);
        }
      });
  }

  searchAnime(query: string): Observable<Anime[]> {
    if (!query.trim()) return of([]);
    
    return from(fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=10`)).pipe(
      switchMap(response => response.json()),
      map((res: any) => res.data.map((item: any) => this.mapJikanToAnime(item))),
      catchError((err: any) => {
        console.error('Search Error:', err);
        return of([]);
      })
    );
  }

  // --- ACTION METHODS ---

  toggleMyList(animeId: string) {
    this.myList.update(list => {
      const newList = list.includes(animeId) 
        ? list.filter(id => id !== animeId) 
        : [...list, animeId];
      localStorage.setItem('myList', JSON.stringify(newList));
      return newList;
    });
  }

  toggleTheme() {
    console.log('🎨 toggleTheme called! Current value:', this.isDarkMode());
    this.isDarkMode.update(v => {
      const newValue = !v;
      console.log('🎨 New value:', newValue);
      localStorage.setItem('darkMode', JSON.stringify(newValue));
      return newValue;
    });
  }

  private loadPersistedState() {
    const savedList = localStorage.getItem('myList');
    if (savedList) this.myList.set(JSON.parse(savedList));
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      this.isDarkMode.set(JSON.parse(savedTheme));
    }
  }
}