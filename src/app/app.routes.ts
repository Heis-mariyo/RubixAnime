import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { SearchComponent } from './pages/search/search';
import { AnimeDetails } from './pages/anime-details/anime-details';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'search', component: SearchComponent },
  { path: 'anime/:id', component: AnimeDetails },
  { path: '**', redirectTo: '' }
];