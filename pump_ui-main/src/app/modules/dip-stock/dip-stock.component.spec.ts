import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DipStockComponent } from './dip-stock.component';

describe('DipStockComponent', () => {
  let component: DipStockComponent;
  let fixture: ComponentFixture<DipStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DipStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DipStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
