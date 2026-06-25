import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPetrolsellComponent } from './edit-petrolsell.component';

describe('EditPetrolsellComponent', () => {
  let component: EditPetrolsellComponent;
  let fixture: ComponentFixture<EditPetrolsellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPetrolsellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPetrolsellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
