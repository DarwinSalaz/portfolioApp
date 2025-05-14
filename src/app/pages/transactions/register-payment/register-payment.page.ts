import { Component, OnInit } from '@angular/core';
import { Payment, ServicesByCustomerResponse } from '../../../interfaces/interfaces';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { UiServiceService } from '../../../services/ui-service.service';
import { NavController } from '@ionic/angular';
import { NavServiceService } from '../../../services/nav-service.service';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-register-payment',
  templateUrl: './register-payment.page.html',
  styleUrls: ['./register-payment.page.scss'],
})
export class RegisterPaymentPage implements OnInit {

  showAbonarButton: Boolean = false;
  showCancelButton: Boolean = false;
  public minDate = moment().format();
  public maxDate = moment().add(40, 'd').format();

  loading: boolean = true;

  quantity_of_fees: number = 0
  fee_value: number = 0
  isDisabled: boolean = true;

  service: ServicesByCustomerResponse = {
    service_value: '0',
    down_payment: '0',
    discount: '0',
    total_value: '0',
    debt: '0',
    wallet_id: 0,
    customer_id: 0,
    state: '',
    created_at: '',
    days_per_fee: 0,
    quantity_of_fees: 0,
    fee_value: '',
    debt_in_number: 0,
    service_products: [],
    pending_value: null,
    total_value_number: 0,
    down_payment_number: 0,
  };

  registerPayment: Payment = {
    service_id: 0,
    value: 0,
    next_payment_date: null
  };

  registerPaymentInput: Payment = {
    service_id: 0,
    value: 0,
    next_payment_date: null
  };

  constructor(public activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private uiService: UiServiceService,
    private navCtrl: NavController,
    private storage: Storage,
    private transactionService: TransactionService,
    public navService: NavServiceService) {
  }

  ngOnInit() {
    this.init();
  }

  async init() {
    console.log('esta es la fecha máxima' + this.maxDate)
    let userProfileId = await this.storage.get('user_profile_id');

    if (userProfileId !== 2) {
      this.showAbonarButton = true;
    }

    if (userProfileId === 1) {
      this.showCancelButton = true
    }


    this.service = this.navService.myParam;
    this.registerPayment.service_id = this.service.service_id;
    this.quantity_of_fees = this.service.quantity_of_fees
    console.log(this.registerPayment);

    this.loading = false;

    if (this.service.pending_value !== null) {
      this.uiService.InfoAlert('Valor pendiente: ' + this.service.pending_value);
      return;
    }
  }

  async register(fRegistro: NgForm) {

    if (fRegistro.invalid) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }

    this.registerPayment.value = this.registerPaymentInput.value

    if (this.registerPayment.value > this.service.debt_in_number) {
      this.uiService.InfoAlert('Valor de cuota no puede ser mayor a la deuda');
      return;
    }

    this.registerPayment.next_payment_date = this.registerPayment.next_payment_date.split('.')[0]
    this.loading = true;
    const valido = await this.paymentService.registerPayment(this.registerPayment);

    this.loading = false;
    if (valido) {
      let date = await this.storage.get('date_to_find');
      this.uiService.InfoAlert('Abono registrado');
      this.navService.myParam = this.service;
      if (date) {
        await this.storage.set('date_to_find', null);
        this.navCtrl.navigateBack('/transaction-by-date?date=' + date, { animated: true });
      } else {
        this.navCtrl.navigateBack('/transaction-by-user?customer_id=' + this.service.customer_id, { animated: true });
      }
    } else {
      this.uiService.InfoAlert('Error al registrar el pago');
    }

  }

  async showDetail() {
    var serviceDetail = "<b>* Productos:</b> <br>"
    var productNames = this.service.service_products.map(function (item) {
      return "&nbsp;&nbsp;- " + item['name'];
    }).join('<br>');
    serviceDetail = serviceDetail + productNames;
    if (this.service.observations) {
      serviceDetail = serviceDetail + " <br><br> <b>* Observaciones:</b> <br>&nbsp;&nbsp;" + this.service.observations
    }

    this.uiService.InfoAlert(serviceDetail);
  }

  async showPayments() {
    this.navCtrl.navigateForward('/payments-service')
  }

  async cancelService() {
    this.navCtrl.navigateForward('/cancel-service')
  }

  feeChanges(event: any) {
    console.log('Nuevo valor:', this.quantity_of_fees);
    if (!this.quantity_of_fees || this.quantity_of_fees <= 0) {
      this.quantity_of_fees = this.service.quantity_of_fees;
      return
    } else {
      this.service.quantity_of_fees = this.quantity_of_fees
      this.fee_value = Math.ceil((this.service.total_value_number - this.service.down_payment_number) / this.quantity_of_fees);
      this.service.fee_value = this.fee_value.toString();
      this.isDisabled = false
    }
  }

  focusFeeChanges(event) {
    this.service.quantity_of_fees = this.quantity_of_fees;
    this.quantity_of_fees = null;
  }

  async updateService() {
    this.loading = true;
    const valido = await this.transactionService.updateService(this.quantity_of_fees, this.fee_value, this.service.service_id)

    this.loading = false;
    if (valido) {
      this.uiService.InfoAlert('Servicio Actualizado');
      this.navCtrl.navigateBack('/transaction-by-user?customer_id=' + this.service.customer_id, { animated: true });
    } else {
      this.uiService.InfoAlert('Error al actualizar el servicio');
    }
  }

  focus(event) {
    this.registerPayment.value = this.registerPaymentInput.value;
    this.registerPaymentInput.value = null;
  }

  focusOut(event) {
    if (this.registerPaymentInput.value == null || this.registerPaymentInput.value === 0) {
      this.registerPaymentInput.value = this.registerPayment.value;
    } else {
      this.registerPayment.value = this.registerPaymentInput.value;
    }
  }

}
