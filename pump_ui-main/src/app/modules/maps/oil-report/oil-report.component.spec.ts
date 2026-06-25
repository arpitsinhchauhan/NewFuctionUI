import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OilReportComponent } from './oil-report.component';

describe('OilReportComponent', () => {
  let component: OilReportComponent;
  let fixture: ComponentFixture<OilReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OilReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OilReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
