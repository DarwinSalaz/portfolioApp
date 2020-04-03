import { Component, OnInit } from '@angular/core';
import { Expense } from 'src/app/interfaces/interfaces';
import { NgForm } from '@angular/forms';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { ExpenseService } from 'src/app/services/expense.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-new-expense',
  templateUrl: './new-expense.page.html',
  styleUrls: ['./new-expense.page.scss'],
})
export class NewExpensePage implements OnInit {

  expense: Expense = {
    expense_type: '',
    value: 0,
    expense_date: '',
    justification: null
  }

  constructor(
    private uiService: UiServiceService,
    private expenseService: ExpenseService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  async register(fRegistro: NgForm) {

    if ( fRegistro.invalid ) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }

    this.expense.expense_date = this.expense.expense_date.split('.')[0]
    const valido = await this.expenseService.registerExpense(this.expense);

    if ( valido ) {
      this.uiService.InfoAlert('Gasto registrado');
      this.navCtrl.navigateRoot( '/menu', { animated: true } );
    } else {
      this.uiService.InfoAlert('Error al guardar el cliente');
    }

  }

}
