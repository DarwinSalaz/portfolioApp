import { Component, Input } from '@angular/core';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { ServicesByCustomerResponse } from '../../interfaces/interfaces';
import { TransactionService } from '../../services/transaction.service';
import { UiServiceService } from '../../services/ui-service.service';
import { NavServiceService } from '../../services/nav-service.service';

@Component({
  selector: 'app-service-actions-modal',
  templateUrl: './service-actions-modal.component.html',
  styleUrls: ['./service-actions-modal.component.scss'],
})
export class ServiceActionsModalComponent {

  @Input() service: ServicesByCustomerResponse;

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private transactionService: TransactionService,
    private uiService: UiServiceService,
    private navService: NavServiceService,
    private toastCtrl: ToastController
  ) { 
    console.log('ServiceActionsModalComponent constructor llamado');
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
    this.navService.myParam = this.service;
    this.modalCtrl.dismiss({ refresh: false });
    this.navCtrl.navigateForward('/payments-service');
  }

  async cancelService() {
    this.navService.myParam = this.service;
    this.modalCtrl.dismiss({ refresh: false });
    this.navCtrl.navigateForward('/cancel-service');
  }

  async registerPayment() {
    this.navService.myParam = this.service;
    this.modalCtrl.dismiss({ refresh: false });
    this.navCtrl.navigateForward('/register-payment');
  }

  confirmMarkForWithdrawal() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Confirmar';
    alert.message = '¿Desea <strong>marcar la cuenta para retiro</strong> y bloquear al usuario?';
    alert.buttons = [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Confirmar',
        handler: () => {
          this.markForWithdrawal();
        }
      }
    ];
    document.body.appendChild(alert);
    alert.present();
  }

  markForWithdrawal() {
    const payload = {
      serviceId: this.service.service_id,
      customerId: this.service.customer_id
    };
  
    this.transactionService.markAccountForWithdrawal(payload).subscribe({
      next: () => {
        this.toastCtrl.create({
          message: 'Cuenta marcada para retiro y cliente bloqueado',
          duration: 3000,
          color: 'success'
        }).then(toast => toast.present());
        this.modalCtrl.dismiss({ refresh: true });
      },
      error: () => {
        this.toastCtrl.create({
          message: 'Error al procesar la solicitud',
          duration: 3000,
          color: 'warning'
        }).then(toast => toast.present());
      }
    });
  }

  confirmMarkAsLost() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Confirmar';
    alert.message = '¿Desea <strong>marcar la cuenta como perdida</strong> y bloquear al usuario?';
    alert.buttons = [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Confirmar',
        handler: () => {
          this.markAsLost();
        }
      }
    ];
    document.body.appendChild(alert);
    alert.present();
  }

  markAsLost() {
    const payload = {
      serviceId: this.service.service_id,
      customerId: this.service.customer_id
    };
  
    this.transactionService.markAsLost(payload).subscribe({
      next: () => {
        this.toastCtrl.create({
          message: 'Cuenta marcada como perdida y cliente bloqueado',
          duration: 3000,
          color: 'success'
        }).then(toast => toast.present());
        this.modalCtrl.dismiss({ refresh: true });
      },
      error: () => {
        this.toastCtrl.create({
          message: 'Error al procesar la solicitud',
          duration: 3000,
          color: 'warning'
        }).then(toast => toast.present());
      }
    });
  }

  dismiss() {
    this.modalCtrl.dismiss({ refresh: false });
  }
} 