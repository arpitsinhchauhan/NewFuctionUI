import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieselSellReportComponent } from './diesel-sell-report.component';

describe('DieselSellReportComponent', () => {
  let component: DieselSellReportComponent;
  let fixture: ComponentFixture<DieselSellReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DieselSellReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DieselSellReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
