import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountClosurePage } from './account-closure.page';

describe('AccountClosurePage', () => {
  let component: AccountClosurePage;
  let fixture: ComponentFixture<AccountClosurePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountClosurePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountClosurePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
