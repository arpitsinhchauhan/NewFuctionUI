import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JamabakiPdfExcelComponent } from './jamabaki-pdf-excel.component';

describe('JamabakiPdfExcelComponent', () => {
  let component: JamabakiPdfExcelComponent;
  let fixture: ComponentFixture<JamabakiPdfExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JamabakiPdfExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JamabakiPdfExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
