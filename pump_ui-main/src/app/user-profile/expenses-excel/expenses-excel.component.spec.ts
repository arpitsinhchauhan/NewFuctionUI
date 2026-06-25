import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesExcelComponent } from './expenses-excel.component';

describe('ExpensesExcelComponent', () => {
  let component: ExpensesExcelComponent;
  let fixture: ComponentFixture<ExpensesExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpensesExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
