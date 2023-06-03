import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWalletsPage } from './list-wallets.page';

describe('ListWalletsPage', () => {
  let component: ListWalletsPage;
  let fixture: ComponentFixture<ListWalletsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListWalletsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWalletsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
