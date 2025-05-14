import { Injectable } from '@angular/core';
import { Revenue } from '../interfaces/interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class RevenueService {

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }

  async registerRevenue(revenue: Revenue) {
    console.log( revenue );

    const token = await this.storage.get('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: token
      })
    };

    return new Promise(resolve => {
      this.http.post(`${URL}/api/portfolio/revenue/create`, revenue, httpOptions)
        .subscribe({
          next: (resp) => {
            console.log(resp);
            if (resp['revenue_id']) {
              resolve(true);
            } else {
              resolve(false);
            }
          },
          error: (err) => {
            console.error('Error en la petición:', err);
            resolve(false);
          }
        });
    });
  }
}
