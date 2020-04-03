import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Wallet, WalletRequest } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor( private http: HttpClient ) { }

  getWallets(walletIds: number[] = []) {

    const request: WalletRequest = {
      wallet_ids: walletIds
    }

    return this.http.post<Wallet[]>(`${ URL }/api/portfolio/wallets`, request);

  }
}
