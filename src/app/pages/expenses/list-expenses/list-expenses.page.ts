import { Component, OnInit } from '@angular/core';
import { Expense, Wallet } from 'src/app/interfaces/interfaces';
import { ExpenseService } from 'src/app/services/expense.service';
import { WalletService } from 'src/app/services/wallet.service';
import { Storage } from '@ionic/storage';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-list-expenses',
  templateUrl: './list-expenses.page.html',
  styleUrls: ['./list-expenses.page.scss'],
})
export class ListExpensesPage implements OnInit {

  expenses: Expense[] = [];
  wallets: Wallet[] = [];
  private _selectedWallet: Wallet = null;
  loading: boolean = true;
  refreshing: boolean = false;

  // Filtros
  showFilters: boolean = false;
  startDate: string = '';
  endDate: string = '';
  expenseType: string = '';

  // Tipos de gastos disponibles
  expenseTypes: string[] = [
    'Almuerzo',
    'Gasolina',
    'Alquiler',
    'Repuestos moto',
    'Reparacion moto',
    'Materiales E Insumos',
    'Nómina',
    'Contratos',
    'Viáticos',
    'Prestamos',
    'Compra Muebles x Mayor',
    'Impuestos',
    'Otros'
  ];

  constructor(
    private expenseService: ExpenseService,
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

  async loadExpenses() {
    if (!this.selectedWallet) {
      console.warn('No wallet selected');
      this.loading = false;
      return;
    }

    try {
      this.loading = true;
      console.log('Loading expenses for wallet:', this.selectedWallet.wallet_id);
      
      const response = await this.expenseService.getExpenses(
        this.selectedWallet.wallet_id,
        this.startDate,
        this.endDate,
        this.expenseType
      );
      
      response.subscribe(
        expenses => {
          console.log('Expenses received:', expenses);
          this.expenses = expenses || [];
          this.loading = false;
        },
        error => {
          console.error('Error loading expenses:', error);
          this.uiService.InfoAlert('Error al cargar los gastos: ' + (error.message || 'Error desconocido'));
          this.expenses = [];
          this.loading = false;
        }
      );
    } catch (error) {
      console.error('Error in loadExpenses:', error);
      this.uiService.InfoAlert('Error al cargar los gastos: ' + (error.message || 'Error desconocido'));
      this.expenses = [];
      this.loading = false;
    }
  }

  async refreshExpenses(event: any) {
    this.refreshing = true;
    await this.loadExpenses();
    event.target.complete();
    this.refreshing = false;
  }

  walletChange(wallet: Wallet) {
    console.log('=== WALLET CHANGE EVENT (ngModelChange) ===');
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
    this.loadExpenses();
    this.showFilters = false;
  }

  clearFilters() {
    this.startDate = '';
    this.endDate = '';
    this.expenseType = '';
    this.loadExpenses();
    this.showFilters = false;
  }

  async deleteExpense(expense: Expense) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de que quieres eliminar el gasto "${expense.expense_type}" por $${this.formatCurrency(expense.value)}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.confirmDeleteExpense(expense.expense_id);
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmDeleteExpense(expenseId: number) {
    const loading = await this.loadingController.create({
      message: 'Eliminando gasto...'
    });
    await loading.present();

    try {
      const result = await this.expenseService.deleteExpense(expenseId);
      
      if (result) {
        const toast = await this.toastController.create({
          message: 'Gasto eliminado exitosamente',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        await toast.present();
        
        // Recargar la lista
        this.loadExpenses();
      } else {
        this.uiService.InfoAlert('Error al eliminar el gasto');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      this.uiService.InfoAlert('Error al eliminar el gasto');
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

  getExpenseTypeIcon(expenseType: string): string {
    const iconMap: { [key: string]: string } = {
      'Almuerzo': 'restaurant',
      'Gasolina': 'car',
      'Alquiler': 'home',
      'Repuestos moto': 'construct',
      'Reparacion moto': 'build',
      'Materiales E Insumos': 'cube',
      'Nómina': 'people',
      'Contratos': 'document',
      'Viáticos': 'card',
      'Prestamos': 'cash',
      'Compra Muebles x Mayor': 'business',
      'Impuestos': 'calculator',
      'Otros': 'ellipsis-horizontal'
    };
    
    return iconMap[expenseType] || 'ellipsis-horizontal';
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

  getTotalExpenses(): number {
    return this.expenses.reduce((total, expense) => total + expense.value, 0);
  }

  getExpensesCount(): number {
    return this.expenses.length;
  }

  compareWallets(wallet1: Wallet, wallet2: Wallet): boolean {
    return wallet1 && wallet2 && wallet1.wallet_id === wallet2.wallet_id;
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
        console.log('Wallet changed, loading expenses...');
        this.expenses = [];
        this.loadExpenses();
      }
    }
  }

} 