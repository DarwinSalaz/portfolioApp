import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Expense, ExpenseResume } from '../interfaces/interfaces';
import { Storage } from '@ionic/storage';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor( 
    private http: HttpClient,
    private storage: Storage 
  ) { }

  async registerExpense(expense: Expense) {
    console.log( expense );

    const token = await this.storage.get('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: token
      })
    };

    return new Promise( resolve => {
      this.http.post(`${ URL }/api/portfolio/expense/create`, expense, httpOptions )
      .subscribe( resp => {
        console.log(resp);

        if ( resp['expense_id'] ) {
          resolve(true);
        } else {
          resolve(false);
        }

      });
    });
  }

  getExpensesByUser(cashControlId: number) {
    
    return this.http.get<ExpenseResume[]>(`${ URL }/api/portfolio/expenses-by-control/${cashControlId}`);
  }
}
