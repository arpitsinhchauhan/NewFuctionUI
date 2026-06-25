import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BakiDetailsComponent } from './baki-details.component';

describe('BakiDetailsComponent', () => {
  let component: BakiDetailsComponent;
  let fixture: ComponentFixture<BakiDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BakiDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BakiDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
