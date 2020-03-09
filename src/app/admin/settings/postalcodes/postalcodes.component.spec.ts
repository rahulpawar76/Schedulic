import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostalcodesComponent } from './postalcodes.component';

describe('PostalcodesComponent', () => {
  let component: PostalcodesComponent;
  let fixture: ComponentFixture<PostalcodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostalcodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostalcodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
