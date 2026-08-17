import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';

@Component({
  selector: 'app-company-master',
  templateUrl: './company-master.component.html',
  styleUrls: ['./company-master.component.css']
})
export class CompanyMasterComponent implements OnInit {
  companies: any[] = [];
  allCompanies: any[] = [];
  currentPage = 1;
  searchTerm: string = '';

  constructor(private dialog: MatDialog, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies() {
    this.allCompanies = [
      { id: 1, name: 'PumpManager1', database: 'pumpmanager1_db', manager: 'John Doe', email: 'john@pumpmanager1.com', phone: '9876543210', status: 'Active' },
      { id: 2, name: 'PumpManager2', database: 'pumpmanager2_db', manager: 'Jane Smith', email: 'jane@pumpmanager2.com', phone: '9876543211', status: 'Active' },
      { id: 3, name: 'EcoFuel Pump', database: 'ecofuel_db', manager: 'Robert Lee', email: 'robert@ecofuel.com', phone: '9876543212', status: 'Pending' }
    ];
    this.companies = [...this.allCompanies];
  }

  searchData() {
    if (!this.searchTerm.trim()) {
      this.companies = [...this.allCompanies];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.companies = this.allCompanies.filter(c => 
        c.name.toLowerCase().includes(term) ||
        c.database.toLowerCase().includes(term) ||
        c.manager.toLowerCase().includes(term)
      );
    }
  }

  addCompany() {
    this.notificationService.success('Add Company feature loaded');
  }

  editCompany(company: any) {
    this.notificationService.success(`Edit ${company.name} loaded`);
  }

  deleteCompany(id: any) {
    this.companies = this.companies.filter(c => c.id !== id);
    this.allCompanies = this.allCompanies.filter(c => c.id !== id);
    this.notificationService.success('Company deleted successfully');
  }
}
