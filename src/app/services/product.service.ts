import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ResponseProducts, WalletRequest } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor( private http: HttpClient ) { }

  getProducts(walletIds: number[] = []) {

    const request: WalletRequest = {
      wallet_ids: walletIds
    }
    console.log(`estas son las carteras: ${walletIds}`)

    return this.http.post<ResponseProducts>(`${ URL }/api/portfolio/products?sort=name,asc`, request);
  }
}
