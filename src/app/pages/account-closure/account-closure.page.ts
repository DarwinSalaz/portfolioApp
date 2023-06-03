import { Component, OnInit } from '@angular/core';
import { CashControl, AccountClosureInfo } from '../../interfaces/interfaces';
import { NavServiceService } from '../../services/nav-service.service';
import { NgForm } from '@angular/forms';
import { UiServiceService } from '../../services/ui-service.service';
import { CashcontrolService } from 'src/app/services/cashcontrol.service';
import { NavController } from '@ionic/angular';

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

  constructor(
    public navService: NavServiceService,
    private cashControlService: CashcontrolService,
    private navCtrl: NavController,
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
