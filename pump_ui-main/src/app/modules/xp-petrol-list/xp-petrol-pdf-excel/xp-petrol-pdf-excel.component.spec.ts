import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XpPetrolPdfExcelComponent } from './xp-petrol-pdf-excel.component';

describe('XpPetrolPdfExcelComponent', () => {
  let component: XpPetrolPdfExcelComponent;
  let fixture: ComponentFixture<XpPetrolPdfExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XpPetrolPdfExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XpPetrolPdfExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
