import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPowerDieselgattComponent } from './add-power-dieselgatt.component';

describe('AddPowerDieselgattComponent', () => {
  let component: AddPowerDieselgattComponent;
  let fixture: ComponentFixture<AddPowerDieselgattComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPowerDieselgattComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPowerDieselgattComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
