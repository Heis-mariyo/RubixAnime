import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  @Input() isDark = true;
  @Output() toggleTheme = new EventEmitter<void>();
  
  private router = inject(Router);
  isScrolled = false;
  isMenuOpen = signal(false); // New Signal for Menu State

  constructor() {
    fromEvent(window, 'scroll').pipe(debounceTime(20)).subscribe(() => {
      this.isScrolled = window.scrollY > 50;
    });
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  navigateTo(path: string) {
    this.isMenuOpen.set(false); // Close menu on click
    this.router.navigate([path]);
  }
}