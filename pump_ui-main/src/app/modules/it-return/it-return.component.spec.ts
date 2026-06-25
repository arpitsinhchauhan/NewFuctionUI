import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItReturnComponent } from './it-return.component';

describe('ItReturnComponent', () => {
  let component: ItReturnComponent;
  let fixture: ComponentFixture<ItReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItReturnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
