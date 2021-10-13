import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ResponseProducts } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor( private http: HttpClient ) { }

  getProducts(pull: boolean = false, size: number = -1) {

    return this.http.get<ResponseProducts>(`${ URL }/api/portfolio/products?sort=name,asc`);

  }
}
