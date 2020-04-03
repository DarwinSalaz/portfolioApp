import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcustomerPage } from './newcustomer.page';

describe('NewcustomerPage', () => {
  let component: NewcustomerPage;
  let fixture: ComponentFixture<NewcustomerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewcustomerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewcustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
