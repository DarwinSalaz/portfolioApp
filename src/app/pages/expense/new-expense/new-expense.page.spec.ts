import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExpensePage } from './new-expense.page';

describe('NewExpensePage', () => {
  let component: NewExpensePage;
  let fixture: ComponentFixture<NewExpensePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewExpensePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewExpensePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
