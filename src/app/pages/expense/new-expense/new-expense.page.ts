import { Component, OnInit } from '@angular/core';
import { Expense, Wallet } from 'src/app/interfaces/interfaces';
import { NgForm } from '@angular/forms';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { ExpenseService } from 'src/app/services/expense.service';
import { NavController } from '@ionic/angular';
import { WalletService } from 'src/app/services/wallet.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-new-expense',
  templateUrl: './new-expense.page.html',
  styleUrls: ['./new-expense.page.scss'],
})
export class NewExpensePage implements OnInit {

  selectedWallet: Wallet = null;

  wallets: Wallet[] = [];

  expense: Expense = {
    expense_type: '',
    value: 0,
    expense_date: '',
    justification: null,
    wallet_id: 0
  }

  constructor(
    private uiService: UiServiceService,
    private expenseService: ExpenseService,
    private navCtrl: NavController,
    private walletService: WalletService,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.init();
  }

  async init() {
    const walletIds = await this.storage.get('wallet_ids');

    this.walletService.getWallets(walletIds)
        .subscribe( resp => {
          //console.log( resp );
          this.wallets = resp;
          console.log( this.wallets );
          this.selectedWallet = this.wallets.filter(wallet => wallet.wallet_id == this.expense.wallet_id)[0];
          console.log( this.selectedWallet );
        });
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

  walletChange(event) {
    console.log('eventtvalue:', event.value);
    this.expense.wallet_id = event.value.wallet_id;
  }

}
