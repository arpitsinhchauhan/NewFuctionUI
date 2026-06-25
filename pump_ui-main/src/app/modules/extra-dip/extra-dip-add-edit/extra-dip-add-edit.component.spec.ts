import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraDipAddEditComponent } from './extra-dip-add-edit.component';

describe('ExtraDipAddEditComponent', () => {
  let component: ExtraDipAddEditComponent;
  let fixture: ComponentFixture<ExtraDipAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtraDipAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraDipAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
