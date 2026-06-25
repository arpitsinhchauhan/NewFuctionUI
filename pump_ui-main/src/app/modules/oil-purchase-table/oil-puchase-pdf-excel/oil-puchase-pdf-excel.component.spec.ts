import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OilPuchasePdfExcelComponent } from './oil-puchase-pdf-excel.component';

describe('OilPuchasePdfExcelComponent', () => {
  let component: OilPuchasePdfExcelComponent;
  let fixture: ComponentFixture<OilPuchasePdfExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OilPuchasePdfExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OilPuchasePdfExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
