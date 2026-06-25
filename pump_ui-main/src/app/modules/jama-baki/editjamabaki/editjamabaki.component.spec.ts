import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditjamabakiComponent } from './editjamabaki.component';

describe('EditjamabakiComponent', () => {
  let component: EditjamabakiComponent;
  let fixture: ComponentFixture<EditjamabakiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditjamabakiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditjamabakiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
