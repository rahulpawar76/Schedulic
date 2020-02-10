import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteAttendeesComponent } from './invite-attendees.component';

describe('InviteAttendeesComponent', () => {
  let component: InviteAttendeesComponent;
  let fixture: ComponentFixture<InviteAttendeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteAttendeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteAttendeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
