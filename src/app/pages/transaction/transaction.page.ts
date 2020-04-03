import { Component, OnInit, ViewChild } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { NavController, ToastController } from '@ionic/angular';
import { UiServiceService } from '../../services/ui-service.service';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { Service, Customer, Product } from '../../interfaces/interfaces';
import { CustomersService } from '../../services/customers.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ProductService } from '../../services/product.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
})
export class TransactionPage implements OnInit {

  myGroup = new FormGroup({
    firstName: new FormControl()
  });
  customer: Customer = null;
  product: Product = null;

  customers: Customer[] = [];

  products: Product[] = [];

  registerService: Service = {
    service_value: 0,
    down_payment: 0,
    discount: 0,
    total_value: 0,
    debt: 0,
    days_per_fee: 7,
    quantity_of_fees: 10,
    fee_value: 0,
    wallet_id: 1,
    has_products: false,
    customer_id: 1,
    state: 'init',
    service_products: [],
    observations: null,
    next_payment_date: null
  };

  constructor(private transactionService: TransactionService,
              private customersService: CustomersService,
              private productService: ProductService,
              private navCtrl: NavController,
              private uiService: UiServiceService,
              private toastCtrl: ToastController,
              private storage: Storage) { 
                
              }

  ngOnInit() {
    this.init()
  }

  async init() {

    const walletIds = await this.storage.get('wallet_ids');
    console.log("aqui prroo " + walletIds)

    this.customersService.getCustomers(true, -1, walletIds)
        .subscribe( resp => {
          console.log( resp );
          const customers = resp.customers;
          customers.forEach((el) => { el.fullname = el.name + ' ' + el.last_name + ' - ' + el.identification_number; });
          this.customers.push( ...customers );
        });

    this.productService.getProducts()
      .subscribe( resp => {
        console.log( resp );
        this.products.push( ...resp.products );
      });
  }

  async register(fRegistro: NgForm) {

    if ( fRegistro.invalid ) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }

    this.registerService.next_payment_date = this.registerService.next_payment_date.split('.')[0]
    const valido = await this.transactionService.registerService(this.registerService);

    if ( valido ) {
      this.uiService.InfoAlert('Servicio finalizado');
      this.navCtrl.navigateRoot( '/menu', { animated: true } );
    } else {
      this.uiService.InfoAlert('Error al guardar el cliente');
    }

  }

  customerChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('customer:', event.value);
    this.registerService.customer_id = event.value.customer_id;
  }

  productChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('product:', event.value);
    const productsSelected: Product[] = event.value;
    const totalValue = productsSelected.map(item => item.value).reduce((prev, next) => prev + next);
    this.registerService.service_value = totalValue;
    this.registerService.down_payment = totalValue*0.1
    this.recalculate( null );
    this.registerService.service_products = productsSelected;
  }

  recalculate( event ) {
    this.registerService.total_value = this.registerService.service_value - this.registerService.discount;
    this.registerService.down_payment = this.registerService.total_value*0.1
    this.registerService.debt = this.registerService.total_value - this.registerService.down_payment;
    this.registerService.fee_value = this.registerService.debt / this.registerService.quantity_of_fees;
    console.log( this.registerService.discount );
  }

}
