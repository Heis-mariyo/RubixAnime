import { Component, inject, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AnimeStore } from '../../services/anime';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-watch',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: `./watch.html`
})
export class Watch implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  store = inject(AnimeStore);

  safeUrl: SafeResourceUrl | null = null;
  currentTitle = signal<string>('Loading...');

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // Find the anime in the store to get its details/trailer
        const anime = this.store.trendingAnime().find(a => a.id === id) || 
                      this.store.searchResults().find(a => a.id === id);
        
        if (anime) {
            this.currentTitle.set(anime.title);
            // 1. We use the Jikan Trailer URL (Youtube embed)
            // 2. To use real episodes, you would replace this logic with a call to a video provider API 
            //    Example: `https://gogoanime-embed.com/embed/${id}-episode-1`
            const videoSource = anime.bannerImage?.replace('maxresdefault', 'embed') || 
                                `https://www.youtube.com/embed?listType=search&list=${anime.title} trailer`;
            
            // Note: Jikan doesn't give direct Embed URLs, so we rely on finding a valid youtube link or defaulting.
            // For this demo, we assume we might not have a direct video link, so I'll use a placeholder youtube search if needed.
            // In a real app, you'd map `anime.id` to a specific video ID.
            
            this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1`); // Placeholder Rick for safety/demo, replace with logic below
            
            // Attempt to construct a real youtube search embed based on title
            this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed?listType=search&list=${anime.title} official trailer`);
        }
      }
    });
  }
  
  // Control header visibility
  showHeader = signal(true);
  private hideTimeout: any;

  // Detect mouse movement
  @HostListener('document:mousemove')
  onMouseMove() {
    // Show header
    this.showHeader.set(true);
    
    // Clear existing timeout
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    
    // Hide after 3 seconds of no movement
    this.hideTimeout = setTimeout(() => {
      this.showHeader.set(false);
    }, 3000); // 3 seconds
  }

  ngOnDestroy() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  goBack() {
    // Navigate back to details page
    const id = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/anime', id]);
  }
}