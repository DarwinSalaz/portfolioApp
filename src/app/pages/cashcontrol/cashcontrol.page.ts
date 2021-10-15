import { Component, OnInit } from '@angular/core';
import { CashControl } from '../../interfaces/interfaces';
import { CashcontrolService } from '../../services/cashcontrol.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cashcontrol',
  templateUrl: './cashcontrol.page.html',
  styleUrls: ['./cashcontrol.page.scss'],
})
export class CashcontrolPage implements OnInit {

  loading: boolean = true;
  username: string;
  isControl: boolean = false;

  cashControl: CashControl = {
    full_name: '',
    cash: '',
    revenues: '',
    expenses: '',
    active: false,
    period: '',
    services_count: 0
  };

  constructor(
    private cashcontrolService: CashcontrolService,
    public activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((res) => {
      console.log(res);
      
      if (res.username) {
        console.log('aqui paaa');
        this.username = res.username;
        this.isControl = true;
      } else {
        this.isControl = false;
      }

      this.init();
    });

    
  }

  async ngOnInit() {
  }

  async init() {
    console.log('usernameeee:' + this.username);
    const response = await this.cashcontrolService.getActiveCashControl(this.username);
    response.subscribe(
      resp => {
        console.log( resp );
        this.cashControl = resp;
        this.loading = false;
      }
    );
  }

}
