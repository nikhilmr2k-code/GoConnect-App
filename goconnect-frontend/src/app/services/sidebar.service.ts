import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isExpandedSubject = new BehaviorSubject<boolean>(false);
  private isVisibleSubject = new BehaviorSubject<boolean>(true);

  isExpanded$ = this.isExpandedSubject.asObservable();
  isVisible$ = this.isVisibleSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  toggleExpanded() {
    const newValue = !this.isExpandedSubject.value;
    this.isExpandedSubject.next(newValue);
    this.savePreferences();
  }

  toggleVisibility() {
    const newValue = !this.isVisibleSubject.value;
    this.isVisibleSubject.next(newValue);
    this.savePreferences();
  }

  setExpanded(expanded: boolean) {
    this.isExpandedSubject.next(expanded);
    this.savePreferences();
  }

  setVisible(visible: boolean) {
    this.isVisibleSubject.next(visible);
    this.savePreferences();
  }

  get isExpanded(): boolean {
    return this.isExpandedSubject.value;
  }

  get isVisible(): boolean {
    return this.isVisibleSubject.value;
  }

  loadPreferences() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      const savedExpanded = localStorage.getItem('sidebar-expanded');
      const savedVisible = localStorage.getItem('sidebar-visible');
      
      if (savedExpanded !== null) {
        this.isExpandedSubject.next(JSON.parse(savedExpanded));
      }
      
      if (savedVisible !== null) {
        this.isVisibleSubject.next(JSON.parse(savedVisible));
      }
    } catch (e) {}
  }

  private savePreferences() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      localStorage.setItem('sidebar-expanded', JSON.stringify(this.isExpanded));
      localStorage.setItem('sidebar-visible', JSON.stringify(this.isVisible));
    } catch (e) {}
  }
}