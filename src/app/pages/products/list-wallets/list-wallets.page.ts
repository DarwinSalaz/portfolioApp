import { Component, OnInit } from '@angular/core';

import { Wallet } from '../../../interfaces/interfaces';
import { WalletService } from 'src/app/services/wallet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-list-wallets',
  templateUrl: './list-wallets.page.html',
  styleUrls: ['./list-wallets.page.scss'],
})
export class ListWalletsPage implements OnInit {

  wallets: Wallet[] = [];

  loading: boolean = true;

  constructor(private walletService: WalletService, public router: Router, private storage: Storage) {
    this.init();
  }

  ngOnInit() {}

  async init() {
    const walletIds = await this.storage.get('wallet_ids');

    this.walletService.getWallets(walletIds)
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
