import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDieselStockComponent } from './add-diesel-stock.component';

describe('AddDieselStockComponent', () => {
  let component: AddDieselStockComponent;
  let fixture: ComponentFixture<AddDieselStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDieselStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDieselStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
