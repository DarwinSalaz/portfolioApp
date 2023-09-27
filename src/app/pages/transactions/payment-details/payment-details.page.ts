import { Component, OnInit } from '@angular/core';
import { Payment, PaymentResumeDto } from '../../../interfaces/interfaces';
import { NavServiceService } from 'src/app/services/nav-service.service';
import { AlertController } from '@ionic/angular';
import { PaymentService } from '../../../services/payment.service';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.page.html',
  styleUrls: ['./payment-details.page.scss'],
})
export class PaymentDetailsPage implements OnInit {

  showCancelButton: Boolean = false;

  loading: boolean = false;

  payment: PaymentResumeDto = {
    payment_id: 0,
    value: '0',
    username: '',
    created_at: ''
  }


  constructor(
    public navService: NavServiceService,
    private storage: Storage,
    private alertController: AlertController,
    private paymentService: PaymentService,
    private uiService: UiServiceService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.init();
  }

  async init() {
    this.payment = this.navService.paymentToCancel;
    let userProfileId = await this.storage.get('user_profile_id');
  
    if (userProfileId === 1) {
      this.showCancelButton = true
    }
  }

  async cancelPayment() {
    const alert = await this.alertController.create({
      header: 'Cancelar Abono',
      message: '¿Desea cancelar el abono?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.loading = true;
            const valido = this.paymentService.cancelPayment(this.payment.payment_id)

            if (valido) {
              this.loading = false;
              this.uiService.InfoAlert('Proceso finalizado');
              this.router.navigate(['/customers/detail']);
            } else {
              this.loading = false;
              this.uiService.InfoAlert('Error al cancelar el abono');
            }
          }
        }
      ]
    });

    alert.present();
  }
}
