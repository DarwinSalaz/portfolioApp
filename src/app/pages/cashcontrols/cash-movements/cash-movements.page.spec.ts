import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashMovementsPage } from './cash-movements.page';

describe('CashMovementsPage', () => {
  let component: CashMovementsPage;
  let fixture: ComponentFixture<CashMovementsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashMovementsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashMovementsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
