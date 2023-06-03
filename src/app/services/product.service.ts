import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product, ResponseProducts, WalletRequest } from '../interfaces/interfaces';

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

  registerProduct(product: Product) {

    return new Promise( resolve => {
      this.http.post(`${ URL }/api/portfolio/product/create`, product )
        .subscribe( resp => {
          console.log(resp);

          if ( resp['product_id'] ) {
            resolve(true);
          } else {
            resolve(false);
          }

        });
      });
  }

  updateProduct(product: Product) {

    return new Promise( resolve => {
      this.http.put(`${ URL }/api/portfolio/product/${product.product_id}`, product )
        .subscribe( resp => {
          console.log(resp);

          if ( resp['product_id'] ) {
            resolve(true);
          } else {
            resolve(false);
          }

        });
      });
  }
}
