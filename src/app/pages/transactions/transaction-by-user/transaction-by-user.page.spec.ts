import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionByUserPage } from './transaction-by-user.page';

describe('TransactionByUserPage', () => {
  let component: TransactionByUserPage;
  let fixture: ComponentFixture<TransactionByUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionByUserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionByUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
