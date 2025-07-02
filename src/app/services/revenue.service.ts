import { Injectable } from '@angular/core';
import { Revenue } from '../interfaces/interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

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

  async getRevenues(walletId: number, startDate?: string, endDate?: string, revenueType?: string): Promise<Observable<Revenue[]>> {
    const token = await this.storage.get('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };

    // Construir parámetros de consulta
    let params = `wallet_id=${walletId}`;
    if (startDate) params += `&start_date=${startDate}`;
    if (endDate) params += `&end_date=${endDate}`;
    if (revenueType) params += `&revenue_type=${encodeURIComponent(revenueType)}`;

    return new Promise((resolve) => {
      resolve(
        this.http.get<Revenue[]>(`${URL}/api/portfolio/revenue/list?${params}`, httpOptions)
      );
    });
  }

  async deleteRevenue(revenueId: number): Promise<boolean> {
    const token = await this.storage.get('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };

    return new Promise(resolve => {
      this.http.delete(`${URL}/api/portfolio/revenue/delete/${revenueId}`, httpOptions)
        .subscribe({
          next: (resp) => {
            console.log('Revenue deleted:', resp);
            resolve(true);
          },
          error: (err) => {
            console.error('Error deleting revenue:', err);
            resolve(false);
          }
        });
    });
  }
}
