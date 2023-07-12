import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/interfaces/interfaces';
import { ProductService } from '../../../services/product.service';
import { NavServiceService } from '../../../services/nav-service.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.page.html',
  styleUrls: ['./list-products.page.scss'],
})
export class ListProductsPage implements OnInit {

  walletId: number
  products: Product[] = [];
  loading: boolean = true;
  userProfileId: number = null;
  isAdmin: boolean = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    private productService: ProductService,
    public navService: NavServiceService,
    public router: Router,
    private storage: Storage
  ) { 
    this.storage.get('user_profile_id').then((val) => {
      this.userProfileId = val;
      this.isAdmin = val === 1
    })

  }

  ngOnInit() {

    
  }

  ionViewWillEnter() {
    
    this.activatedRoute.queryParams.subscribe((res) => {
      console.log(res);
      this.walletId = res.wallet_id;
    }); 

    this.productService.getProducts([this.walletId])
      .subscribe( resp => {
        console.log( resp );
        this.products = []
        //this.products.push( ...resp.products );
        this.products.push( ...resp.products );
        this.loading = false;
      });
  }

  async addProduct() {
    this.navService.productToEdit = null;
    this.router.navigate(['/product-detail'], {
      queryParams: { wallet_id: this.walletId }
    });
  }

  async productDetail(product: Product) {
    if (this.userProfileId !== 1) {
      return
    }

    this.navService.productToEdit = product;
    this.router.navigate(['/product-detail']);
  }

}
