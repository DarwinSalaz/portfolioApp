import { Component, OnInit } from '@angular/core';
import { Wallet } from 'src/app/interfaces/interfaces';
import { WalletService } from 'src/app/services/wallet.service';
import { Storage } from '@ionic/storage';
import { NgForm } from '@angular/forms';
import { UiServiceService } from '../../../services/ui-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-portfolio-report',
  templateUrl: './portfolio-report.page.html',
  styleUrls: ['./portfolio-report.page.scss'],
})
export class PortfolioReportPage implements OnInit {

  wallets: Wallet[] = [];
  wallet: Wallet = null;
  init_date: string;
  end_date: string;

  constructor(
    private walletService: WalletService,
    private storage: Storage,
    private uiService: UiServiceService,
    public router: Router
  ) { }

  ngOnInit() {

    this.init()

    

  }

  async init() {
    const walletIds = await this.storage.get('wallet_ids');
    console.log("aqui prroo " + walletIds)

    this.walletService.getWallets(walletIds)
        .subscribe( resp => {
          //console.log( resp );
          this.wallets = resp;
          console.log( this.wallets );
        });
  }

  async send(fRegistro: NgForm) {
    if ( fRegistro.invalid ) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }
    this.init_date = this.init_date.split('.')[0].split('T')[0] + "T00:00:00"
    this.end_date = this.end_date.split('.')[0].split('T')[0] + "T00:00:00"

    this.router.navigate(['/portfolio-report-wallet'], {
      queryParams: { init_date : this.init_date, end_date : this.end_date, wallet_id : this.wallet.wallet_id }
    });
  }

}
