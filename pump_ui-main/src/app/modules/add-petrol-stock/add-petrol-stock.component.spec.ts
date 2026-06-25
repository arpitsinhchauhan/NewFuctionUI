import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPetrolStockComponent } from './add-petrol-stock.component';

describe('AddPetrolStockComponent', () => {
  let component: AddPetrolStockComponent;
  let fixture: ComponentFixture<AddPetrolStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPetrolStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPetrolStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
