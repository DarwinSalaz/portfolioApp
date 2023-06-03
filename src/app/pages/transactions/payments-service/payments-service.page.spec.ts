import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsServicePage } from './payments-service.page';

describe('PaymentsServicePage', () => {
  let component: PaymentsServicePage;
  let fixture: ComponentFixture<PaymentsServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsServicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
