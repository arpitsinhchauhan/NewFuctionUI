import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DipTableComponent } from './dip-table.component';

describe('DipTableComponent', () => {
  let component: DipTableComponent;
  let fixture: ComponentFixture<DipTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DipTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DipTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
