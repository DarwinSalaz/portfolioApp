import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Wallet } from '../../interfaces/interfaces';
import { WalletService } from '../../services/wallet.service';
import { ProductService } from '../../services/product.service';
import { InventoryMovementService } from '../../services/inventory-movement.service';
import { InventoryMovementRequest, Product } from '../../interfaces/interfaces';
import { Storage } from '@ionic/storage';
import { UiServiceService } from '../../services/ui-service.service';

@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.page.html',
  styleUrls: ['./inventory-management.page.scss'],
})
export class InventoryManagementPage implements OnInit {

  wallets: Wallet[] = [];
  products: Product[] = [];
  movements: any[] = [];
  selectedWallet: Wallet = null;
  selectedProduct: Product = null;
  
  movementForm: FormGroup;
  loading: boolean = false;
  showMovements: boolean = false;

  constructor(
    private walletService: WalletService,
    private productService: ProductService,
    private inventoryMovementService: InventoryMovementService,
    private storage: Storage,
    private uiService: UiServiceService,
    private formBuilder: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadWallets();
  }

  private initForm() {
    this.movementForm = this.formBuilder.group({
      wallet_id: ['', Validators.required],
      product_id: ['', Validators.required],
      movement_type: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      description: ['']
    });
  }

  async loadWallets() {
    try {
      const walletIds = await this.storage.get('wallet_ids');
      console.log('Wallet IDs from storage:', walletIds); // Debug
      
      if (walletIds && walletIds.length > 0) {
        this.walletService.getWallets(walletIds).subscribe(
          function(wallets) {
            console.log('Wallets loaded:', wallets); // Debug
            if (wallets) {
              this.wallets = wallets;
            } else {
              this.wallets = [];
            }
          }.bind(this),
          function(error) {
            console.error('Error loading wallets:', error);
            this.uiService.InfoAlert('Error al cargar las carteras');
            this.wallets = [];
          }.bind(this)
        );
      } else {
        console.warn('No wallet IDs found in storage');
        this.wallets = [];
      }
    } catch (error) {
      console.error('Error loading wallets:', error);
      this.wallets = [];
    }
  }

  async onWalletChange() {
    try {
      const walletId = this.movementForm.get('wallet_id').value;
      console.log('Wallet changed to ID:', walletId); // Debug
      
      if (!walletId) {
        console.warn('No wallet ID selected');
        this.selectedWallet = null;
        this.products = [];
        this.selectedProduct = null;
        this.movements = []; // Limpiar movimientos
        this.showMovements = false; // Ocultar historial
        return;
      }
      
      this.selectedWallet = this.wallets.find(function(w) { 
        return w.wallet_id === walletId; 
      });
      console.log('Selected wallet:', this.selectedWallet); // Debug
      
      if (this.selectedWallet) {
        await this.loadProducts([walletId]);
      } else {
        console.warn('Wallet not found for ID:', walletId);
        this.products = [];
      }
      
      // Reset product selection and movements
      this.movementForm.patchValue({ product_id: '' });
      this.selectedProduct = null;
      this.movements = []; // Limpiar movimientos
      this.showMovements = false; // Ocultar historial
    } catch (error) {
      console.error('Error in onWalletChange:', error);
      this.uiService.InfoAlert('Error al cambiar la cartera');
    }
  }

  async onProductChange() {
    try {
      const productId = this.movementForm.get('product_id').value;
      console.log('Product changed to ID:', productId); // Debug
      
      if (!productId) {
        this.selectedProduct = null;
        return;
      }
      
             this.selectedProduct = this.products.find(function(p) { 
         return p.product_id === productId; 
       });
      console.log('Selected product:', this.selectedProduct); // Debug
      
      if (!this.selectedProduct) {
        console.warn('Product not found for ID:', productId);
      }
    } catch (error) {
      console.error('Error in onProductChange:', error);
      this.selectedProduct = null;
    }
  }

  async loadProducts(walletIds: number[]) {
    try {
      if (!walletIds || walletIds.length === 0) {
        console.warn('No wallet IDs provided for loadProducts');
        this.products = [];
        return;
      }

      console.log('Loading products for wallet IDs:', walletIds); // Debug

      this.productService.getProducts(walletIds).subscribe(
        function(response) {
          console.log('Products response:', response); // Debug
          if (response && response.products) {
            this.products = response.products;
          } else {
            this.products = [];
          }
          console.log('Products loaded:', this.products.length); // Debug
        }.bind(this),
        function(error) {
          console.error('Error loading products:', error);
          this.uiService.InfoAlert('Error al cargar los productos');
          this.products = [];
        }.bind(this)
      );
    } catch (error) {
      console.error('Error loading products:', error);
      this.products = [];
    }
  }

