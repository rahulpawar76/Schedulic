import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingrulesComponent } from './bookingrules.component';

describe('BookingrulesComponent', () => {
  let component: BookingrulesComponent;
  let fixture: ComponentFixture<BookingrulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingrulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingrulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
