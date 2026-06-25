import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackPageComponent } from './back-page.component';

describe('BackPageComponent', () => {
  let component: BackPageComponent;
  let fixture: ComponentFixture<BackPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
