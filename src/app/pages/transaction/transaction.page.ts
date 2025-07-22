import { Component, OnInit, ViewChild } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { NavController, ToastController } from '@ionic/angular';
import { UiServiceService } from '../../services/ui-service.service';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { Service, Customer, Product, Wallet } from '../../interfaces/interfaces';
import { CustomersService } from '../../services/customers.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ProductService } from '../../services/product.service';
import { Storage } from '@ionic/storage';
import { WalletService } from 'src/app/services/wallet.service';
import { NavServiceService } from 'src/app/services/nav-service.service';
import * as moment from 'moment';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
})
export class TransactionPage implements OnInit {

  public minDate = moment().format();
  public maxDate = moment().add(40, 'd').format();

  myGroup = new FormGroup({
    firstName: new FormControl()
  });
  customer: Customer = null;
  productsSelected: Product[] = [];
  wallet: Wallet = null;

  customers: Customer[] = [];
  wallets: Wallet[] = [];

  products: Product[] = [];
  allProducts: Product[] = [];

  payDownInInstallments: boolean = false;

  loading: boolean = true;

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
    state: 'created',
    service_products: [],
    observations: null,
    next_payment_date: null,
    initial_payment: 0,
    direct_purchase: false,
    pending_fees: 10,
    pay_down_in_installments: false
  };

  datosInput = {
    discount: 0,
    down_payment: 0,
    days_per_fee: 7,
    quantity_of_fees: 10,
    fee_value: 0,
    initial_payment: 0
  }

  constructor(private transactionService: TransactionService,
              private customersService: CustomersService,
              private productService: ProductService,
              private navCtrl: NavController,
              private uiService: UiServiceService,
              private walletService: WalletService,
              private storage: Storage,
              private navService: NavServiceService
              ) { 
                
              }

  ngOnInit() {
    this.init()
  }

  async init() {

    console.log('esta es la fecha máxima' + this.maxDate)

    
    
    this.registerService = this.navService.newService;
    this.productsSelected = this.navService.newService.service_products;
    const walletIds = await this.storage.get('wallet_ids');

    console.log('estas son las carteras pro' + walletIds)


    this.customersService.getCustomers(true, -1, walletIds)
        .subscribe( resp => {
          console.log( resp );
          const customers = resp.customers;
          customers.forEach((el) => { el.fullname = el.name + ' ' + el.last_name + ' - ' + el.identification_number; });
          this.customers.push( ...customers );
          this.customer = this.customers.find(element => element.customer_id === this.registerService.customer_id)
          console.log('este es el customer: ' + JSON.stringify(this.customer));

          if (this.customer.name === 'VENTA CONTADO') {
            this.registerService.direct_purchase = true
            this.changeDirectPurchase(null)
          }
        });

    this.walletService.getWallets(walletIds)
      .subscribe( resp => {
        //console.log( resp );
        this.wallets = resp;
        console.log( this.wallets );
        this.wallet = this.wallets.find(element => element.wallet_id === this.registerService.wallet_id)
      });

    this.productService.getProducts(walletIds)
      .subscribe( resp => {
        console.log( resp );
        //this.products.push( ...resp.products );
        this.allProducts.push( ...resp.products );
        this.loading = false;
      });


    if (this.productsSelected && this.productsSelected.length > 0) {
      this.productChange(null)
    }
    
  }

  async register(fRegistro: NgForm) {

    if ( fRegistro.invalid ) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }

    this.registerService.pay_down_in_installments = this.payDownInInstallments
    this.registerService.pending_fees = this.registerService.quantity_of_fees - 1
    this.registerService.next_payment_date = this.registerService.next_payment_date.split('.')[0]
    this.loading = true;
    const valido = await this.transactionService.registerService(this.registerService);

    this.loading = false;
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

  walletChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('wallet:', event.value);
    this.registerService.wallet_id = event.value.wallet_id;
    this.productsSelected = []
    this.products = this.allProducts.filter(product => product.wallet_id == this.registerService.wallet_id && product.left_quantity > 0)
    this.registerService.service_value = 0
    this.registerService.down_payment = 0
    this.datosInput.down_payment = 0
    this.registerService.initial_payment = 0
    this.datosInput.initial_payment = 0
    this.registerService.discount = 0
    this.datosInput.discount = 0
    this.recalculate( null );
    this.registerService.service_products = []
  }

  productChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    if (event !== null) {
      console.log('product:', event.value);
      this.productsSelected = event.value;
    }  
    const totalValue = this.productsSelected.map(item => item.value*item.quantity).reduce((prev, next) => prev + next);
    this.registerService.service_value = totalValue;
    this.registerService.down_payment = totalValue*0.1
    this.datosInput.down_payment = this.registerService.down_payment
    this.registerService.initial_payment = 0
    this.datosInput.initial_payment = 0
    this.registerService.discount = 0
    this.datosInput.discount = 0
    this.recalculate( null );
    this.registerService.service_products = this.productsSelected;
  }

  recalculate( event ) {

    const total = this.registerService.service_value;
    const discount = this.registerService.discount;
    const valueAfterDiscount = total - discount;

    const quantityOfFees = this.datosInput.quantity_of_fees || 10;

    if (this.payDownInInstallments) {
      const feeValue = Number((valueAfterDiscount / quantityOfFees).toFixed(0));
      const halfFee = Number((feeValue / 2).toFixed(0));

      var limitDownPayment = this.registerService.total_value*0.1;

      if (halfFee > limitDownPayment) {
        this.registerService.down_payment = limitDownPayment;
        this.datosInput.down_payment = limitDownPayment;

        this.registerService.initial_payment = feeValue - limitDownPayment;
        this.datosInput.initial_payment = feeValue - limitDownPayment;
      } else {
        this.registerService.down_payment = halfFee;
        this.datosInput.down_payment = halfFee;

        this.registerService.initial_payment = halfFee;
        this.datosInput.initial_payment = halfFee;
      }

      this.registerService.fee_value = feeValue;
      this.datosInput.fee_value = feeValue;

      this.registerService.total_value = valueAfterDiscount;
      this.registerService.quantity_of_fees = quantityOfFees;
    
      this.registerService.debt = this.registerService.total_value - this.registerService.down_payment - this.registerService.initial_payment;
    } else {
      this.registerService.total_value = valueAfterDiscount;
      if (this.registerService.direct_purchase !== true) {
        this.registerService.down_payment = this.registerService.total_value*0.1
        this.datosInput.down_payment = this.registerService.down_payment
      }
      this.registerService.debt = this.registerService.total_value - this.registerService.down_payment - this.registerService.initial_payment;
      this.registerService.quantity_of_fees = quantityOfFees
      const denominator = this.registerService.quantity_of_fees - 1;
      if (denominator > 0) {
        this.registerService.fee_value = Number(
          (this.registerService.debt / denominator).toFixed(0)
        );
      } 
      this.datosInput.fee_value = this.registerService.fee_value
      console.log( this.registerService.discount );
    }
  }

  focus(event) {
    console.log( event.target.name );
    
    switch(event.target.name) {
      case 'discount':
        this.datosInput.discount = null; break;
      case 'initial':
        this.datosInput.initial_payment = null; break;
      case 'days_per_fee':
        this.datosInput.days_per_fee = null; break;
      case 'quantity_of_fees':
        this.datosInput.quantity_of_fees = null; break;
      case 'fee_value':
        this.datosInput.fee_value = null; break;
      default: break;
    }
  }

  changeDirectPurchase(event) {

    if (this.registerService.direct_purchase === true) {
      this.registerService.down_payment = 0;
      this.datosInput.down_payment = 0;
    } else {
      this.registerService.down_payment = this.registerService.service_value*0.1
      this.datosInput.down_payment = this.registerService.service_value*0.1
    }

    this.recalculate(null);
  }

  focusOut(event) {

    switch(event.target.name) {
      case 'discount':
        if(this.datosInput.discount == null) {
          this.datosInput.discount = this.registerService.discount
        } else {
          this.registerService.discount = this.datosInput.discount
          this.recalculate(null)
        }
        break;
      case 'initial':
        if(this.datosInput.initial_payment == null) {
          this.datosInput.initial_payment = this.registerService.initial_payment
        } else {
          this.registerService.initial_payment = this.datosInput.initial_payment
          this.recalculate(null)
        }
        break;
      case 'days_per_fee':
        if(this.datosInput.days_per_fee == null || this.datosInput.days_per_fee === 0) {
          this.datosInput.days_per_fee = this.registerService.days_per_fee
        } else {
          this.registerService.days_per_fee = this.datosInput.days_per_fee
          this.recalculate(null)
        }
        break;
      case 'quantity_of_fees':
        if(this.datosInput.quantity_of_fees == null || this.datosInput.quantity_of_fees === 0) {
          this.datosInput.quantity_of_fees = this.registerService.quantity_of_fees
        } else {
          this.registerService.quantity_of_fees = this.datosInput.quantity_of_fees
          this.recalculate(null)
        }
        break;
      case 'fee_value':
        if(this.datosInput.fee_value == null || this.datosInput.fee_value === 0) {
          this.datosInput.fee_value = this.registerService.fee_value
        } else {
          this.registerService.fee_value = this.datosInput.fee_value
          this.recalculate(null)
        }
        break;
      default: break;
    }

    
    
  }

  changeDownPaymentMode(event) {
    if (this.payDownInInstallments === false) {
      this.registerService.initial_payment = 0;
      this.datosInput.initial_payment = 0;
    }
    this.recalculate(null);
  }

  // Devuelve el número con puntos de miles
  formatCurrency(value: number | string): string {
    if (!value && value !== 0) return '';
    const num = value.toString().replace(/\D/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Convierte a número limpio (sin puntos) y lo guarda en el modelo
  onCurrencyInput(event: any, field: string) {
    const rawValue = event.target.value.replace(/\./g, '');
    const numericValue = parseInt(rawValue, 10) || 0;
    this.datosInput[field] = numericValue;
  }



}
