import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraDipTableComponent } from './extra-dip-table.component';

describe('ExtraDipTableComponent', () => {
  let component: ExtraDipTableComponent;
  let fixture: ComponentFixture<ExtraDipTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtraDipTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraDipTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
