import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelServicePage } from './cancel-service.page';

describe('CancelServicePage', () => {
  let component: CancelServicePage;
  let fixture: ComponentFixture<CancelServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelServicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
