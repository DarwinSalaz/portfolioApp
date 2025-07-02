import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Expense, ExpenseResume } from '../interfaces/interfaces';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

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
        .subscribe({
          next: (resp) => {
            console.log(resp);
            if ( resp['expense_id'] ) {
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

  getExpensesByUser(cashControlId: number) {
    
    return this.http.get<ExpenseResume[]>(`${ URL }/api/portfolio/expenses-by-control/${cashControlId}`);
  }

  async getExpenses(walletId: number, startDate?: string, endDate?: string, expenseType?: string): Promise<Observable<Expense[]>> {
    const token = await this.storage.get('token');

    let params = `?wallet_id=${walletId}`;
    
    if (startDate) {
      params += `&start_date=${startDate}`;
    }
    
    if (endDate) {
      params += `&end_date=${endDate}`;
    }
    
    if (expenseType) {
      params += `&expense_type=${encodeURIComponent(expenseType)}`;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };

    return Promise.resolve(this.http.get<Expense[]>(`${URL}/api/portfolio/expense/list${params}`, httpOptions));
  }

  async deleteExpense(expenseId: number): Promise<boolean> {
    const token = await this.storage.get('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    };

    return new Promise(resolve => {
      this.http.delete(`${URL}/api/portfolio/expense/delete/${expenseId}`, httpOptions)
        .subscribe({
          next: (resp) => {
            console.log('Expense deleted:', resp);
            resolve(true);
          },
          error: (err) => {
            console.error('Error deleting expense:', err);
            resolve(false);
          }
        });
    });
  }
}
