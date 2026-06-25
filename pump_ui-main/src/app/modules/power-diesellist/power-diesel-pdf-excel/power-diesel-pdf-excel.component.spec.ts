import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerDieselPdfExcelComponent } from './power-diesel-pdf-excel.component';

describe('PowerDieselPdfExcelComponent', () => {
  let component: PowerDieselPdfExcelComponent;
  let fixture: ComponentFixture<PowerDieselPdfExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerDieselPdfExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerDieselPdfExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
