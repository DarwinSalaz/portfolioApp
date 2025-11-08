import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BulkRevenueUploadService, RevenueUploadRecord, RevenueValidationResult, RevenueUploadResult } from '../../services/bulk-revenue-upload.service';
import { Wallet } from '../../interfaces/interfaces';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-bulk-revenue-upload',
  templateUrl: './bulk-revenue-upload.page.html',
  styleUrls: ['./bulk-revenue-upload.page.scss'],
})
export class BulkRevenueUploadPage implements OnInit {
  currentStep = 1;
  selectedFile: File | null = null;
  selectedWalletId: number | null = null;
  wallets: Wallet[] = [];
  validationResult: RevenueValidationResult | null = null;
  uploadResult: RevenueUploadResult | null = null;
  parsedRecords: RevenueUploadRecord[] = [];
  isLoading = false;
  isDragOver = false;

  get hasUploadErrors(): boolean {
    return this.uploadResult && this.uploadResult.results && 
           this.uploadResult.results.some(r => !r.success);
  }

  get uploadErrorResults(): any[] {
    if (!this.uploadResult || !this.uploadResult.results) {
      return [];
    }
    return this.uploadResult.results.filter(r => !r.success);
  }

  constructor(
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private bulkRevenueUploadService: BulkRevenueUploadService,
    private storage: Storage,
    private walletService: WalletService
  ) {}

  ngOnInit() {
    this.loadWallets();
  }

  async loadWallets() {
    try {
      const walletIds = await this.storage.get('wallet_ids');
      console.log('Wallet IDs from storage:', walletIds);
      
      if (walletIds && walletIds.length > 0) {
        this.walletService.getWallets(walletIds).subscribe(
          function(wallets) {
            console.log('Wallets loaded:', wallets);
            if (wallets) {
              this.wallets = wallets;
            } else {
              this.wallets = [];
            }
          }.bind(this),
          function(error) {
            console.error('Error loading wallets:', error);
            this.showToast('Error al cargar las carteras', 'danger');
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.validationResult = null;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer && event.dataTransfer.files;
    if (files && files.length > 0) {    
      this.selectedFile = files[0];
      this.validationResult = null;
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.validationResult = null;
  }

  async validateFile() {
    if (!this.selectedFile || !this.selectedWalletId) {
      this.showToast('Por favor selecciona un archivo y una cartera', 'warning');
      return;
    }

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Validando archivo...',
    });
    await loading.present();

    try {
      // Parsear el archivo Excel
      this.parsedRecords = await this.bulkRevenueUploadService.parseExcelFile(this.selectedFile);
      
      // Validar usando el servicio
      const response = await this.bulkRevenueUploadService.validateFile(this.selectedFile, this.selectedWalletId).toPromise();
      console.log('Bulk revenue upload validation response:', response);
      
      this.validationResult = response;
      this.currentStep = 2;

      if (response.isValid) {
        this.showToast('Archivo validado correctamente', 'success');
      } else {
        this.showToast(`Archivo validado con ${response.invalidRecords} errores`, 'warning');
      }

    } catch (error) {
      console.error('Error validating file:', error);
      this.showToast('Error validando archivo: ' + (error.error && error.error.error || error.message), 'danger');
    } finally {
      await loading.dismiss();
      this.isLoading = false;
    }
  }

  async processBulkUpload() {
    if (!this.validationResult || !this.validationResult.isValid) {
      this.showToast('No se puede procesar un archivo con errores', 'danger');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar Cargue',
      message: `¿Estás seguro de que quieres procesar ${this.validationResult.validRecords} ingresos?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Procesar',
          handler: () => this.executeBulkUpload()
        }
      ]
    });

    await alert.present();
  }

  private async executeBulkUpload() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Procesando cargue masivo de ingresos...',
    });
    await loading.present();

    try {
      const requestData = {
        wallet_id: this.selectedWalletId,
        records: this.parsedRecords
      };

      const response = await this.bulkRevenueUploadService.processBulkUpload(requestData).toPromise();
      console.log('Bulk revenue upload process response:', response);
      
      this.uploadResult = response;
      this.currentStep = 3;

      if (response.errorCount === 0) {
        this.showToast('Cargue masivo completado exitosamente', 'success');
      } else {
        this.showToast(`Cargue completado con ${response.errorCount} errores`, 'warning');
      }

    } catch (error) {
      console.error('Error processing bulk upload:', error);
      this.showToast('Error procesando cargue: ' + (error.error && error.error.error || error.message), 'danger');
    } finally {
      await loading.dismiss();
      this.isLoading = false;
    }
  }

  goBackToStep1() {
    this.currentStep = 1;
    this.validationResult = null;
  }

  startNewUpload() {
    this.currentStep = 1;
    this.selectedFile = null;
    this.selectedWalletId = null;
    this.validationResult = null;
    this.uploadResult = null;
  }

  goBack() {
    this.router.navigate(['/menu']);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(value);
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}

