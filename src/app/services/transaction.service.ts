import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Service, ServicesByCustomerResponse, WalletRequest, CustomerServiceSchedule } from '../interfaces/interfaces';
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
        customerid: customerId
      })
    };

    return this.http.get<ServicesByCustomerResponse[]>(`${ URL }/api/portfolio/service/services_by_customer`, httpOptions);
  }

  getServicesByDate(date: string, walletIds: number[] = []) {

    const request: WalletRequest = {
      wallet_ids: walletIds,
      date: date
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<CustomerServiceSchedule[]>(`${ URL }/api/portfolio/service/services_schedule`, request, httpOptions);
  }
}
