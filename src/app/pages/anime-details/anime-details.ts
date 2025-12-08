import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AnimeStore } from '../../services/anime';
import { Episode } from '../../model/anime.model';

@Component({
  selector: 'app-anime-details',
  standalone: true,
  imports: [CommonModule],
  // REMOVED: animations: [ ... ] array
  templateUrl: `./anime-details.html`,
})
export class AnimeDetails implements OnInit, AfterViewInit {
  store = inject(AnimeStore);
  private route = inject(ActivatedRoute);

  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef;

  displayedEpisodes: Episode[] = [];
  page = 0;
  pageSize = 5;
  hasMoreEpisodes = true;
  private observer: IntersectionObserver | null = null;

  constructor() {
    effect(() => {
      const anime = this.store.currentAnime();
      if (anime) {
        this.displayedEpisodes = [];
        this.page = 0;
        this.hasMoreEpisodes = true;
        this.loadMoreEpisodes(anime.episodeList || []);
      }
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.store.selectedAnimeId.set(id);
      }
    });
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const anime = this.store.currentAnime();
        if (anime && anime.episodeList) {
          this.loadMoreEpisodes(anime.episodeList);
        }
      }
    });

    setTimeout(() => {
        if (this.scrollAnchor) {
            this.observer?.observe(this.scrollAnchor.nativeElement);
        }
    }, 100);
  }

  loadMoreEpisodes(allEpisodes: Episode[]) {
    if (!allEpisodes.length) return;

    setTimeout(() => {
      const nextBatch = allEpisodes.slice(
        this.page * this.pageSize, 
        (this.page + 1) * this.pageSize
      );
      
      if (nextBatch.length > 0) {
        this.displayedEpisodes = [...this.displayedEpisodes, ...nextBatch];
        this.page++;
      } else {
        this.hasMoreEpisodes = false;
        this.observer?.disconnect();
      }
    }, 500);
  }

  onToggleList(id: string) {
    this.store.toggleMyList(id);
  }
}