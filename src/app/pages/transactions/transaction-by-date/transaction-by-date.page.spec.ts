import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionByDatePage } from './transaction-by-date.page';

describe('TransactionByDatePage', () => {
  let component: TransactionByDatePage;
  let fixture: ComponentFixture<TransactionByDatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionByDatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionByDatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
