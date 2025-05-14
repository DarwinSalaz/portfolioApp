import { Component, OnInit } from '@angular/core';
import { CashControl, AccountClosureInfo, Expense } from '../../interfaces/interfaces';
import { NavServiceService } from '../../services/nav-service.service';
import { NgForm } from '@angular/forms';
import { UiServiceService } from '../../services/ui-service.service';
import { CashcontrolService } from 'src/app/services/cashcontrol.service';
import { ExpenseService } from 'src/app/services/expense.service';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-account-closure',
  templateUrl: './account-closure.page.html',
  styleUrls: ['./account-closure.page.scss'],
})
export class AccountClosurePage implements OnInit {

  cashControl: CashControl = {
    full_name: '',
    cash: '',
    revenues: '',
    expenses: '',
    active: false,
    period: '',
    services_count: 0
  };

  loading: boolean = true;

  account: AccountClosureInfo = {
    cash_control_id: 0,
    commission: 0,
    closure_value_received: 0,
    closure_notes: ''
  };

  expense: Expense = {
    expense_type: '',
    value: 0,
    expense_date: '',
    justification: null,
    wallet_id: null
  }

  constructor(
    public navService: NavServiceService,
    private cashControlService: CashcontrolService,
    private navCtrl: NavController,
    private expenseService: ExpenseService,
    private storage: Storage,
    private uiService: UiServiceService
    ) { }

  ngOnInit() {
    let cashControl = this.navService.cashControlToClose;
    this.account.cash_control_id = cashControl.cash_control_id;
    this.account.expected_value = cashControl.cash;
    this.account.commission_str = cashControl.commission;
    this.account.commission = cashControl.commission_number;
    this.account.closure_value_received = cashControl.cash_number;
    this.loading =false;
  }

  async register(fRegistro: NgForm) {
    if ( fRegistro.invalid ) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }
    let cashControl = this.navService.cashControlToClose;
    
    if ( cashControl.cash_number < this.account.closure_value_received ) {
      this.uiService.InfoAlert('Valor invalido: valor mayor al saldo');
      return;
    }

    if (cashControl.cash_number > this.account.closure_value_received ) {
      const confirm = await this.uiService.ConfirmAlert('El valor recibido es menor al saldo, no se cerrará la cuenta. ¿Desea Continuar?')

      if (confirm) {
        var usernameAdmin = await this.storage.get('username')

        const currentDateTime = new Date().toISOString();
        this.expense.expense_type = 'Liquidación Parcial'
        this.expense.justification = 'Liquidación parcial realizada por el usuario: ' + usernameAdmin
        this.expense.value = this.account.closure_value_received
        this.expense.expense_date = currentDateTime
        this.expense.username = cashControl.username

        this.loading = true;

        const valido = await this.expenseService.registerExpense(this.expense);

        this.loading =false;

        if ( valido ) {
          this.uiService.InfoAlert('Liquidación parcial registrada');
          this.navCtrl.navigateRoot( '/menu', { animated: true } );
          return;
        } else {
          this.uiService.InfoAlert('Error al registrar la liquidación');
          return;
        }
      } else {
        return;
      }
    } else {
      const confirm = await this.uiService.ConfirmAlert('¿Desea confirmar la liquidación de la cuenta?')

      if (confirm) {
        this.loading = true;
        
        const valido = await this.cashControlService.accountClosure(this.account);

        this.loading =false;
        if ( valido ) {
          this.uiService.InfoAlert('Cierre de cuenta finalizado');
          this.navCtrl.navigateRoot( '/menu', { animated: true } );
        } else {
          this.uiService.InfoAlert('Error en el cierre de cuenta');
        }
      }
    }

    
    
  }

}