  async registerMovement() {
    try {
      if (this.movementForm.invalid) {
        this.uiService.InfoAlert('Por favor complete todos los campos requeridos');
        return;
      }

      const formValue = this.movementForm.value;
      console.log('Form values:', formValue); // Debug
      
      // Validaciones adicionales
      if (!formValue.wallet_id || !formValue.product_id || !formValue.movement_type || !formValue.quantity) {
        this.uiService.InfoAlert('Por favor complete todos los campos requeridos');
        return;
      }
      
      // Validar que la cartera y producto estén seleccionados
      if (!this.selectedWallet || !this.selectedProduct) {
        this.uiService.InfoAlert('Por favor seleccione una cartera y un producto válidos');
        return;
      }
      
      // Validar stock si es salida
      if (formValue.movement_type === 'SALIDA') {
        if (formValue.quantity > this.selectedProduct.left_quantity) {
          this.uiService.InfoAlert(`Stock insuficiente. Stock actual: ${this.selectedProduct.left_quantity}`);
          return;
        }
      }

      this.loading = true;

      const request: InventoryMovementRequest = {
        product_id: formValue.product_id,
        movement_type: formValue.movement_type,
        quantity: formValue.quantity,
        description: formValue.description || null,
        wallet_id: formValue.wallet_id
      };

      console.log('Enviando request:', request); // Debug

      const response = await this.inventoryMovementService.registerMovement(request);
      
      console.log('Respuesta recibida:', response); // Debug
      
      // Debug: verificar la estructura de la respuesta
      if (response) {
        console.log('Estructura de la respuesta:', {
          id: response.id,
          product_name: response.product_name,
          movement_type: response.movement_type,
          quantity: response.quantity,
          previous_quantity: response.previous_quantity,
          new_quantity: response.new_quantity,
          username: response.username,
          movement_date: response.movement_date,
          description: response.description
        });
      }
      
      this.uiService.InfoAlert('Movimiento registrado exitosamente');
      
      // Reset form and clear selections
      this.movementForm.reset();
      this.selectedProduct = null;
      
      // Reload products to get updated quantities
      if (this.selectedWallet) {
        await this.loadProducts([this.selectedWallet.wallet_id]);
      }
      
      // Show movements and reload
      this.showMovements = true;
      await this.loadMovements();
      
    } catch (error) {
       console.error('Error registering movement:', error);
       let errorMessage = 'Error desconocido';
       if (error && error.message) {
         errorMessage = error.message;
       }
       this.uiService.InfoAlert('Error al registrar el movimiento: ' + errorMessage);
    } finally {
      this.loading = false;
    }
  }

  async loadMovements() {
    if (!this.selectedWallet) return;

    try {
      console.log('Loading movements for wallet:', this.selectedWallet.wallet_id);
      this.movements = await this.inventoryMovementService.getMovements([this.selectedWallet.wallet_id]);
      console.log('Movements loaded:', this.movements);
      
      // Debug: verificar cada movimiento
      this.movements.forEach((movement, index) => {
        console.log(`Movement ${index}:`, {
          id: movement.id,
          product_name: movement.product_name,
          movement_type: movement.movement_type,
          quantity: movement.quantity,
          previous_quantity: movement.previous_quantity,
          new_quantity: movement.new_quantity,
          username: movement.username,
          movement_date: movement.movement_date,
          description: movement.description
        });
      });
    } catch (error) {
      console.error('Error loading movements:', error);
      this.uiService.InfoAlert('Error al cargar los movimientos');
    }
  }

  toggleMovements() {
    this.showMovements = !this.showMovements;
    if (this.showMovements) {
      this.loadMovements();
    }
  }

  getMovementTypeIcon(type: string): string {
    return type === 'ENTRADA' ? 'arrow-up' : 'arrow-down';
  }

  getMovementTypeColor(type: string): string {
    return type === 'ENTRADA' ? 'success' : 'danger';
  }

  formatDate(dateString: string): string {
    try {
      if (!dateString) return 'Fecha no disponible';
      
      // Intentar parsear la fecha
      const date = new Date(dateString);
      
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        console.warn('Fecha inválida recibida:', dateString);
        return 'Fecha inválida';
      }
      
      // Formatear la fecha en español
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      console.error('Error formateando fecha:', dateString, error);
      return 'Error en fecha';
    }
  }
} 