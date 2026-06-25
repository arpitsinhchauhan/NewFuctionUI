import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditTypeComponent } from './credit-type.component';

describe('CreditTypeComponent', () => {
  let component: CreditTypeComponent;
  let fixture: ComponentFixture<CreditTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
