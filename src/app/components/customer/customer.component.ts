import { Component, OnInit, Input } from '@angular/core';
import { Customer, Service } from '../../interfaces/interfaces';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavServiceService } from 'src/app/services/nav-service.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {

  @Input() customer: Customer = {};
  @Input() redirectTo = '';
  newService: Service = {
    service_value: 0,
    down_payment: 0,
    discount: 0,
    total_value: 0,
    debt: 0,
    days_per_fee: 7,
    quantity_of_fees: 9,
    fee_value: 0,
    wallet_id: 2,
    has_products: false,
    customer_id: 1,
    state: 'created',
    service_products: [],
    observations: null,
    next_payment_date: null,
    initial_payment: 0,
    pending_fees: 9
  };

  constructor(
    private navCtrl: NavController, 
    public router: Router,
    public navService: NavServiceService
    ) { }

  ngOnInit() {
    console.log(this.customer.customer_id);
  }

  click() {
    //this.navCtrl.navigateForward('/menu', )
    //this.navCtrl.navigateRoot( '/menu', { animated: true } );
    if (this.redirectTo === '/select-products') {
      this.newService.customer_id = this.customer.customer_id;
      this.newService.wallet_id = this.customer.wallet_id;
      this.navService.newService = this.newService;
    }
    this.router.navigate([this.redirectTo], {
      queryParams: { customer_id : this.customer.customer_id }
    });
  }

}
