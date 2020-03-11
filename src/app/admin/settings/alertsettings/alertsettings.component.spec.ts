import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertsettingsComponent } from './alertsettings.component';

describe('AlertsettingsComponent', () => {
  let component: AlertsettingsComponent;
  let fixture: ComponentFixture<AlertsettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertsettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
