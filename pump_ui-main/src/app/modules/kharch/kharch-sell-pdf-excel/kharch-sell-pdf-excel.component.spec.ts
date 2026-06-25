import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KharchSellPdfExcelComponent } from './kharch-sell-pdf-excel.component';

describe('KharchSellPdfExcelComponent', () => {
  let component: KharchSellPdfExcelComponent;
  let fixture: ComponentFixture<KharchSellPdfExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KharchSellPdfExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KharchSellPdfExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
