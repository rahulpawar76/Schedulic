import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentrulesComponent } from './paymentrules.component';

describe('PaymentrulesComponent', () => {
  let component: PaymentrulesComponent;
  let fixture: ComponentFixture<PaymentrulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentrulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentrulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
