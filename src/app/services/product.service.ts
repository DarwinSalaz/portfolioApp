import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product, ResponseProducts, WalletRequest, InventoryDetail } from '../interfaces/interfaces';

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

  getInventoryReport(init_date: string, end_date: string, walletId: number) {

    const request = {
      "starts_at": init_date,
      "ends_at": end_date,
      "wallet_id": walletId
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<InventoryDetail[]>(`${ URL }/api/portfolio/inventory/report`, request, httpOptions);
  }
  
  deleteProduct(productId: number): Promise<boolean> {
    return new Promise((resolve) => {
      this.http.delete(`${URL}/api/portfolio/product/${productId}`)
        .subscribe(
          (resp: any) => {
            console.log(resp);
            if (resp.message) {
              resolve(true);
            } else {
              resolve(false);
            }
          },
          (error) => {
            console.error('Error deleting product:', error);
            resolve(false);
          }
        );
    });
  }
}
