import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDieselSellComponent } from './edit-diesel-sell.component';

describe('EditDieselSellComponent', () => {
  let component: EditDieselSellComponent;
  let fixture: ComponentFixture<EditDieselSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDieselSellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDieselSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
