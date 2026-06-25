import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpowerDieselComponent } from './addpower-diesel.component';

describe('AddpowerDieselComponent', () => {
  let component: AddpowerDieselComponent;
  let fixture: ComponentFixture<AddpowerDieselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddpowerDieselComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddpowerDieselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
