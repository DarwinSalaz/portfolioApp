import { Component, OnInit } from '@angular/core';
import { CustomersService } from '../../../services/customers.service';
import { Customer } from '../../../interfaces/interfaces';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-customerspage',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {

  title = 'Default';

  customers: Customer[] = [];

  redirectTo = '';

  enableInfiniteScroll = true;

  loading: boolean = true;

  constructor( private customersService: CustomersService, public activatedRoute: ActivatedRoute, private storage: Storage) {
    this.activatedRoute.params.subscribe((res) => {
      console.log(res);
      const origin = res.origin;
      switch(origin) {
        case 'payments':
          this.title = 'SELECCIONAR CLIENTE';
          this.redirectTo = '/transaction-by-user';
          break;
        case 'detail':
          this.title = 'CLIENTES';
          this.redirectTo = '/newcustomer';
          break;
        case 'new-service':
          this.title = 'SELECCIONAR CLIENTE';
          this.redirectTo = '/select-products';
          break;
        default:
          console.log('Invalid query param')
      }
    });
  }

  ngOnInit() {
    this.siguientes(null, true);
  }

  async refresh( event ) {
    //this.siguientes( event, true );
    this.enableInfiniteScroll = true;
    this.customers = [];
  }
  
  async siguientes(event?: any, pull: boolean = false) {
    const profileType = await this.storage.get('user_profile_id');
    let walletIds = null;
  
    if (profileType !== 1) {
      walletIds = await this.storage.get('wallet_ids');
    }
  
    console.log('[Customers-page] init siguientes ' + JSON.stringify(walletIds));
  
    this.customersService.getCustomers(pull, 1000, walletIds)
      .subscribe(resp => {
        console.log('[Customers-page] response:', resp);
        this.customers.push(...resp.customers);
        this.loading = false;
  
        if (event) {
          event.target.complete();
  
          if (resp.customers.length === 0) {
            this.enableInfiniteScroll = false;
          }
        }
      });
  }

}
