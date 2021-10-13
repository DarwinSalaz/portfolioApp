import { Component, OnInit } from '@angular/core';
import { Customer, Wallet } from '../../../interfaces/interfaces';
import { CustomersService } from '../../../services/customers.service';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { UiServiceService } from '../../../services/ui-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletService } from 'src/app/services/wallet.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-newcustomer',
  templateUrl: './newcustomer.page.html',
  styleUrls: ['./newcustomer.page.scss'],
})
export class NewcustomerPage implements OnInit {

  selectedWallet: Wallet = null;

  wallets: Wallet[] = [];

  customerId: number;

  isUpdate: boolean = false;

  loading: boolean = true;

  registerCustomer: Customer = {
    company_id: 1,
    name: '',
    last_name: '',
    cellphone: '',
    email: null,
    address: '',
    identification_number: '',
    active: true,
    gender: '',
    observation: null,
    wallet_id: null
  };

  constructor(private customersService: CustomersService,
              private navCtrl: NavController,
              private uiService: UiServiceService, 
              public activatedRoute: ActivatedRoute,
              public router: Router,
              private walletService: WalletService,
              private storage: Storage) { 
      
      
      this.activatedRoute.queryParams.subscribe((res) => {
        console.log(res);
        
        if (res.customer_id) {
          this.customerId = res.customer_id;
          this.isUpdate = true;
          this.getCustomer()
        } else {
          this.isUpdate = false;
          this.loading =false;
        }
      });

      this.init();
  }

  ngOnInit() {
  }

  async init() {
    const walletIds = await this.storage.get('wallet_ids');

    this.walletService.getWallets(walletIds)
        .subscribe( resp => {
          //console.log( resp );
          this.wallets = resp;
          console.log( this.wallets );
          this.selectedWallet = this.wallets.filter(wallet => wallet.wallet_id == this.registerCustomer.wallet_id)[0];
          console.log( this.selectedWallet );
        });
  }

  async verCuentas() {
    this.router.navigate(['/transaction-by-user'], {
      queryParams: { customer_id : this.customerId }
    });
  }

  async register(fRegistro: NgForm) {

    if ( fRegistro.invalid ) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }

    var valido;

    if(!this.isUpdate) {
      valido = await this.customersService.registerCustomer(this.registerCustomer);
    } else {
      valido = await this.customersService.updateCustomer(this.registerCustomer);
    }

    if ( valido ) {
      // navegar al tabs
      this.uiService.InfoAlert('Registro exitoso');
      this.navCtrl.navigateRoot( '/menu', { animated: true } );
    } else {
      this.uiService.InfoAlert('Error al guardar el cliente');
    }
  }

  async getCustomer() {

    this.customersService.getCustomer(this.customerId)
      .subscribe(resp => {
        this.registerCustomer = resp
        this.loading = false;
      })
  }

  checkWallet(wallet: Wallet) {
    return wallet.wallet_id == 1;
  }

  walletChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('eventtvalue:', event.value);
    this.registerCustomer.wallet_id = event.value.wallet_id;
  }

}
