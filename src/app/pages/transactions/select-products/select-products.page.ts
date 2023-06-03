import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Product, Service } from 'src/app/interfaces/interfaces';
import { NavServiceService } from 'src/app/services/nav-service.service';
import { ProductService } from 'src/app/services/product.service';
import { UiServiceService } from 'src/app/services/ui-service.service';

@Component({
  selector: 'app-select-products',
  templateUrl: './select-products.page.html',
  styleUrls: ['./select-products.page.scss'],
})
export class SelectProductsPage implements OnInit {

  allProducts: Product[] = [];
  products: Product[] = [];
  loading: boolean = true;
  //newService: Service;

  constructor(
    private productService: ProductService,
    public navService: NavServiceService,
    private navCtrl: NavController,
    private uiService: UiServiceService
  ) { }

  ngOnInit() {
    this.init()
  }

  async init() {
    //this.newService = this.navService.newService;

    this.productService.getProducts([this.navService.newService.wallet_id])
      .subscribe( resp => {
        console.log( resp );
        //this.products.push( ...resp.products );
        this.allProducts.push( ...resp.products.filter(p => p.left_quantity > 0) );
        this.allProducts.forEach( p => p.quantity = 0 );
        this.loading = false;
      });

  }

  async changeQty(product: Product, quantity) {
    if (product.quantity == 0 && quantity == -1) return;
    if (product.left_quantity == product.quantity && quantity == 1) return;
    
    let objIndex = this.allProducts.findIndex((obj => obj.product_id == product.product_id));
    this.allProducts[objIndex].quantity = product.quantity + quantity;
  }

  async next() {
    this.products = this.allProducts.filter(product => product.quantity > 0 );

    if ( this.products.length === 0 ) {
      this.uiService.InfoAlert('Seleccionar un producto');
      return;
    }

    this.navService.newService.service_products = this.products;

    this.navCtrl.navigateForward( '/transaction', { animated: true } );
  }

}
