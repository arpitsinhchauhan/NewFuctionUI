import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OillBillComponent } from './oill-bill.component';

describe('OillBillComponent', () => {
  let component: OillBillComponent;
  let fixture: ComponentFixture<OillBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OillBillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OillBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
