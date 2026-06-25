import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraDipComponent } from './extra-dip.component';

describe('ExtraDipComponent', () => {
  let component: ExtraDipComponent;
  let fixture: ComponentFixture<ExtraDipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtraDipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraDipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
