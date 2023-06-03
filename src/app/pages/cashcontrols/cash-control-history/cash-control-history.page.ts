import { Component, OnInit } from '@angular/core';
import { CashControl } from 'src/app/interfaces/interfaces';
import { CashcontrolService } from 'src/app/services/cashcontrol.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cash-control-history',
  templateUrl: './cash-control-history.page.html',
  styleUrls: ['./cash-control-history.page.scss'],
})
export class CashControlHistoryPage implements OnInit {

  cashControls: CashControl[];
  username: string;

  constructor(
    private cashControlService: CashcontrolService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((res) => {
      this.username = res.username;
      this.cashControlService.getCashControlsHistory(this.username)
        .subscribe( resp => {
          this.cashControls = resp;
        });
    })
  }

  async getDetail(cashControl: CashControl) {
    
  }

}
