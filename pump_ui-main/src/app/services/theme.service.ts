import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private themeSubject = new BehaviorSubject<'light' | 'dark'>('light');
  public theme$ = this.themeSubject.asObservable();
  private currentTheme: 'light' | 'dark' = 'light';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initTheme();
  }

  initTheme() {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      this.currentTheme = savedTheme;
    } else {
      this.currentTheme = 'light';
    }
    this.applyTheme();
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.currentTheme);
    this.applyTheme();
    this.themeSubject.next(this.currentTheme);
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  private applyTheme() {
    const root = document.documentElement;
    const body = document.body;
    
    if (this.currentTheme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      root.classList.remove('dark');
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
    this.themeSubject.next(this.currentTheme);
    // console.log('Theme applied:', this.currentTheme);
  }
}
