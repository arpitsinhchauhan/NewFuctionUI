import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OilPurchaseTableComponent } from './oil-purchase-table.component';

describe('OilPurchaseTableComponent', () => {
  let component: OilPurchaseTableComponent;
  let fixture: ComponentFixture<OilPurchaseTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OilPurchaseTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OilPurchaseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
