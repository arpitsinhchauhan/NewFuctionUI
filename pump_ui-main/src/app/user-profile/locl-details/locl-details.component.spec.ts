import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoclDetailsComponent } from './locl-details.component';

describe('LoclDetailsComponent', () => {
  let component: LoclDetailsComponent;
  let fixture: ComponentFixture<LoclDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoclDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoclDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
