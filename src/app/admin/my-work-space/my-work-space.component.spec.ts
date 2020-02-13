import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWorkSpaceComponent } from './my-work-space.component';

describe('MyWorkSpaceComponent', () => {
  let component: MyWorkSpaceComponent;
  let fixture: ComponentFixture<MyWorkSpaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyWorkSpaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWorkSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
