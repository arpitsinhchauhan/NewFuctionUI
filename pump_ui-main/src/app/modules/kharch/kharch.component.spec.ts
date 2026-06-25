import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KharchComponent } from './kharch.component';

describe('KharchComponent', () => {
  let component: KharchComponent;
  let fixture: ComponentFixture<KharchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KharchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KharchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
