import { Component, Input } from '@angular/core';
import { ModalController, NavController, ToastController, LoadingController } from '@ionic/angular';
import { ServicesByCustomerResponse } from '../../interfaces/interfaces';
import { TransactionService } from '../../services/transaction.service';
import { UiServiceService } from '../../services/ui-service.service';
import { NavServiceService } from '../../services/nav-service.service';
import { from } from 'rxjs';

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
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
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

  confirmDeleteService() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Confirmar Eliminación';
    alert.message = '¿Está seguro que desea <strong>eliminar completamente</strong> este servicio? Esta acción no se puede deshacer y eliminará todos los registros asociados.';
    alert.buttons = [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Eliminar',
        cssClass: 'danger',
        handler: () => {
          this.deleteService();
        }
      }
    ];
    document.body.appendChild(alert);
    alert.present();
  }

  async deleteService() {
    const loading = await this.loadingCtrl.create({
      message: 'Eliminando servicio...'
    });
    await loading.present();
    try {
      this.transactionService.deleteService(this.service.service_id).subscribe({
        next: (response: any) => {
          loading.dismiss();
          if (response.code === 'ok') {
            this.toastCtrl.create({
              message: 'Servicio eliminado exitosamente',
              duration: 3000,
              color: 'success'
            }).then(toast => toast.present());
            this.modalCtrl.dismiss({ refresh: true }); // Indicar que se debe refrescar
          } else {
            console.log('Error eliminando servicio 2: ' + JSON.stringify(response));
            this.toastCtrl.create({
              message: response.message || 'Error al eliminar el servicio',
              duration: 3000,
              color: 'warning'
            }).then(toast => toast.present());
          }
        },
        error: (error) => {
          loading.dismiss();
          console.log('Error eliminando servicio:', error);
          let errorMsg = 'Error desconocido';
          if (error && error.error && error.error.message) {
            errorMsg = error.error.message;
          } else if (error && error.message) {
            errorMsg = error.message;
          } else {
            errorMsg = JSON.stringify(error);
          }
          const toast = this.toastCtrl.create({
            message: errorMsg,
            duration: 4000,
            color: 'danger'
          });
          toast.then(t => t.present());
        }
      });
    } catch (error) {
      loading.dismiss();
      let errorMsg = 'Error desconocido';
      if (error && error.error && error.error.message) {
        errorMsg = error.error.message;
      } else if (error && error.message) {
        errorMsg = error.message;
      } else {
        errorMsg = JSON.stringify(error);
      }
      const toast = this.toastCtrl.create({
        message: errorMsg,
        duration: 4000,
        color: 'danger'
      });
      toast.then(t => t.present());
    }
  }
} 