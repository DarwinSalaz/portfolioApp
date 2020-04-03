import { Component, OnInit } from '@angular/core';
import { CashControl } from '../../interfaces/interfaces';
import { CashcontrolService } from '../../services/cashcontrol.service';

@Component({
  selector: 'app-cashcontrol',
  templateUrl: './cashcontrol.page.html',
  styleUrls: ['./cashcontrol.page.scss'],
})
export class CashcontrolPage implements OnInit {

  cashControl: CashControl = {
    full_name: '',
    cash: '',
    revenues: '',
    expenses: '',
    active: false,
    period: '',
    services_count: 0
  };

  constructor(private cashcontrolService: CashcontrolService) { }

  async ngOnInit() {
    const response = await this.cashcontrolService.getActiveCashControl();
    response.subscribe(
      resp => {
        console.log( resp );
        this.cashControl = resp;
      }
    );
  }

}
