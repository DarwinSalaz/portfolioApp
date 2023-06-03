import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountClosureInfo, CashControl, CashMovement } from '../interfaces/interfaces';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class CashcontrolService {

  constructor( private http: HttpClient, private storage: Storage ) { }

  async getActiveCashControl(username: string = null) {

    const token = await this.storage.get('token');

    let params = '';
    if (username !== null) {
      params = `?username=${username}`;
      console.log('paramss:' + params)
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: token
      })
    };

    return this.http.get<CashControl>(`${ URL }/api/portfolio/cash_control/active${params}`, httpOptions);
  }

  async getDailyCashControl(username: string = null) {

    const token = await this.storage.get('token');

    let params = '';
    if (username !== null) {
      params = `?username=${username}`;
      console.log('paramss:' + params)
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: token
      })
    };

    return this.http.get<CashControl>(`${ URL }/api/portfolio/cash_control/daily${params}`, httpOptions);
  }

  getCashMovements(cashControlId: number) {

    return this.http.get<CashMovement[]>(`${ URL }/api/portfolio/cash_control/movements/${cashControlId}`)
  }

  getCashControlsHistory(username: string) {

    let params = '';
    if (username !== null) {
      params = `?username=${username}`;
      console.log('paramss:' + params)
    }

    return this.http.get<CashControl[]>(`${ URL }/api/portfolio/cash_control/history${params}`)
  }

  async accountClosure(account: AccountClosureInfo) {
    const token = await this.storage.get('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: token
      })
    };

    console.log( account );

    return new Promise( resolve => {
      this.http.put(`${ URL }/api/portfolio/cash_control/closure`, account, httpOptions )
      .subscribe( resp => {
        console.log(resp);

        if ( resp['ok'] === "true" ) {
          resolve(true);
        } else {
          resolve(false);
        }

      });
    });
  }
}
