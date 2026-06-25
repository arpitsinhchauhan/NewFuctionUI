import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGattComponent } from './add-gatt.component';

describe('AddGattComponent', () => {
  let component: AddGattComponent;
  let fixture: ComponentFixture<AddGattComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGattComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGattComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
