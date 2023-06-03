import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseResume } from 'src/app/interfaces/interfaces';
import { ExpenseService } from 'src/app/services/expense.service';
import { UiServiceService } from '../../../services/ui-service.service';

@Component({
  selector: 'app-show-expenses',
  templateUrl: './show-expenses.page.html',
  styleUrls: ['./show-expenses.page.scss'],
})
export class ShowExpensesPage implements OnInit {

  cashControlId: number = 0
  expenses: ExpenseResume[] = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private expenseService: ExpenseService,
    private uiService: UiServiceService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((res) => {
      console.log(res);
      this.cashControlId = res.cash_control_id;
    });

    this.expenseService.getExpensesByUser(this.cashControlId)
        .subscribe( resp => {
          this.expenses = resp;
        });
  }

  async getDetail(expense: ExpenseResume) {
    if (expense.justification) {
      this.uiService.InfoAlert('<b>* Justificación</b><br>' + expense.justification);
    } else {
      this.uiService.InfoAlert('No hay detalle del gasto');
    }
    
  }

}
