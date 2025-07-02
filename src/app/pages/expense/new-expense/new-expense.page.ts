import { Component, OnInit } from '@angular/core';
import { Expense, Wallet } from 'src/app/interfaces/interfaces';
import { NgForm } from '@angular/forms';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { ExpenseService } from 'src/app/services/expense.service';
import { NavController } from '@ionic/angular';
import { WalletService } from 'src/app/services/wallet.service';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-expense',
  templateUrl: './new-expense.page.html',
  styleUrls: ['./new-expense.page.scss'],
})
export class NewExpensePage implements OnInit {

  selectedWallet: Wallet = null;
  showAllTypes = true

  wallets: Wallet[] = [];

  expense: Expense = {
    expense_type: '',
    value: 0,
    expense_date: '',
    justification: null,
    wallet_id: 0
  }

  loading: boolean = true;

  expenseValue: number = 0

  constructor(
    private uiService: UiServiceService,
    private expenseService: ExpenseService,
    private navCtrl: NavController,
    private walletService: WalletService,
    private storage: Storage,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.init();
  }

  async init() {

    let userProfileId = await this.storage.get('user_profile_id');
    if (userProfileId == 2) {
      this.showAllTypes = false
    }

    const walletIds = await this.storage.get('wallet_ids');

    this.walletService.getWallets(walletIds)
        .subscribe( resp => {
          //console.log( resp );
          this.wallets = resp;
          console.log( this.wallets );
          this.selectedWallet = this.wallets.filter(wallet => wallet.wallet_id == this.expense.wallet_id)[0];
          console.log( this.selectedWallet );
          this.loading =false;
        });
  }

  async register(fRegistro: NgForm) {

    if ( fRegistro.invalid ) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }

    this.expense.expense_date = this.expense.expense_date.split('.')[0]
    this.expense.value = this.expenseValue
    this.loading = true;
    const valido = await this.expenseService.registerExpense(this.expense);

    this.loading =false;
    if ( valido ) {
      this.uiService.InfoAlert('Gasto registrado');
      this.navCtrl.navigateRoot( '/menu', { animated: true } );
    } else {
      this.uiService.InfoAlert('Error al registrar el gasto');
    }

  }

  walletChange(event) {
    console.log('eventtvalue:', event.value);
    this.expense.wallet_id = event.value.wallet_id;
  }

  focus(event) {
    this.expense.value = this.expenseValue;
    this.expenseValue = null;
  }

  focusOut(event) {
    if (this.expenseValue == null || this.expenseValue === 0 ) {
      this.expenseValue = this.expense.value;
    } else {
      this.expense.value = this.expenseValue;
    }
  }

  // Devuelve el número con puntos de miles
  formatCurrency(value: number | string): string {
    if (!value && value !== 0) return '';
    const num = value.toString().replace(/\D/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Convierte a número limpio (sin puntos) y lo guarda en el modelo
  onCurrencyInput(event: any) {
    const rawValue = event.target.value.replace(/\./g, '');
    const numericValue = parseInt(rawValue, 10) || 0;
    this.expenseValue = numericValue;
  }

}
