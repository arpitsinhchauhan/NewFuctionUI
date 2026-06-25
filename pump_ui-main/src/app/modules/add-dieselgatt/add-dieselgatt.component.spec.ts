import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDieselgattComponent } from './add-dieselgatt.component';

describe('AddDieselgattComponent', () => {
  let component: AddDieselgattComponent;
  let fixture: ComponentFixture<AddDieselgattComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDieselgattComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDieselgattComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
