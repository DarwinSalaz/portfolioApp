import { Injectable } from '@angular/core';
import { CashControl, CashMovement, Product, Service, ServicesByCustomerResponse } from '../interfaces/interfaces';
import { PaymentResumeDto } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class NavServiceService {

  myParam: ServicesByCustomerResponse;

  cashControlToClose: CashControl;

  productToEdit: Product;

  listTransactionsCC: CashMovement[];

  newService: Service;

  paymentToCancel: PaymentResumeDto;

  constructor() { }
}
