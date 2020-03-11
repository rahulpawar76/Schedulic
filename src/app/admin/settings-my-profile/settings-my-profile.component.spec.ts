import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsMyProfileComponent } from './settings-my-profile.component';

describe('SettingsMyProfileComponent', () => {
  let component: SettingsMyProfileComponent;
  let fixture: ComponentFixture<SettingsMyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsMyProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsMyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
