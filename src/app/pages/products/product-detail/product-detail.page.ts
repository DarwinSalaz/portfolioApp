import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/interfaces';
import { NavServiceService } from '../../../services/nav-service.service';
import { NgForm } from '@angular/forms';
import { UiServiceService } from '../../../services/ui-service.service';
import { NavController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

  product: Product = {
    product_id: 0,
    company_id: 1,
    name: '',
    description: '',
    value: 0,
    left_quantity: 0,
    value_str: '',
    wallet_id: null
  }
  isUpdate: Boolean = false
  loading: boolean = true;
  

  constructor(
    private navService: NavServiceService,
    private uiService: UiServiceService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    let productMemory = this.navService.productToEdit;

    if (!productMemory) {
      this.activatedRoute.queryParams.subscribe((res) => {
        console.log(res);
        this.product.wallet_id = res.wallet_id;
        this.isUpdate = false;
      });
    } else {
      this.isUpdate = true;
      this.product = productMemory;
    }
    this.loading = false;
  }

  async register(fRegistro: NgForm) {
    if ( fRegistro.invalid ) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }

    var valido;

    this.loading = true;

    if(!this.isUpdate) {
      valido = await this.productService.registerProduct(this.product);
    } else {
      valido = await this.productService.updateProduct(this.product);
    }

    this.loading = false;
    if ( valido ) {
      // navegar al tabs
      this.uiService.InfoAlert('Registro exitoso');
      this.navCtrl.navigateBack('list-products?wallet_id=' + this.product.wallet_id);
    } else {
      this.uiService.InfoAlert('Error al registrar el producto');
    }
  }

}
