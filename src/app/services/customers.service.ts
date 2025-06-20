import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RespuestaCustomers, Customer, WalletRequest, CustomerResponse } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  paginaCustomers = -1;

  constructor( private http: HttpClient ) { }

  getCustomers(pull: boolean = false, size: number = -1, walletIds: number[] = []) {
    console.log("aqui prroo 22 " + walletIds)
    console.log( '[Customers-service] init getApplicationUsers' );

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
            resolve(resp['customer_id']);
          } else {
            resolve(null);
          }

        });
      });
  }
  
  registerCustomer(customer: Customer, headers: any = {}): Promise<CustomerResponse> {
    return new Promise(resolve => {
      this.http.post(`${URL}/api/portfolio/customer/create`, customer, { observe: 'response', headers })
        .subscribe(response => {
          const body: any = response.body;
          const status = response.status;

          console.log(response);

          const customer_id = body && body.customer_id ? body.customer_id : null;
          const isNew = status === 201;

          resolve({ customer_id, isNew, status, body });
        }, error => {
          resolve({ error: true, status: error.status, body: error.error });
        });
    });
  }

}
