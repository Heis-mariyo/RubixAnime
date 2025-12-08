import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Anime } from '../../model/anime.model';


@Component({
  selector: 'app-anime-card',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './anime-card.html',
  styleUrl: './anime-card.css',
})
export class AnimeCard {
   @Input({ required: true }) anime!: Anime;
  @Output() onClick = new EventEmitter<string>();
}

