import { Component, OnInit } from '@angular/core';
import { CashControl } from '../../interfaces/interfaces';
import { CashcontrolService } from '../../services/cashcontrol.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavServiceService } from '../../services/nav-service.service';

@Component({
  selector: 'app-cashcontrol-daily',
  templateUrl: './cashcontrol-daily.page.html',
  styleUrls: ['./cashcontrol-daily.page.scss'],
})
export class CashcontrolDailyPage implements OnInit {

  loading: boolean = true;
  username: string;

  cashControl: CashControl = {
    full_name: '',
    cash: '',
    revenues: '',
    expenses: '',
    active: false,
    period: '',
    services_count: 0,
    commission: '',
    movements: []
  };

  constructor(
    private cashcontrolService: CashcontrolService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public navService: NavServiceService
  ) { 
    this.activatedRoute.queryParams.subscribe((res) => {
      console.log(res);
      
      if (res.username) {
        console.log('aqui paaa');
        this.username = res.username;
      } 

      this.init();
    }); 
  }

  ngOnInit() {
  }

  async init() {
    console.log('usernameeee:' + this.username);
    const response = await this.cashcontrolService.getDailyCashControl(this.username);
    response.subscribe(
      resp => {
        console.log( 'esta es la respuesta del daily: ' + resp.movements );
        this.cashControl = resp;
        this.loading = false;
      }
    );
  }

  async showMovements() {
    this.navService.listTransactionsCC = this.cashControl.movements;
    console.log('Aqui guardamos la lista de transacciones' + this.cashControl.movements);
    this.router.navigate(['/cash-movements']);
  }

}
