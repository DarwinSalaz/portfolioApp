import { Component, OnInit } from '@angular/core';
import { Service, ServiceProduct, ServicesByCustomerResponse } from 'src/app/interfaces/interfaces';

import { NavServiceService } from '../../../services/nav-service.service';
import { NgForm } from '@angular/forms';
import { UiServiceService } from '../../../services/ui-service.service';
import { TransactionService } from '../../../services/transaction.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-cancel-service',
  templateUrl: './cancel-service.page.html',
  styleUrls: ['./cancel-service.page.scss'],
})
export class CancelServicePage implements OnInit {

  service: ServicesByCustomerResponse;
  products: ServiceProduct[];
  productsSelected: ServiceProduct[] = [];
  debt: string;
  discount: number = 0;
  loading: boolean = true;

  constructor(
    public navService: NavServiceService,
    private uiService: UiServiceService,
    private transactionService: TransactionService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.service = this.navService.myParam;
    this.products = this.service.service_products;
    this.debt = this.service.debt
    this.loading = false;
  }

  async cancelService(fRegistro: NgForm) {

    let productIds = this.productsSelected.map(item => item.product_id)
    let serviceId = this.service.service_id

    if ( fRegistro.invalid || !productIds || productIds.length === 0) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }

    if (this.discount > this.service.debt_in_number) {
      this.uiService.InfoAlert('Valor de descuento no debe ser mayor al saldo');
      return;
    }

    this.loading = true;
    const valido = await this.transactionService.cancelService(productIds, serviceId, this.discount)

    this.loading = false;
    if ( valido ) {
      this.uiService.InfoAlert('Cancelación finalizada');
      this.navCtrl.navigateBack( '/transaction-by-user?customer_id=' + this.service.customer_id, { animated: true } );
    } else {
      this.uiService.InfoAlert('Error en el cierre de cuenta');
    }

  }

}
