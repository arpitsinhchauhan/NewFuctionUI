import { Component, OnInit, Input } from '@angular/core';
import { UserServiceService } from 'app/services/user-service.service';
import { BrandService } from 'app/services/brand.service';
import PerfectScrollbar from 'perfect-scrollbar';

declare const $: any;
declare interface RouteInfo {
  path?: string;
  title: string;
  icon?: string;
  class?: string;
  roles?: string[]; // Allowed roles: 'Owner', 'Employee'
  children?: RouteInfo[];
}

export const ROUTES: any[] = [
  {
    section: 'NAVIGATION', items: [
      { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '', roles: ['Owner', 'Employee'] },
      { path: '/User', title: 'User Management', icon: 'supervised_user_circle', class: '', roles: ['Owner'] },
    ]
  },
  {
    section: 'OPERATIONS', items: [
      { path: '/dailyReport', title: 'Daily Report', icon: 'assignment', class: '', roles: ['Owner', 'Employee'] },
      { path: '/bill', title: 'Billing', icon: 'receipt_long', class: '', roles: ['Owner', 'Employee'] },
    ]
  },
  {
    section: 'MANAGEMENT', items: [
      {
        title: 'Inventory Control',
        icon: 'analytics',
        class: 'group',
        roles: ['Owner'],
        children: [
          { path: '/Dipp', title: 'Petrol/Diesel Dip', icon: 'opacity', class: '' },
          { path: '/extraDipp', title: 'Extra Petrol/Diesel Dip', icon: 'opacity', class: '' },
          { path: '/atm', title: 'ATM & Cash', icon: 'payments', class: '' },
          { path: '/Jama&Baki', title: 'Ledger (Credit/Debit)', icon: 'account_balance', class: '' },
        ]
      },
      {
        title: 'Procurement',
        icon: 'shopping_cart',
        class: 'group',
        roles: ['Owner'],
        children: [
          { path: '/purchasedetails', title: 'Purchase Fuel', icon: 'local_gas_station', class: '' },
          { path: '/oilPurchasedetails', title: 'Purchase Oil', icon: 'oil_barrel', class: '' },
          { path: '/extraPurchasedetails', title: 'Extra Fuel Purchase', icon: 'add_shopping_cart', class: '' },
        ]
      }
    ]
  },
  {
    section: 'SALES MODULE', items: [
      {
        title: 'Daily Sales',
        icon: 'trending_up',
        class: 'group',
        roles: ['Owner', 'Employee'],
        children: [
          { path: '/petroldetails', title: 'Petrol Sales', icon: 'local_gas_station', class: '' },
          { path: '/dieseldetails', title: 'Diesel Sales', icon: 'ev_station', class: '' },
          { path: '/XPpetrol', title: 'XP Petrol', icon: 'library_books', class: '' },
          { path: '/powerDiesel', title: 'Power Diesel', icon: 'power', class: '' },
          { path: '/oilsell', title: 'Oil Sales', icon: 'oil_barrel', class: '' },
        ]
      },
    ]
  },
  {
    section: 'FINANCIALS', items: [
      { path: '/Kharch', title: 'Expend', icon: 'attach_money', class: '', roles: ['Owner'] },
      { path: '/customer', title: 'Customer Ledger', icon: 'contacts_product', class: '', roles: ['Owner'] },
      { path: '/Report', title: 'Financial Reports', icon: 'picture_as_pdf', class: '', roles: ['Owner'] },
    ]
  },
  {
    section: 'ADMINISTRATION', items: [
      { path: '/day-closing', title: 'Day Closing (EOD)', icon: 'event_available', class: '', roles: ['Owner'] }
    ]
  }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() isCollapsed = false;
  menuSections: any[];
  role: string = '';
  ps: any;
  branding: any;

  constructor(private userService: UserServiceService, private brandService: BrandService) { }

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    this.branding = this.brandService.getBranding();
    // Default to Owner if not set, for safety or mapping
    this.role = localStorage.getItem('role') || 'Owner';
    // Removed Administrator-to-Owner mapping to allow separate visibility rules

    // Initialize with default (show all) so menu isn't empty on load or if API fails
    this.buildMenu(true, true);

    if (userId) {
      this.userService.getUserPump(userId).subscribe({
        next: (response) => {
          const data = response?.data || {};
          const xpPetrolEnabled = Number(data?.xp_petrol_nozzle) > 0;
          const powerDieselEnabled = Number(data?.powe_diesel_nozzle) > 0;
          this.buildMenu(xpPetrolEnabled, powerDieselEnabled);
          this.initScrollbar();
        },
        error: (err) => {
          console.error('Failed to fetch user pump for sidebar', err);
          this.initScrollbar();
        }
      });
    } else {
      this.initScrollbar();
    }
  }

  buildMenu(xpPetrolEnabled: boolean, powerDieselEnabled: boolean) {
    const currentRole = this.role || 'Owner';
    const isDeveloper = currentRole === 'SUPER_ADMIN' || currentRole === 'DEVELOPER';
    const isManagerAdmin = currentRole === 'admin' || currentRole === 'Administrator';
    const isEmployee = currentRole === 'EMPLOYEE' || currentRole === 'Employee';

    if (isDeveloper) {
      this.menuSections = [
        {
          section: 'SUPER ADMIN PANEL',
          items: [
            { path: '/dashboard', title: 'Dashboard', icon: 'dashboard' },
            { path: '/company-master', title: 'Company Master', icon: 'business' },
            { path: '/User', title: 'User Master', icon: 'supervised_user_circle' },
            { path: '/database-management', title: 'Database Management', icon: 'storage' },
            { path: '/financial-reports', title: 'Financial Suite', icon: 'account_balance_wallet' },
            { path: '/Report', title: 'Reports', icon: 'picture_as_pdf' },
            { path: '/settings', title: 'Settings', icon: 'settings' }
          ]
        }
      ];
    } else if (isManagerAdmin) {
      this.menuSections = [
        {
          section: 'ADMIN PANEL',
          items: [
            { path: '/User', title: 'User Master', icon: 'supervised_user_circle' }
          ]
        }
      ];
    } else if (isEmployee) {
      this.menuSections = [
        {
          section: 'DAILY OPERATIONS',
          items: [
            { path: '/dailyReport', title: 'Daily Report', icon: 'assignment' }
          ]
        }
      ];
    } else {
      // Pump Manager / Owner
      const sections: any[] = [
        {
          section: 'NAVIGATION',
          items: [
            { path: '/dashboard', title: 'Dashboard', icon: 'dashboard' },
            { path: '/User', title: 'Employee Management', icon: 'people' }
          ]
        },
        {
          section: 'DAILY OPERATIONS',
          items: [
            { path: '/dailyReport', title: 'Daily Reports', icon: 'assignment' },
            { path: '/Report', title: 'Reports', icon: 'picture_as_pdf' }
          ]
        }
      ];

      if (currentRole !== 'PUMP_MANAGER' && currentRole !== 'user') {
        sections.push({
          section: 'FINANCIALS',
          items: [
            { path: '/financial-reports', title: 'Financial Suite', icon: 'account_balance_wallet' }
          ]
        });
      }

      sections.push({
        section: 'INVENTORY & SALES',
        items: [
          {
            title: 'Stock Control',
            icon: 'opacity',
            class: 'group',
            children: [
              { path: '/Dipp', title: 'Petrol/Diesel Dip', icon: 'opacity' },
              (xpPetrolEnabled || powerDieselEnabled) ? { path: '/extraDipp', title: 'Extra Petrol/Diesel Dip', icon: 'opacity' } : null,
              { path: '/atm', title: 'ATM & Cash', icon: 'payments' },
              { path: '/Jama&Baki', title: 'Ledger (Credit/Debit)', icon: 'account_balance' }
            ].filter(Boolean)
          },
          {
            title: 'Procurement',
            icon: 'shopping_cart',
            class: 'group',
            children: [
              { path: '/purchasedetails', title: 'Purchase Fuel', icon: 'local_gas_station' },
              { path: '/oilPurchasedetails', title: 'Purchase Oil', icon: 'oil_barrel' },
              (xpPetrolEnabled || powerDieselEnabled) ? { path: '/extraPurchasedetails', title: 'Extra Fuel Purchase', icon: 'add_shopping_cart' } : null
            ].filter(Boolean)
          },
          {
            title: 'Daily Sales',
            icon: 'trending_up',
            class: 'group',
            children: [
              { path: '/petroldetails', title: 'Petrol Sales', icon: 'local_gas_station' },
              { path: '/dieseldetails', title: 'Diesel Sales', icon: 'ev_station' },
              xpPetrolEnabled ? { path: '/XPpetrol', title: 'XP Petrol', icon: 'library_books' } : null,
              powerDieselEnabled ? { path: '/powerDiesel', title: 'Power Diesel', icon: 'power' } : null,
              { path: '/oilsell', title: 'Oil Sales', icon: 'oil_barrel' }
            ].filter(Boolean)
          }
        ]
      });

      this.menuSections = sections;
    }
  }

  initScrollbar() {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      // Small timeout to allow DOM to render the list before initializing perfect-scrollbar
      setTimeout(() => {
        const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
        if (elemSidebar) {
          this.ps = new PerfectScrollbar(elemSidebar);
        }
      }, 100);
    }
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
  updatePS(): void {
    if (this.ps && window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      this.ps.update();
    }
  }
  isMac(): boolean {
    let bool = false;
    if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
      bool = true;
    }
    return bool;
  }
  expandOrCollapseMenu(id) {
    let parent = document.getElementById(id + "-p");
    let child = document.getElementById(id);
    parent.ariaExpanded = parent.ariaExpanded === "true" ? "false" : "true";
    child.style.height = child.style.height === "0px" || child.style.height === "" ? "100%" : "0";
  }
}