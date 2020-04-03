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

  constructor( private customersService: CustomersService, public activatedRoute: ActivatedRoute, private storage: Storage) {
    this.activatedRoute.params.subscribe((res) => {
      console.log(res);
      const origin = res.origin;
      this.title = origin === 'payments' ? 'SELECCIONAR CLIENTE' : 'CLIENTES';
      this.redirectTo = origin === 'payments' ? '/transaction-by-user' : '/newcustomer';
    });
  }

  ngOnInit() {
    this.siguientes(null, true);
  }

  refresh( event ) {
    this.siguientes( event, true );
    this.enableInfiniteScroll = true;
    this.customers = [];
  }

  async siguientes( event?, pull: boolean = false ) {

    const walletIds = await this.storage.get('wallet_ids');

    this.customersService.getCustomers( pull, 1000, walletIds )
      .subscribe( resp => {
        //console.log( resp );
        this.customers.push( ...resp.customers );

        if ( event ) {
          event.target.complete();

          if (resp.customers.length === 0) {
            //event.target.disabled = true;
            //console.log( "vamos aqui" + this.enableInfiniteScroll );
            this.enableInfiniteScroll = false;
          }
        }
      });
  }

}
