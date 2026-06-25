import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyJamaBakiTotalComponent } from './monthly-jama-baki-total.component';

describe('MonthlyJamaBakiTotalComponent', () => {
  let component: MonthlyJamaBakiTotalComponent;
  let fixture: ComponentFixture<MonthlyJamaBakiTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyJamaBakiTotalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyJamaBakiTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
