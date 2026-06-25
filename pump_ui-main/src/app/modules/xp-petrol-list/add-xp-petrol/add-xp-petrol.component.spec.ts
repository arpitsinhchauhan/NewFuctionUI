import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddXpPetrolComponent } from './add-xp-petrol.component';

describe('AddXpPetrolComponent', () => {
  let component: AddXpPetrolComponent;
  let fixture: ComponentFixture<AddXpPetrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddXpPetrolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddXpPetrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
