import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddXpPetrolStockComponent } from './add-xp-petrol-stock.component';

describe('AddXpPetrolStockComponent', () => {
  let component: AddXpPetrolStockComponent;
  let fixture: ComponentFixture<AddXpPetrolStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddXpPetrolStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddXpPetrolStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
