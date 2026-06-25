import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieselSellPdfExcelComponent } from './diesel-sell-pdf-excel.component';

describe('DieselSellPdfExcelComponent', () => {
  let component: DieselSellPdfExcelComponent;
  let fixture: ComponentFixture<DieselSellPdfExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DieselSellPdfExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DieselSellPdfExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
