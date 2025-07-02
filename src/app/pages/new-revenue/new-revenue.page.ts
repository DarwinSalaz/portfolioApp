import { Component, OnInit } from '@angular/core';
import { Revenue, Wallet } from 'src/app/interfaces/interfaces';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { RevenueService } from 'src/app/services/revenue.service';
import { NavController } from '@ionic/angular';
import { WalletService } from 'src/app/services/wallet.service';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-revenue',
  templateUrl: './new-revenue.page.html',
  styleUrls: ['./new-revenue.page.scss'],
})
export class NewRevenuePage implements OnInit {

  selectedWallet: Wallet = null;

  wallets: Wallet[] = [];

  revenue: Revenue = {
    revenue_type: '',
    value: 0,
    revenue_date: '',
    justification: null,
    wallet_id: 0
  }

  loading: boolean = true;

  revenueValue: number = 0

  constructor(
    private uiService: UiServiceService,
    private revenueService: RevenueService,
    private navCtrl: NavController,
    private walletService: WalletService,
    private storage: Storage,
    public activatedRoute: ActivatedRoute
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
          this.selectedWallet = this.wallets.filter(wallet => wallet.wallet_id == this.revenue.wallet_id)[0];
          console.log( this.selectedWallet );
          this.loading =false;
        });
  }

  async register(fRegistro: NgForm) {
    if ( fRegistro.invalid ) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }

    this.revenue.revenue_date = this.revenue.revenue_date.split('.')[0]
    this.revenue.value = this.revenueValue
    this.loading = true;
    const valido = await this.revenueService.registerRevenue(this.revenue);

    this.loading =false;
    if ( valido ) {
      this.uiService.InfoAlert('Ingreso registrado');
      this.navCtrl.navigateRoot( '/menu', { animated: true } );
    } else {
      this.uiService.InfoAlert('Error al registrar el ingreso');
    }
  }

  walletChange(event) {
    console.log('eventtvalue:', event.value);
    this.revenue.wallet_id = event.value.wallet_id;
  }

  focus(event) {
    this.revenue.value = this.revenueValue;
    this.revenueValue = null;
  }

  focusOut(event) {
    if (this.revenueValue == null || this.revenueValue === 0 ) {
      this.revenueValue = this.revenue.value;
    } else {
      this.revenue.value = this.revenueValue;
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
    this.revenueValue = numericValue;
  }

}
