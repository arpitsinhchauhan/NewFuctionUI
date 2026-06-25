import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuchasePdfExcelComponent } from './puchase-pdf-excel.component';

describe('PuchasePdfExcelComponent', () => {
  let component: PuchasePdfExcelComponent;
  let fixture: ComponentFixture<PuchasePdfExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuchasePdfExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuchasePdfExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
