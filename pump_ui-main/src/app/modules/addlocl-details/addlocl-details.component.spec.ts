import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddloclDetailsComponent } from './addlocl-details.component';

describe('AddloclDetailsComponent', () => {
  let component: AddloclDetailsComponent;
  let fixture: ComponentFixture<AddloclDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddloclDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddloclDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
