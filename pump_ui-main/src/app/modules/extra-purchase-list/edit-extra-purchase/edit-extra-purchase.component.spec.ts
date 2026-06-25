import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExtraPurchaseComponent } from './edit-extra-purchase.component';

describe('EditExtraPurchaseComponent', () => {
  let component: EditExtraPurchaseComponent;
  let fixture: ComponentFixture<EditExtraPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditExtraPurchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditExtraPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
