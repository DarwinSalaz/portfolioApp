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
    left_quantity: 0, // Se establecerá en 0 para productos nuevos
    value_str: '',
    wallet_id: null
  }
  isUpdate: Boolean = false
  loading: boolean = true;
  
  // Variables para manejar el formato de moneda
  productValue: number = 0;
  productCost: number = 0;
  

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
    
    // Inicializar variables de moneda
    this.productValue = this.product.value || 0;
    this.productCost = this.product.cost || 0;
    
    this.loading = false;
  }

  async register(fRegistro: NgForm) {
    if ( fRegistro.invalid ) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }

    var valido;

    this.loading = true;

    // Asegurar que se usen los valores de moneda correctos
    this.product.value = this.productValue;
    this.product.cost = this.productCost;

    if(!this.isUpdate) {
      // Para productos nuevos, siempre establecer cantidad en 0
      this.product.left_quantity = 0;
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

  // Métodos para manejar el formato de moneda
  
  // Devuelve el número con puntos de miles
  formatCurrency(value: number | string): string {
    if (!value && value !== 0) return '';
    const num = value.toString().replace(/\D/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Convierte a número limpio (sin puntos) y lo guarda en el modelo
  onValueInput(event: any) {
    const rawValue = event.target.value.replace(/\./g, '');
    const numericValue = parseInt(rawValue, 10) || 0;
    this.productValue = numericValue;
  }

  onCostInput(event: any) {
    const rawValue = event.target.value.replace(/\./g, '');
    const numericValue = parseInt(rawValue, 10) || 0;
    this.productCost = numericValue;
  }

  // Maneja el focus del campo valor
  onValueFocus(event: any) {
    this.product.value = this.productValue;
    this.productValue = null;
  }

  // Maneja el blur del campo valor
  onValueBlur(event: any) {
    if (this.productValue == null || this.productValue === 0) {
      this.productValue = this.product.value;
    } else {
      this.product.value = this.productValue;
    }
  }

  // Maneja el focus del campo costo
  onCostFocus(event: any) {
    this.product.cost = this.productCost;
    this.productCost = null;
  }

  // Maneja el blur del campo costo
  onCostBlur(event: any) {
    if (this.productCost == null || this.productCost === 0) {
      this.productCost = this.product.cost;
    } else {
      this.product.cost = this.productCost;
    }
  }
}
