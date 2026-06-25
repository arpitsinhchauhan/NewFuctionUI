import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XpPetrolListComponent } from './xp-petrol-list.component';

describe('XpPetrolListComponent', () => {
  let component: XpPetrolListComponent;
  let fixture: ComponentFixture<XpPetrolListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XpPetrolListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XpPetrolListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
