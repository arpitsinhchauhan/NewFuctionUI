import { Component, OnInit, ElementRef, Renderer2, ViewChild, Output, EventEmitter } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, Subscription } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { CustomerComponent } from 'app/modules/jama-baki/customer/customer.component';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { CommonService } from 'app/services/common.service';

const misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
};

import { ThemeService } from 'app/services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidenav = new EventEmitter<void>();
  showGMTTime: boolean = false;
  private listTitles: any[];
  location: Location;
  mobile_menu_visible: any = 0;
  private nativeElement: Node;
  private toggleButton: any;
  private sidebarVisible: boolean;
  private _router: Subscription;
  username: string;
  currentTime: string = '';
  private intervalId: any;
  userId = localStorage.getItem('userId');

  @ViewChild('app-navbar-cmp', { static: false }) button: any;

  constructor(location: Location, private element: ElementRef, private router: Router,
    private dialog: MatDialog, private userServiceService: UserServiceService,
    private commonService: CommonService, public themeService: ThemeService,
    private snackBar: MatSnackBar
  ) {
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout(): void {
    // Dismiss any open snackbar so it does not bleed into the login page
    this.snackBar.dismiss();
    // Clear all session data
    localStorage.clear();
    // Navigate to login immediately without waiting for server
    this.router.navigate(['/']);
    // Also attempt to close the server in the background
    this.userServiceService.closeServer().subscribe();
  }

  onToggleSidenav() {
    this.toggleSidenav.emit();
  }

  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.commonService.dialogZIndexAdjustment();
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.updateTime(); // Set initial time
    this.intervalId = setInterval(() => {
      this.updateTime();
    }, 1000);
    const navbar: HTMLElement = this.element.nativeElement;
    const body = document.getElementsByTagName('body')[0];
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    if (body.classList.contains('sidebar-mini')) {
      misc.sidebar_mini_active = true;
    }
    if (body.classList.contains('hide-sidebar')) {
      misc.hide_sidebar_active = true;
    }
    this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.sidebarClose();

      const $layer = document.getElementsByClassName('close-layer')[0];
      if ($layer) {
        $layer.remove();
      }
    });
  }
  onResize() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
  sidebarOpen() {
    var $toggle = document.getElementsByClassName('navbar-toggler')[0];
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName('body')[0];
    setTimeout(function () {
      if (toggleButton) {
        toggleButton.classList.add('toggled');
      }
    }, 500);
    body.classList.add('nav-open');
    setTimeout(function () {
      if ($toggle) {
        $toggle.classList.add('toggled');
      }
    }, 430);

    var $layer = document.createElement('div');
    $layer.setAttribute('class', 'close-layer');


    if (body.querySelectorAll('.main-panel')) {
      document.getElementsByClassName('main-panel')[0].appendChild($layer);
    } else if (body.classList.contains('off-canvas-sidebar')) {
      document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
    }

    setTimeout(function () {
      $layer.classList.add('visible');
    }, 100);

    $layer.onclick = function () { //asign a function
      body.classList.remove('nav-open');
      this.mobile_menu_visible = 0;
      this.sidebarVisible = false;

      $layer.classList.remove('visible');
      setTimeout(function () {
        $layer.remove();
        if ($toggle) {
          $toggle.classList.remove('toggled');
        }
      }, 400);
    }.bind(this);

    body.classList.add('nav-open');
    this.mobile_menu_visible = 1;
    this.sidebarVisible = true;
  };
  sidebarClose() {
    var $toggle = document.getElementsByClassName('navbar-toggler')[0];
    const body = document.getElementsByTagName('body')[0];
    if (this.toggleButton) {
      this.toggleButton.classList.remove('toggled');
    }
    var $layer = document.createElement('div');
    $layer.setAttribute('class', 'close-layer');

    this.sidebarVisible = false;
    body.classList.remove('nav-open');
    // $('html').removeClass('nav-open');
    body.classList.remove('nav-open');
    if ($layer) {
      $layer.remove();
    }

    setTimeout(function () {
      if ($toggle) {
        $toggle.classList.remove('toggled');
      }
    }, 400);

    this.mobile_menu_visible = 0;
  };
  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }

  getTitle() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }
    if (titlee.includes('?')) {
      titlee = titlee.split('?')[0];
    }
    for (let i = 0; i < this.listTitles.length; i++) {
      const section = this.listTitles[i];
      if (section && section.items) {
        for (let j = 0; j < section.items.length; j++) {
          const item = section.items[j];
          if (item.path === titlee) {
            return item.title;
          }
          if (item.children) {
            for (let k = 0; k < item.children.length; k++) {
              const child = item.children[k];
              if (child.path === titlee) {
                return child.title;
              }
            }
          }
        }
      }
    }
    if (titlee === '/company-master') {
      return 'Company Master';
    }
    if (titlee === '/database-management') {
      return 'Database Management';
    }
    if (titlee === '/settings') {
      return 'Settings';
    }
    if (titlee === '/employee/daily-report') {
      return 'Daily Report';
    }
    if (titlee === '/manager/dashboard') {
      return 'Dashboard';
    }
    return 'Dashboard';
  }
  getPath() {
    return this.location.prepareExternalUrl(this.location.path());
  }

  AddCustomer() {
    const dialogRef = this.dialog.open(CustomerComponent, {
      panelClass: 'dialog-sm',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {

    });
  }
  updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }

  isMobileMenu() {
    if ($(window).width() < 767) {
      return false;
    }
    return true;
  };

  chnagePassword() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      panelClass: 'dialog-sm',
      data: { userId: this.userId, isSelf: true },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.isReload) {
        this.router.navigate(['/']);
      }
    });
  }


}
