import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../../services/transaction.service';
import { Storage } from '@ionic/storage';
import { ItemUserCustom, CustomerServiceSchedule } from '../../../interfaces/interfaces';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-transaction-by-date',
  templateUrl: './transaction-by-date.page.html',
  styleUrls: ['./transaction-by-date.page.scss'],
})
export class TransactionByDatePage implements OnInit {

  title = 'SELECCIONAR CLIENTE';
  date: string;
  expiredServices: boolean = false;
  items: ItemUserCustom[] = [];
  customerServices: CustomerServiceSchedule[] = [];
  loading: boolean = true;
  enableInfiniteScroll = true;
  redirectTo = '/newcustomer';
  userProfileId: number;

  constructor(
    public activatedRoute: ActivatedRoute,
    private transactionService: TransactionService,
    private storage: Storage,
    private navCtrl: NavController
  ) {
    
  }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.customerServices = []
    this.siguientes(null);
  }

  async siguientes( event? ) {

    this.date = await this.storage.get('date_to_find');
    const walletIds = await this.storage.get('wallet_ids');
    this.userProfileId = await this.storage.get('user_profile_id');
    
    this.activatedRoute.queryParams.subscribe((res) => {
      if (!this.date) {
        this.date = res.date;
        this.storage.set('date_to_find', this.date);
      }

      if (res.expired_services) {
        this.expiredServices = res.expired_services
      }
    });

    this.transactionService.getServicesByDate(this.date, walletIds, this.expiredServices)
      .subscribe(resp => {
        console.log( resp );
        this.customerServices.push( ...resp);
        this.loading = false;
        this.items = this.customerServices.map(
          it => {
            var itemPr: ItemUserCustom = {
              main_text: it.name + (it.last_name != null ? ' ' + it.last_name : ''),
              second_text: it.next_payment_date, 
              icon: it.icon,
              username: null,
              customer_id: it.customer_id
            }

            return itemPr;
          }
        )

        if ( event ) {
          event.target.complete();

          if (resp.length === 0) {
            //event.target.disabled = true;
            //console.log( "vamos aqui" + this.enableInfiniteScroll );
            this.enableInfiniteScroll = false;
          }
        }
      });
  }

  refresh( event ) {
    this.siguientes( event );
    this.enableInfiniteScroll = true;
    this.customerServices = [];
    this.items = [];
  }

  async goBack() {
    await this.storage.set('date_to_find', null);
    this.navCtrl.navigateBack("/transaction-by-date-form");
  }

}
