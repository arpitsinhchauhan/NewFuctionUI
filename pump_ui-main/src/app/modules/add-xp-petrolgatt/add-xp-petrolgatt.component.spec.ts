import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddXpPetrolgattComponent } from './add-xp-petrolgatt.component';

describe('AddXpPetrolgattComponent', () => {
  let component: AddXpPetrolgattComponent;
  let fixture: ComponentFixture<AddXpPetrolgattComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddXpPetrolgattComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddXpPetrolgattComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
