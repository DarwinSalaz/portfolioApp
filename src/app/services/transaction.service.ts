import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Service, ServicesByCustomerResponse } from '../interfaces/interfaces';
import { Storage } from '@ionic/storage';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient,
              private storage: Storage) { }

  async registerService(service: Service) {
    console.log( service );

    const token = await this.storage.get('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: token
      })
    };

    return new Promise( resolve => {
      this.http.post(`${ URL }/api/portfolio/service/create`, service, httpOptions )
      .subscribe( resp => {
        console.log(resp);

        if ( resp['service_id'] ) {
          resolve(true);
        } else {
          resolve(false);
        }

      });
    });
  }

  getServicesByCustomer(customerId: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        customer_id: customerId
      })
    };

    return this.http.get<ServicesByCustomerResponse[]>(`${ URL }/api/portfolio/services_by_customer`, httpOptions);
  }
}
