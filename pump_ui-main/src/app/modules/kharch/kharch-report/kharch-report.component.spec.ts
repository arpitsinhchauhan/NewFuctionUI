import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KharchReportComponent } from './kharch-report.component';

describe('KharchReportComponent', () => {
  let component: KharchReportComponent;
  let fixture: ComponentFixture<KharchReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KharchReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KharchReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
