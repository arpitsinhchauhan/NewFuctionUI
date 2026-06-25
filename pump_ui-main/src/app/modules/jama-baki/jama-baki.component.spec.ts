import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JamaBakiComponent } from './jama-baki.component';

describe('JamaBakiComponent', () => {
  let component: JamaBakiComponent;
  let fixture: ComponentFixture<JamaBakiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JamaBakiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JamaBakiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
