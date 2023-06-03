import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { WalletReport } from 'src/app/interfaces/interfaces';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-portfolio-report-wallet',
  templateUrl: './portfolio-report-wallet.page.html',
  styleUrls: ['./portfolio-report-wallet.page.scss'],
})
export class PortfolioReportWalletPage implements OnInit {

  init_date: string;
  end_date: string;
  wallet_id: number;
  loading: boolean = true;
  wallet: WalletReport = {
    wallet_name: '',
    services_count: 0,
    cash: '',
    down_payments: '',
    commissions: '',
    expenses: ''
  }

  constructor(
    public activatedRoute: ActivatedRoute,
    private transactionService: TransactionService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((res) => {
      this.init_date = res.init_date;
      this.end_date = res.end_date;
      this.wallet_id = res.wallet_id;

      this.init();
    });
  }

  async init() {
    const response = await this.transactionService.getWalletReport(this.init_date, this.end_date, this.wallet_id);
    response.subscribe(
      resp => {
        console.log( resp );
        this.wallet = resp;
        this.loading = false;
      }
    );
  }

}
