import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JamaBakiReportComponent } from './jama-baki-report.component';

describe('JamaBakiReportComponent', () => {
  let component: JamaBakiReportComponent;
  let fixture: ComponentFixture<JamaBakiReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JamaBakiReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JamaBakiReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
