import { Injectable } from '@angular/core';
import { CashControl, ServicesByCustomerResponse } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class NavServiceService {

  myParam: ServicesByCustomerResponse;

  cashControlToClose: CashControl;

  constructor() { }
}
