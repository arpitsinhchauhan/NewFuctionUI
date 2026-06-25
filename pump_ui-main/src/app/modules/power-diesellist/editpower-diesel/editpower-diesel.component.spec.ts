import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditpowerDieselComponent } from './editpower-diesel.component';

describe('EditpowerDieselComponent', () => {
  let component: EditpowerDieselComponent;
  let fixture: ComponentFixture<EditpowerDieselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditpowerDieselComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditpowerDieselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
