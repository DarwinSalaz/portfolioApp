import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRevenuePage } from './new-revenue.page';

describe('NewRevenuePage', () => {
  let component: NewRevenuePage;
  let fixture: ComponentFixture<NewRevenuePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRevenuePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRevenuePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
