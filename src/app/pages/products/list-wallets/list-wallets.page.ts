import { Component, OnInit } from '@angular/core';

import { Wallet } from '../../../interfaces/interfaces';
import { WalletService } from 'src/app/services/wallet.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list-wallets',
  templateUrl: './list-wallets.page.html',
  styleUrls: ['./list-wallets.page.scss'],
})
export class ListWalletsPage implements OnInit {

  wallets: Wallet[] = [];

  loading: boolean = true;

  constructor(private walletService: WalletService, public router: Router) { }

  ngOnInit() {
    this.walletService.getWallets()
        .subscribe( resp => {
          this.wallets = resp;
          this.loading = false;
        });
  }

  async findProducts(wallet: Wallet) {
    this.router.navigate(['/list-products'], {
      queryParams: { wallet_id: wallet.wallet_id }
    });
  }

}
