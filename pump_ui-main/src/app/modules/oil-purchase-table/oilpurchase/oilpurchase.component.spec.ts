import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OilpurchaseComponent } from './oilpurchase.component';

describe('OilpurchaseComponent', () => {
  let component: OilpurchaseComponent;
  let fixture: ComponentFixture<OilpurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OilpurchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OilpurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
