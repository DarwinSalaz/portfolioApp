import { Component, OnInit } from '@angular/core';
import { Service, Payment, ServicesByCustomerResponse } from '../../../interfaces/interfaces';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { UiServiceService } from '../../../services/ui-service.service';
import { NavController } from '@ionic/angular';
import { NavServiceService } from '../../../services/nav-service.service';

@Component({
  selector: 'app-register-payment',
  templateUrl: './register-payment.page.html',
  styleUrls: ['./register-payment.page.scss'],
})
export class RegisterPaymentPage implements OnInit {

  service: ServicesByCustomerResponse = {
    service_value: '0',
    down_payment: '0',
    discount: '0',
    total_value: '0',
    debt: '0',
    wallet_id: 1,
    customer_id: 1,
    state: 'init',
    created_at: '',
    days_per_fee: 0,
    quantity_of_fees: 0,
    fee_value: '',
    debt_in_number: 0
  };

  registerPayment: Payment = {
    service_id: 0,
    value: 0,
    next_payment_date: null
  };

  constructor(public activatedRoute: ActivatedRoute,
              private paymentService: PaymentService,
              private uiService: UiServiceService,
              private navCtrl: NavController,
              public navService: NavServiceService) {
  }

  ngOnInit() {
    this.service = this.navService.myParam;
    this.registerPayment.service_id = this.service.service_id;
    console.log(this.registerPayment);
  }

  async register(fRegistro: NgForm) {

    if ( fRegistro.invalid ) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }

    if ( this.registerPayment.value > this.service.debt_in_number ) {
      this.uiService.InfoAlert('Valor de cuota no puede ser mayor a la deuda');
      return;
    }

    this.registerPayment.next_payment_date = this.registerPayment.next_payment_date.split('.')[0]
    const valido = await this.paymentService.registerPayment(this.registerPayment);

    if ( valido ) {
      this.uiService.InfoAlert('Servicio finalizado');
      this.navCtrl.navigateRoot( '/menu', { animated: true } );
    } else {
      this.uiService.InfoAlert('Error al guardar el cliente');
    }

  }

}
