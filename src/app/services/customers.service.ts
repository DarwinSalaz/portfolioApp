import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RespuestaCustomers, Customer, WalletRequest } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  paginaCustomers = -1;

  constructor( private http: HttpClient ) { }

  getCustomers(pull: boolean = false, size: number = -1, walletIds: number[] = []) {
    console.log("aqui prroo 22 " + walletIds)

    const request: WalletRequest = {
      wallet_ids: walletIds
    }

    let sizeStr = '';

    if ( pull ) {
      this.paginaCustomers = -1;
    }

    if ( size > 0 ) {
      sizeStr = `&size=${size}`;
    }

    this.paginaCustomers ++;

    return this.http.post<RespuestaCustomers>(`${ URL }/api/portfolio/customer?page=${this.paginaCustomers}${sizeStr}&sort=name,asc`, request);

  }

  getCustomer(customerId: number) {

    return this.http.get<Customer>(`${ URL }/api/portfolio/customer/${customerId}`);

  }

  updateCustomer(customer: Customer) {
    console.log( customer );

    return new Promise( resolve => {
      this.http.put(`${ URL }/api/portfolio/customer/${customer.customer_id}`, customer )
        .subscribe( resp => {
          console.log(resp);

          if ( resp['customer_id'] ) {
            resolve(true);
          } else {
            resolve(false);
          }

        });
      });
  }
  
  registerCustomer(customer: Customer) {
    console.log( customer );

    return new Promise( resolve => {
      this.http.post(`${ URL }/api/portfolio/customer/create`, customer )
        .subscribe( resp => {
          console.log(resp);

          if ( resp['customer_id'] ) {
            resolve(true);
          } else {
            resolve(false);
          }

        });
      });
  }
}
