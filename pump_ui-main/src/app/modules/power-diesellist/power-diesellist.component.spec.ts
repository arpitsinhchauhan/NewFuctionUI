import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerDiesellistComponent } from './power-diesellist.component';

describe('PowerDiesellistComponent', () => {
  let component: PowerDiesellistComponent;
  let fixture: ComponentFixture<PowerDiesellistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerDiesellistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerDiesellistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
