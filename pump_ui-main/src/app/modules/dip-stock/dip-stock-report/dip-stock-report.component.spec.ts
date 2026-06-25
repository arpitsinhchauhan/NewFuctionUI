import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DipStockReportComponent } from './dip-stock-report.component';

describe('DipStockReportComponent', () => {
  let component: DipStockReportComponent;
  let fixture: ComponentFixture<DipStockReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DipStockReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DipStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
