import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PumpTotalBakiDetailsComponent } from './pump-total-baki-details.component';

describe('PumpTotalBakiDetailsComponent', () => {
  let component: PumpTotalBakiDetailsComponent;
  let fixture: ComponentFixture<PumpTotalBakiDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PumpTotalBakiDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PumpTotalBakiDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
