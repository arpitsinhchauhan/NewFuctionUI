import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtmTransactionPdfExcelComponent } from './atm-transaction-pdf-excel.component';

describe('AtmTransactionPdfExcelComponent', () => {
  let component: AtmTransactionPdfExcelComponent;
  let fixture: ComponentFixture<AtmTransactionPdfExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtmTransactionPdfExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtmTransactionPdfExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
