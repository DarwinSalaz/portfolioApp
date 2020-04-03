import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CashControl } from '../interfaces/interfaces';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class CashcontrolService {

  constructor( private http: HttpClient, private storage: Storage ) { }

  async getActiveCashControl() {

    const token = await this.storage.get('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: token
      })
    };

    return this.http.get<CashControl>(`${ URL }/api/portfolio/cash_control/active`, httpOptions);
  }
}
