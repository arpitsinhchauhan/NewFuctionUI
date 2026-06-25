import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPowerDieselStockComponent } from './add-power-diesel-stock.component';

describe('AddPowerDieselStockComponent', () => {
  let component: AddPowerDieselStockComponent;
  let fixture: ComponentFixture<AddPowerDieselStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPowerDieselStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPowerDieselStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
