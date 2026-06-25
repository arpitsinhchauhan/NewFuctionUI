import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditXpPetrolComponent } from './edit-xp-petrol.component';

describe('EditXpPetrolComponent', () => {
  let component: EditXpPetrolComponent;
  let fixture: ComponentFixture<EditXpPetrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditXpPetrolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditXpPetrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
