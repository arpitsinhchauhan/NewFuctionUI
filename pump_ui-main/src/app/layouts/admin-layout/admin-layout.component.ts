import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import PerfectScrollbar from 'perfect-scrollbar';
import * as $ from "jquery";
import { filter, Subscription } from 'rxjs';


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  isCollapsed = false;
  isMobileOpen = false;

  constructor(public location: Location, private router: Router) {}

  toggleSidebar() {
    if (window.innerWidth <= 991) {
      this.isMobileOpen = !this.isMobileOpen;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  closeMobileSidebar() {
    this.isMobileOpen = false;
  }

  ngOnInit() {
    // Scroll to top on navigation
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.isMobileOpen = false; // Auto close on mobile
        const contentArea = document.querySelector('.main-content-wrapper');
        if (contentArea) {
          contentArea.scrollTop = 0;
        }
      }
    });
  }

  isMaps(path) {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice(1);
    if (path == titlee) {
      return false;
    } else {
      return true;
    }
  }

  isMac(): boolean {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0 || 
           navigator.platform.toUpperCase().indexOf('IPAD') >= 0;
  }
}
