import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProductsPage } from './select-products.page';

describe('SelectProductsPage', () => {
  let component: SelectProductsPage;
  let fixture: ComponentFixture<SelectProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectProductsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
