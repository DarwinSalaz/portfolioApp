import { Component, OnInit, Input } from '@angular/core';
import { Customer } from '../../interfaces/interfaces';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {

  @Input() customer: Customer = {};
  @Input() redirectTo = '';

  constructor(private navCtrl: NavController, public router: Router) { }

  ngOnInit() {
    console.log(this.customer.customer_id);
  }

  click() {
    //this.navCtrl.navigateForward('/menu', )
    //this.navCtrl.navigateRoot( '/menu', { animated: true } );
    this.router.navigate([this.redirectTo], {
      queryParams: { customer_id : this.customer.customer_id }
    });
  }

}
