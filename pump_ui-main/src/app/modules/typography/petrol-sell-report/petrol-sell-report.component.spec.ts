import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetrolSellReportComponent } from './petrol-sell-report.component';

describe('PetrolSellReportComponent', () => {
  let component: PetrolSellReportComponent;
  let fixture: ComponentFixture<PetrolSellReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PetrolSellReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetrolSellReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
