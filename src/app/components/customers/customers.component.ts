import { Component, OnInit, Input, InjectFlags } from '@angular/core';
import { Customer } from '../../interfaces/interfaces';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {

  @Input() customers: Customer[] = [];
  @Input() redirectTo = '';
  allCustomers: Customer[] = [];

  constructor() { }

  ngOnInit() {
    this.allCustomers = this.customers;
    console.log(this.customers);
  }

  getCustomers(event?) {
    const serVal = event.target.value;
    if ( serVal && serVal.trim() !== '' ) {

      this.customers = this.allCustomers.filter((customer) => {
        return (customer.name.toLowerCase().indexOf(serVal.toLowerCase()) > -1) ||
                (customer.last_name.toLowerCase().indexOf(serVal.toLowerCase()) > -1) ||
                (customer.identification_number.indexOf(serVal.toLowerCase()) > -1);
      });


      console.log(this.customers);
    } else {
      this.customers = this.allCustomers;
    }
  }

}
