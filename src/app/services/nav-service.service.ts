import { Injectable } from '@angular/core';
import { ServicesByCustomerResponse } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class NavServiceService {

  myParam: ServicesByCustomerResponse;

  constructor() { }
}
