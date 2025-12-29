import { Routes } from '@angular/router';
// Import the correct Class Names (usually suffixed with Component)
import { Home } from './pages/home/home';
import { SearchComponent } from './pages/search/search';
import { AnimeDetails } from './pages/anime-details/anime-details';
import { MyList } from './pages/my-list/my-list';
import { Watch } from './pages/watch/watch';

export const routes: Routes = [
  { 
    path: '', 
    component: Home,
    title: 'Rubix Anime - Home'
  },
  { 
    path: 'search', 
    component: SearchComponent, 
    title: 'Search Anime' 
  },
  { 
    // This path must match what is in your Navbar navigateTo('list')
    path: 'list', 
    component: MyList, 
    title: 'My Collection' 
  },
  { 
    path: 'anime/:id', 
    component: AnimeDetails, 
    title: 'Anime Details' 
  },
  { 
    path: 'watch/:id', 
    component: Watch, 
    title: 'Watch Anime' 
  },
  // Wildcard route: Redirects invalid URLs to home
  { 
    path: '**', 
    redirectTo: '' 
  }
];