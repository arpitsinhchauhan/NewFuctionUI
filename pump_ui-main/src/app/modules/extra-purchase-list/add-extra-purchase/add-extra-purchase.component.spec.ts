import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExtraPurchaseComponent } from './add-extra-purchase.component';

describe('AddExtraPurchaseComponent', () => {
  let component: AddExtraPurchaseComponent;
  let fixture: ComponentFixture<AddExtraPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExtraPurchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExtraPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
