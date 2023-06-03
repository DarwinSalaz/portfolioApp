import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { CashMovement } from 'src/app/interfaces/interfaces';
import { CashcontrolService } from 'src/app/services/cashcontrol.service';
import { NavServiceService } from '../../../services/nav-service.service';

@Component({
  selector: 'app-cash-movements',
  templateUrl: './cash-movements.page.html',
  styleUrls: ['./cash-movements.page.scss'],
})
export class CashMovementsPage implements OnInit {

  cashControlId: number;
  movements: CashMovement[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private cashControlService: CashcontrolService,
    private router: Router,
    public navService: NavServiceService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((res) => {
      console.log(res);
      this.cashControlId = res.cash_control_id;
      if (!this.cashControlId) {
        this.movements = this.navService.listTransactionsCC;
        console.log('tomamos las transacciones de memoria' + this.movements);
      } else {
        this.cashControlService.getCashMovements(this.cashControlId)
          .subscribe( resp => {
            this.movements = resp;
          });
      }
    });
  }

  getDetail(movement: CashMovement) {
    /*this.router.navigate(['/register-payment'], {
      queryParams: { service_id: movement.service_id }
    });*/
  }

}
