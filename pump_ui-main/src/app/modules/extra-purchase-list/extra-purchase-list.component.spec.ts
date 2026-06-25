import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraPurchaseListComponent } from './extra-purchase-list.component';

describe('ExtraPurchaseListComponent', () => {
  let component: ExtraPurchaseListComponent;
  let fixture: ComponentFixture<ExtraPurchaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtraPurchaseListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraPurchaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
