import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerExcelPdfComponent } from './customer-excel-pdf.component';

describe('CustomerExcelPdfComponent', () => {
  let component: CustomerExcelPdfComponent;
  let fixture: ComponentFixture<CustomerExcelPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerExcelPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerExcelPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
