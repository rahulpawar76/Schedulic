import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontbookingComponent } from './frontbooking.component';

describe('FrontbookingComponent', () => {
  let component: FrontbookingComponent;
  let fixture: ComponentFixture<FrontbookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontbookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontbookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
