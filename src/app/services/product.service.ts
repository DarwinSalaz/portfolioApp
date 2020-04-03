import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ResponseProducts } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  pageProducts = -1;

  constructor( private http: HttpClient ) { }

  getProducts(pull: boolean = false, size: number = -1) {
    let sizeStr = '';

    if ( pull ) {
      this.pageProducts = -1;
    }

    if ( size > 0 ) {
      sizeStr = `&size=${size}`;
    }

    this.pageProducts ++;

    return this.http.get<ResponseProducts>(`${ URL }/api/portfolio/products?page=${this.pageProducts}${sizeStr}&sort=name,asc`);

  }
}
