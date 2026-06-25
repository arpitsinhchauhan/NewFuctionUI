import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OilSellPdfExcelComponent } from './oil-sell-pdf-excel.component';

describe('OilSellPdfExcelComponent', () => {
  let component: OilSellPdfExcelComponent;
  let fixture: ComponentFixture<OilSellPdfExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OilSellPdfExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OilSellPdfExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
