import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Payment } from '../interfaces/interfaces';
import { environment } from '../../environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient,
              private storage: Storage) { }

  async registerPayment(registerPayment: Payment) {

    const token = await this.storage.get('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: token
      })
    };

    console.log( registerPayment );

    return new Promise( resolve => {
      this.http.post(`${ URL }/api/portfolio/payment/create`, registerPayment, httpOptions )
      .subscribe( resp => {
        console.log(resp);

        if ( resp['payment_id'] ) {
          resolve(true);
        } else {
          resolve(false);
        }

      });
    });
  }

}
