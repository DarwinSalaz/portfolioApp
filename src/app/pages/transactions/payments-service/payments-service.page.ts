import { Component, OnInit } from '@angular/core';

import { PaymentResumeDto } from '../../../interfaces/interfaces';
import { NavServiceService } from '../../../services/nav-service.service';
import { NavController } from '@ionic/angular';
import { UiServiceService } from '../../../services/ui-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payments-service',
  templateUrl: './payments-service.page.html',
  styleUrls: ['./payments-service.page.scss'],
})
export class PaymentsServicePage implements OnInit {

  payments: PaymentResumeDto[]

  constructor(
    public navService: NavServiceService,
    private navCtrl: NavController,
    private uiService: UiServiceService,
    public router: Router,
  ) { }

  ngOnInit() {
    let service = this.navService.myParam;
    this.payments = service.payments;
    if (!this.payments || this.payments.length == 0) {
      this.uiService.InfoAlert('No se han registrado abonos en este servicio');
      this.navCtrl.back();
    }
  }

  click(payment: PaymentResumeDto) {

    this.navService.paymentToCancel = payment;
    this.router.navigate(['/payment-details'], {
      queryParams: { payment_id: payment.payment_id }
    });
  }

}
