import { Component, OnInit } from '@angular/core';
import { Revenue, Wallet } from 'src/app/interfaces/interfaces';
import { RevenueService } from 'src/app/services/revenue.service';
import { WalletService } from 'src/app/services/wallet.service';
import { Storage } from '@ionic/storage';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-list-revenues',
  templateUrl: './list-revenues.page.html',
  styleUrls: ['./list-revenues.page.scss'],
})
export class ListRevenuesPage implements OnInit {

  revenues: Revenue[] = [];
  wallets: Wallet[] = [];
  private _selectedWallet: Wallet = null;
  loading: boolean = true;
  refreshing: boolean = false;

  // Filtros
  showFilters: boolean = false;
  startDate: string = '';
  endDate: string = '';
  revenueType: string = '';

  // Tipos de ingresos disponibles
  revenueTypes: string[] = [
    'Efectivo Carteras',
    'Venta Insumos Y Materiales',
    'Abono Deuda',
    'Venta Directa',
    'Liquidación Parcial Cartera',
    'Otros'
  ];

  constructor(
    private revenueService: RevenueService,
    private walletService: WalletService,
    private storage: Storage,
    private uiService: UiServiceService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.init();
  }

  // Getter y setter para selectedWallet
  get selectedWallet(): Wallet {
    return this._selectedWallet;
  }

  set selectedWallet(wallet: Wallet) {
    console.log('=== SETTER CALLED ===');
    console.log('Previous wallet:', this._selectedWallet);
    console.log('New wallet:', wallet);
    
    if (this._selectedWallet !== wallet) {
      this._selectedWallet = wallet;
      if (wallet) {
        console.log('Wallet changed, loading revenues...');
        this.revenues = [];
        this.loadRevenues();
      }
    }
  }

  async init() {
    try {
      const walletIds = await this.storage.get('wallet_ids');
      console.log('Wallet IDs from storage:', walletIds);
      
      if (!walletIds || walletIds.length === 0) {
        console.warn('No wallet IDs found in storage');
        this.uiService.InfoAlert('No se encontraron carteras asignadas');
        this.loading = false;
        return;
      }
      
      // Cargar carteras
      this.walletService.getWallets(walletIds).subscribe(
        wallets => {
          console.log('Wallets received from API:', wallets);
          this.wallets = wallets;
          if (wallets && wallets.length > 0) {
            // Usar el setter para la primera cartera
            this.selectedWallet = wallets[0];
            console.log('Initial wallet set:', this.selectedWallet);
          } else {
            console.warn('No wallets received from API');
            this.uiService.InfoAlert('No se encontraron carteras disponibles');
            this.loading = false;
          }
        },
        error => {
          console.error('Error loading wallets:', error);
          this.uiService.InfoAlert('Error al cargar las carteras: ' + (error.message || 'Error desconocido'));
          this.loading = false;
        }
      );
    } catch (error) {
      console.error('Error in init:', error);
      this.uiService.InfoAlert('Error al inicializar: ' + (error.message || 'Error desconocido'));
      this.loading = false;
    }
  }

  async loadRevenues() {
    if (!this.selectedWallet) {
      console.warn('No wallet selected');
      this.loading = false;
      return;
    }

    try {
      this.loading = true;
      console.log('Loading revenues for wallet:', this.selectedWallet.wallet_id);
      
      const response = await this.revenueService.getRevenues(
        this.selectedWallet.wallet_id,
        this.startDate,
        this.endDate,
        this.revenueType
      );
      
      response.subscribe(
        revenues => {
          console.log('Revenues received:', revenues);
          this.revenues = revenues || [];
          this.loading = false;
        },
        error => {
          console.error('Error loading revenues:', error);
          this.uiService.InfoAlert('Error al cargar los ingresos: ' + (error.message || 'Error desconocido'));
          this.revenues = [];
          this.loading = false;
        }
      );
    } catch (error) {
      console.error('Error in loadRevenues:', error);
      this.uiService.InfoAlert('Error al cargar los ingresos: ' + (error.message || 'Error desconocido'));
      this.revenues = [];
      this.loading = false;
    }
  }

  async refreshRevenues(event: any) {
    this.refreshing = true;
    await this.loadRevenues();
    event.target.complete();
    this.refreshing = false;
  }

  walletChange(wallet: Wallet) {
    console.log('=== REVENUE WALLET CHANGE EVENT (ngModelChange) ===');
    console.log('New wallet value:', wallet);
    
    if (!wallet) {
      console.warn('No wallet value received');
      return;
    }
    
    // El setter se encargará de la lógica
    this.selectedWallet = wallet;
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  applyFilters() {
    this.loadRevenues();
    this.showFilters = false;
  }

  clearFilters() {
    this.startDate = '';
    this.endDate = '';
    this.revenueType = '';
    this.loadRevenues();
    this.showFilters = false;
  }

  async deleteRevenue(revenue: Revenue) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de que quieres eliminar el ingreso "${revenue.revenue_type}" por $${this.formatCurrency(revenue.value)}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.confirmDeleteRevenue(revenue.revenue_id);
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmDeleteRevenue(revenueId: number) {
    const loading = await this.loadingController.create({
      message: 'Eliminando ingreso...'
    });
    await loading.present();

    try {
      const result = await this.revenueService.deleteRevenue(revenueId);
      
      if (result) {
        const toast = await this.toastController.create({
          message: 'Ingreso eliminado exitosamente',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        await toast.present();
        
        // Recargar la lista
        this.loadRevenues();
      } else {
        this.uiService.InfoAlert('Error al eliminar el ingreso');
      }
    } catch (error) {
      console.error('Error deleting revenue:', error);
      this.uiService.InfoAlert('Error al eliminar el ingreso');
    } finally {
      loading.dismiss();
    }
  }

  formatCurrency(value: number | string): string {
    if (!value && value !== 0) return '';
    const num = value.toString().replace(/\D/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  formatDate(date: string): string {
    return moment(date).format('DD/MM/YYYY');
  }

  getRevenueTypeIcon(revenueType: string): string {
    const iconMap: { [key: string]: string } = {
      'Efectivo Carteras': 'cash',
      'Venta Insumos Y Materiales': 'cube',
      'Abono Deuda': 'card',
      'Venta Directa': 'trending-up',
      'Liquidación Parcial Cartera': 'wallet',
      'Otros': 'ellipsis-horizontal'
    };
    
    return iconMap[revenueType] || 'ellipsis-horizontal';
  }

  getWalletStatusInfo(): string {
    if (!this.wallets || this.wallets.length === 0) {
      return 'No hay carteras disponibles';
    }
    
    if (this.wallets.length === 1) {
      return `1 cartera disponible: ${this.wallets[0].name}`;
    }
    
    return `${this.wallets.length} carteras disponibles`;
  }

  getTotalRevenues(): number {
    return this.revenues.reduce((total, revenue) => total + revenue.value, 0);
  }

  getRevenuesCount(): number {
    return this.revenues.length;
  }

  compareWallets(wallet1: Wallet, wallet2: Wallet): boolean {
    return wallet1 && wallet2 && wallet1.wallet_id === wallet2.wallet_id;
  }

} 