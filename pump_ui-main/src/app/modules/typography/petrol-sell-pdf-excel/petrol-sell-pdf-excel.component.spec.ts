import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetrolSellPdfExcelComponent } from './petrol-sell-pdf-excel.component';

describe('PetrolSellPdfExcelComponent', () => {
  let component: PetrolSellPdfExcelComponent;
  let fixture: ComponentFixture<PetrolSellPdfExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PetrolSellPdfExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetrolSellPdfExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
