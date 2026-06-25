import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraPurchasePdfExcelComponent } from './extra-purchase-pdf-excel.component';

describe('ExtraPurchasePdfExcelComponent', () => {
  let component: ExtraPurchasePdfExcelComponent;
  let fixture: ComponentFixture<ExtraPurchasePdfExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtraPurchasePdfExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraPurchasePdfExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
