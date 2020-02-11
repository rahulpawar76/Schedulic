import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkProfileComponent } from './work-profile.component';

describe('WorkProfileComponent', () => {
  let component: WorkProfileComponent;
  let fixture: ComponentFixture<WorkProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
