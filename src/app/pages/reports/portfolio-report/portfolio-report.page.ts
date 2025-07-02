import { Component, OnInit } from '@angular/core';
import { Wallet, WalletReportResponse } from 'src/app/interfaces/interfaces';
import { WalletService } from 'src/app/services/wallet.service';
import { Storage } from '@ionic/storage';
import { NgForm } from '@angular/forms';
import { UiServiceService } from '../../../services/ui-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { Platform, LoadingController, ToastController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-portfolio-report',
  templateUrl: './portfolio-report.page.html',
  styleUrls: ['./portfolio-report.page.scss'],
})
export class PortfolioReportPage implements OnInit {

  wallets: Wallet[] = [];
  wallet: Wallet = null;
  init_date: string;
  end_date: string;
  pdfObj: any;
  selectedReport: string = '';

  constructor(
    private walletService: WalletService,
    private storage: Storage,
    private uiService: UiServiceService,
    public router: Router,
    private transactionService: TransactionService,
    public platform: Platform,
    private productService: ProductService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.init()
  }

  async init() {
    const walletIds = await this.storage.get('wallet_ids');
    console.log("aqui prroo " + walletIds)

    this.walletService.getWallets(walletIds)
        .subscribe( resp => {
          //console.log( resp );
          this.wallets = resp;
          console.log( this.wallets );
        });
  }

  async send(fRegistro: NgForm) {
    if ( fRegistro.invalid ) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }
    this.init_date = this.init_date.split('.')[0].split('T')[0] + "T00:00:00"
    this.end_date = this.end_date.split('.')[0].split('T')[0] + "T00:00:00"

    this.router.navigate(['/portfolio-report-wallet'], {
      queryParams: { init_date : this.init_date, end_date : this.end_date, wallet_id : this.wallet.wallet_id }
    });
  }

  print() {
    if (!this.init_date || !this.end_date || !this.wallet) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }

    this.init_date = this.init_date.split('.')[0].split('T')[0] + "T00:00:00";
    this.end_date = this.end_date.split('.')[0].split('T')[0] + "T00:00:00";

    const response = this.transactionService.getReportPdf(this.init_date, this.end_date, this.wallet.wallet_id);
    response.subscribe(
      resp => {
        console.log(resp);
        var data = [];

        for (var i = 0; i < resp.services_data.length; i++) {
          var row = resp.services_data[i];
          var rowArr = [
            row.id,
            row.client,
            row.products,
            row.product_values,
            row.discount,
            row.service_value,
            row.debt,
            row.created_at,
            row.username
          ];
          data.push(rowArr);
        }

        var dataResume = ['TOTAL', '', '', resp.total_product_values, resp.total_discount, resp.total_service_value, resp.total_debt, '', ''];

        // 👇 Preparamos la tabla de productos vendidos
        var productsTable = [
          [
            { text: 'Producto', style: 'tableHeaderModern' },
            { text: 'Cantidad Vendida', style: 'tableHeaderModern' }
          ]
        ];

        for (let prod of resp.products_sold) {
          productsTable.push([
            { text: prod.product_name, style: 'summaryCellModern' },
            { text: prod.total_quantity.toString(), style: 'summaryCellModern' }
          ]);
        }

        this.printF(data, dataResume, resp.services_data[0].wallet, this.init_date.split('T')[0], this.end_date.split('T')[0], productsTable);
      }
    );
  }




  printF(data, dataResume, wallet, init_date, end_date, productsTable) {
  const today = new Date().toLocaleDateString();

  const docDefinition = {
    pageOrientation: 'landscape',
    content: [
      { text: 'Informe de Ventas', style: 'header' },
      { text: `Cartera: ${wallet}`, style: 'subheader' },
      { text: `Fecha del reporte: ${init_date} / ${end_date}`, margin: [0, 0, 0, 10] },

      {
        style: 'tableModern',
        table: {
          headerRows: 1,
          widths: [25, '*', '*', 55, 45, 60, 45, 50, '*'],
          body: [
            [
              { text: 'ID', style: 'tableHeaderModern' },
              { text: 'Cliente', style: 'tableHeaderModern' },
              { text: 'Productos', style: 'tableHeaderModern' },
              { text: 'Valor Productos', style: 'tableHeaderModern' },
              { text: 'Descuento', style: 'tableHeaderModern' },
              { text: 'Valor Total', style: 'tableHeaderModern' },
              { text: 'Saldo', style: 'tableHeaderModern' },
              { text: 'Fecha', style: 'tableHeaderModern' },
              { text: 'Usuario', style: 'tableHeaderModern' }
            ],
            ...data,
            [
              { text: 'RESUMEN', colSpan: 3, style: 'summaryCellModern' }, {}, {},
              { text: dataResume[3], style: 'summaryCellModern' },
              { text: dataResume[4], style: 'summaryCellModern' },
              { text: dataResume[5], style: 'summaryCellModern' },
              { text: dataResume[6], style: 'summaryCellModern' },
              { text: '', style: 'summaryCellModern' },
              { text: '', style: 'summaryCellModern' }
            ]
          ]
        },
        layout: {
          fillColor: function (rowIndex, node, columnIndex) {
            if (rowIndex === 0) return '#2c3e50';
            if (rowIndex === node.table.body.length - 1) return '#ecfaff';
            return null;
          },
          hLineWidth: function () { return 0.7; },
          vLineWidth: function () { return 0.7; },
          hLineColor: function () { return '#ccc'; },
          vLineColor: function () { return '#ccc'; },
          paddingLeft: function () { return 6; },
          paddingRight: function () { return 6; },
          paddingTop: function () { return 4; },
          paddingBottom: function () { return 4; }
        }
      },

      // 👇 Nueva tabla de resumen de productos vendidos
      { text: 'Resumen de productos vendidos', style: 'subheader', margin: [0, 20, 0, 6] },
      {
        style: 'tableModern',
        table: {
          headerRows: 1,
          widths: ['*', 60],
          body: productsTable
        },
        layout: {
          fillColor: function (rowIndex, node, columnIndex) {
            if (rowIndex === 0) return '#2c3e50';
            return null;
          },
          hLineWidth: function () { return 0.7; },
          vLineWidth: function () { return 0.7; },
          hLineColor: function () { return '#ccc'; },
          vLineColor: function () { return '#ccc'; },
          paddingLeft: function () { return 6; },
          paddingRight: function () { return 6; },
          paddingTop: function () { return 4; },
          paddingBottom: function () { return 4; }
        }
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        color: '#2c3e50',
        margin: [0, 0, 0, 8]
      },
      subheader: {
        fontSize: 12,
        color: '#34495e',
        margin: [0, 0, 0, 6]
      },
      tableModern: {
        fontSize: 9,
        margin: [0, 6, 0, 12]
      },
      tableHeaderModern: {
        bold: true,
        fontSize: 10,
        color: '#ffffff',
        alignment: 'center'
      },
      summaryCellModern: {
        bold: true,
        alignment: 'center',
        fontSize: 9,
        color: '#2c3e50'
      }
    }
  };

  this.pdfObj = pdfMake.createPdf(docDefinition);
  this.openFile('informe-ventas.pdf');
  alert('¡Reporte Generado!');
}

  

  openFile(filename) {
    if(this.platform.is('cordova' )) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        // Save the PDF to the data Directory of our App
        File.writeFile(File.dataDirectory, filename, blob, { replace: true }).then(fileEntry => {

          FileOpener.open(File.dataDirectory + filename, 'application/pdf');

        });

      });

      return true;
    }

    this.pdfObj.download();
  }

  printPaymentsReport() {
    if (!this.init_date || !this.end_date || !this.wallet) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }

    this.init_date = this.init_date.split('.')[0].split('T')[0] + "T00:00:00"
    this.end_date = this.end_date.split('.')[0].split('T')[0] + "T00:00:00"
    const response = this.transactionService.getPaymentsReport(this.init_date, this.end_date, this.wallet.wallet_id);
    response.subscribe(
      resp => {
        console.log( resp );
        var data = []

        for (var i = 0; i < resp.payments_data.length; i++) {
          var row = resp.payments_data[i];
          console.log("Id: " + row.id + ", Valor: " + row.value);
          var rowArr = [row.id, row.service_id, row.client, row.value, row.debt, row.created_at, row.username]

          data.push(rowArr);
        }

        const dataResume = [
          { text: 'RESUMEN', colSpan: 3, style: 'summaryCellModern' }, {}, {},
          { text: resp.total_value, style: 'summaryCellModern' },
          { text: resp.total_debt, style: 'summaryCellModern' },
          { text: '', style: 'summaryCellModern' },
          { text: '', style: 'summaryCellModern' }
        ];

        this.printPaymentReport(data, dataResume, resp.payments_data[0].wallet, this.init_date.split('T')[0], this.end_date.split('T')[0]);
      }
    );
  }

  printPaymentReport(data, dataResume, wallet, init_date, end_date) {
    const today = new Date().toLocaleDateString();
  
    const docDefinition = {
      pageOrientation: 'landscape',
      content: [
        { text: 'Informe de Pagos', style: 'header' },
        { text: `Cartera: ${wallet}`, style: 'subheader' },
        { text: `Fecha del reporte: ${init_date} / ${end_date}`, margin: [0, 0, 0, 10] },
  
        {
          style: 'tableModern',
          table: {
            headerRows: 1,
            widths: [40, 60, '*', 70, 70, 100],
            body: [
              [
                { text: 'ID', style: 'tableHeaderModern' },
                { text: 'ID Servicio', style: 'tableHeaderModern' },
                { text: 'Cliente', style: 'tableHeaderModern' },
                { text: 'Valor', style: 'tableHeaderModern' },
                { text: 'Saldo Actual', style: 'tableHeaderModern' },
                { text: 'Fecha', style: 'tableHeaderModern' },
                { text: 'Usuario', style: 'tableHeaderModern' }
              ],
              ...data,
              dataResume
            ]
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              if (rowIndex === 0) return '#2c3e50';
              if (rowIndex === node.table.body.length - 1) return '#ecfaff';
              return null;
            },
            hLineWidth: function () { return 0.7; },
            vLineWidth: function () { return 0.7; },
            hLineColor: function () { return '#ccc'; },
            vLineColor: function () { return '#ccc'; },
            paddingLeft: function () { return 6; },
            paddingRight: function () { return 6; },
            paddingTop: function () { return 4; },
            paddingBottom: function () { return 4; }
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#2c3e50',
          margin: [0, 0, 0, 8]
        },
        subheader: {
          fontSize: 12,
          color: '#34495e',
          margin: [0, 0, 0, 6]
        },
        tableModern: {
          fontSize: 9,
          margin: [0, 6, 0, 12]
        },
        tableHeaderModern: {
          bold: true,
          fontSize: 10,
          color: '#ffffff',
          alignment: 'center'
        },
        summaryCellModern: {
          bold: true,
          alignment: 'center',
          fontSize: 9,
          color: '#2c3e50'
        }
      }
    };
  
    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.openFile('informe-pagos.pdf');
    alert('¡Reporte Generado!');
  }
  

  printInventoryReport() {
    if (!this.init_date || !this.end_date || !this.wallet) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }

    this.init_date = this.init_date.split('.')[0].split('T')[0] + "T00:00:00"
    this.end_date = this.end_date.split('.')[0].split('T')[0] + "T00:00:00"
    const response = this.productService.getInventoryReport(this.init_date, this.end_date, this.wallet.wallet_id);
    response.subscribe(
      resp => {
        console.log( resp );
        var data = []

        for (var i = 0; i < resp.length; i++) {
          var row = resp[i];
          console.log("Id: " + row.product_id + ", name: " + row.product_name);
          var rowArr = [row.product_id, row.product_name, row.quantity_sold, row.left_quantity]

          data.push(rowArr);
        }

        this.printInventory(data, resp[0].wallet_name, this.init_date.split('T')[0], this.end_date.split('T')[0]);
      }
    );
  }

  printInventory(data, wallet, init_date, end_date) {
    const today = new Date().toLocaleDateString();
  
    const docDefinition = {
      pageOrientation: 'landscape',
      content: [
        { text: 'Informe de Inventario', style: 'header' },
        { text: `Cartera: ${wallet}`, style: 'subheader' },
        { text: `Fecha del reporte:  ${init_date} / ${end_date}`, margin: [0, 0, 0, 10] },
  
        {
          style: 'tableModern',
          table: {
            headerRows: 1,
            widths: [40, '*', 70, 70],
            body: [
              [
                { text: 'ID', style: 'tableHeaderModern' },
                { text: 'Producto', style: 'tableHeaderModern' },
                { text: 'Vendido', style: 'tableHeaderModern' },
                { text: 'Saldo', style: 'tableHeaderModern' }
              ],
              ...data
            ]
          },
          layout: {
            fillColor: function (rowIndex) {
              return rowIndex === 0 ? '#2c3e50' : null;
            },
            hLineWidth: function () { return 0.7; },
            vLineWidth: function () { return 0.7; },
            hLineColor: function () { return '#ccc'; },
            vLineColor: function () { return '#ccc'; },
            paddingLeft: function () { return 6; },
            paddingRight: function () { return 6; },
            paddingTop: function () { return 4; },
            paddingBottom: function () { return 4; }
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#2c3e50',
          margin: [0, 0, 0, 8]
        },
        subheader: {
          fontSize: 12,
          color: '#34495e',
          margin: [0, 0, 0, 6]
        },
        tableModern: {
          fontSize: 9,
          margin: [0, 6, 0, 12]
        },
        tableHeaderModern: {
          bold: true,
          fontSize: 10,
          color: '#ffffff',
          alignment: 'center'
        }
      }
    };
  
    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.openFile('informe-inventario.pdf');
    alert('¡Reporte Generado!');
  }
  

  printExpiredServices() {
    if (!this.init_date || !this.end_date || !this.wallet) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }
  
    this.init_date = this.init_date.split('.')[0].split('T')[0] + "T00:00:00"
    this.end_date = this.end_date.split('.')[0].split('T')[0] + "T00:00:00"
    const response = this.transactionService.getExpiredServiceReport(this.init_date, this.end_date, this.wallet.wallet_id);
    response.subscribe(
      resp => {
        console.log( resp );
        var data = []

        for (var i = 0; i < resp.expired_services.length; i++) {
          var row = resp.expired_services[i];
          var rowArr = [
            row.client,
            row.cellphone,
            row.address,
            row.total_value,
            row.debt,
            row.pending_fees,
            row.next_payment_date,
            row.created_at,
            row.last_payment_date,
            row.expired_fees
          ];

          data.push(rowArr);
        }

        var dataResume = ['TOTAL', '', '', resp.total_value, '', '', '', '', '', ''];

        this.printExpiredServiceReport("Informe de Cuotas Expiradas", data, dataResume, this.init_date.split('T')[0], this.end_date.split('T')[0]);
      }
    );
  }

  printWithdrawalServices() {
    if (!this.init_date || !this.end_date || !this.wallet) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }
  
    this.init_date = this.init_date.split('.')[0].split('T')[0] + "T00:00:00"
    this.end_date = this.end_date.split('.')[0].split('T')[0] + "T00:00:00"
    const response = this.transactionService.getWithdrawalServiceReport(this.init_date, this.end_date, this.wallet.wallet_id);
    response.subscribe(
      resp => {
        console.log( resp );
        var data = []

        for (var i = 0; i < resp.expired_services.length; i++) {
          var row = resp.expired_services[i];
          var rowArr = [
            row.client,
            row.cellphone,
            row.address,
            row.total_value,
            row.debt,
            row.pending_fees,
            row.next_payment_date,
            row.created_at,
            row.last_payment_date,
            row.expired_fees
          ];

          data.push(rowArr);
        }

        var dataResume = ['TOTAL', '', '', resp.total_value, '', '', '', '', '', ''];

        this.printExpiredServiceReport("Informe Cuentas Para Retiro", data, dataResume, this.init_date.split('T')[0], this.end_date.split('T')[0]);
      }
    );
  }

  printCanceledServices() {
    if (!this.init_date || !this.end_date || !this.wallet) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }
  
    this.init_date = this.init_date.split('.')[0].split('T')[0] + "T00:00:00"
    this.end_date = this.end_date.split('.')[0].split('T')[0] + "T00:00:00"
    const response = this.transactionService.getCanceledServiceReport(this.init_date, this.end_date, this.wallet.wallet_id);
    response.subscribe(
      resp => {
        console.log( resp );
        var data = []

        for (var i = 0; i < resp.expired_services.length; i++) {
          var row = resp.expired_services[i];
          var rowArr = [
            row.client,
            row.cellphone,
            row.address,
            row.total_value,
            row.debt,
            row.pending_fees,
            row.next_payment_date,
            row.created_at,
            row.last_payment_date,
            row.expired_fees
          ];

          data.push(rowArr);
        }

        var dataResume = ['TOTAL', '', '', resp.total_value, '', '', '', '', '', ''];

        this.printExpiredServiceReport("Informe Cuentas Canceladas", data, dataResume, this.init_date.split('T')[0], this.end_date.split('T')[0]);
      }
    );
  }


  printExpiredServiceReport(name, data, dataResume, init_date, end_date) {
    const today = new Date().toLocaleDateString();

    const docDefinition = {
      pageOrientation: 'landscape',
      content: [
        { text: name, style: 'header' },
        { text: `Fecha del reporte: ${init_date} / ${end_date}`, style: 'subheader' },

        {
          style: 'tableModern',
          table: {
            headerRows: 1,
            widths: [80, 70, 90, 50, 50, 50, 60, 60, 60, 50],
            body: [
              [
                { text: 'Cliente', style: 'tableHeaderModern' },
                { text: 'Celular', style: 'tableHeaderModern' },
                { text: 'Dirección', style: 'tableHeaderModern' },
                { text: 'Total', style: 'tableHeaderModern' },
                { text: 'Deuda', style: 'tableHeaderModern' },
                { text: 'Cuotas Faltantes', style: 'tableHeaderModern' },
                { text: 'Fec. Próx. Pago', style: 'tableHeaderModern' },
                { text: 'Fec. Creación', style: 'tableHeaderModern' },
                { text: 'Último Pago', style: 'tableHeaderModern' },
                { text: 'Cuotas Vencidas', style: 'tableHeaderModern' }
              ],
              ...data,
              dataResume
            ]
          },
          layout: {
            fillColor: function (rowIndex) {
              return rowIndex === 0 ? '#2c3e50' : null;
            },
            hLineWidth: function () { return 0.7; },
            vLineWidth: function () { return 0.7; },
            hLineColor: function () { return '#ccc'; },
            vLineColor: function () { return '#ccc'; },
            paddingLeft: function () { return 6; },
            paddingRight: function () { return 6; },
            paddingTop: function () { return 4; },
            paddingBottom: function () { return 4; }
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#2c3e50',
          margin: [0, 0, 0, 8]
        },
        subheader: {
          fontSize: 12,
          color: '#34495e',
          margin: [0, 0, 0, 12]
        },
        tableModern: {
          fontSize: 9,
          margin: [0, 6, 0, 12]
        },
        tableHeaderModern: {
          bold: true,
          fontSize: 10,
          color: '#ffffff',
          alignment: 'center'
        }
      }
    };

    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.openFile('informe-cuentas-expiradas.pdf');
    alert('¡Reporte Generado!');
  }

  async generateWalletReport() {
    if (!this.wallet || !this.init_date || !this.end_date) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor selecciona la cartera y las fechas.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Generando reporte...'
    });
    await loading.present();

    this.init_date = this.init_date.split('.')[0].split('T')[0] + "T00:00:00";
    this.end_date = this.end_date.split('.')[0].split('T')[0] + "T00:00:00";

    const payload = {
      wallet_id: this.wallet.wallet_id,
      starts_at: this.init_date,
      ends_at: this.end_date
    };

    this.transactionService.generateWalletResumeReport(payload).subscribe({
      next: async (data: WalletReportResponse) => {
        loading.dismiss();

        const docDefinition = this.buildPdfDefinition(data);
        this.pdfObj = pdfMake.createPdf(docDefinition);
        this.openFile(`reporte_${data.walletName}.pdf`);
      },
      error: async (err) => {
        loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Error al generar el reporte',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
        console.error(err);
      }
    });
  }

  buildPdfDefinition(data: any) {
    const { walletName, startsAt, endsAt, incomes, expenses, totalIncome, totalExpense, finalBalance } = data;

    const formatCurrency = (value: number) => {
      return '$' + value.toLocaleString('es-CO', { minimumFractionDigits: 2 });
    };

    const buildTable = (title: string, items: any[]) => {
      const body: any[] = [
        ['Fecha', 'Tipo', 'Valor', 'Justificación']
      ];


      for (const item of items) {
        body.push([
          item.date.split('T')[0],
          item.category,
          formatCurrency(item.value),
          item.justification || ''
        ]);
      }

      const total = items.reduce((acc, cur) => acc + Number(cur.value), 0);

      body.push([
        { text: 'TOTAL', bold: true, colSpan: 2 }, '', 
        { text: formatCurrency(total), bold: true },
        ''
      ]);

      return [
        { text: title, style: 'sectionHeader', margin: [0, 10, 0, 5] },
        {
          table: { widths: ['auto', '*', 'auto', '*'], body },
          layout: 'lightHorizontalLines'
        }
      ];
    };

    return {
      content: [
        { text: 'Resumen de Ingresos y Gastos', style: 'header' },
        { text: `Cartera: ${walletName}`, margin: [0, 5] },
        { text: `Desde: ${startsAt.split('T')[0]}  Hasta: ${endsAt.split('T')[0]}`, margin: [0, 0, 0, 10] },

        ...buildTable('INGRESOS', incomes),
        ...buildTable('GASTOS', expenses),

        { text: 'Resumen Final', style: 'sectionHeader', margin: [0, 15, 0, 5] },
        {
          table: {
            widths: ['*', 'auto'],
            body: [
              ['Total Ingresos', formatCurrency(totalIncome)],
              ['Total Gastos', formatCurrency(totalExpense)],
              [
                { text: 'Saldo Final', bold: true },
                {
                  text: formatCurrency(finalBalance),
                  color: finalBalance >= 0 ? 'green' : 'red'
                }
              ]
            ]
          },
          layout: 'lightHorizontalLines'
        }
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true
        },
        sectionHeader: {
          fontSize: 14,
          bold: true
        }
      },
      defaultStyle: {
        fontSize: 10
      }
    };
  }


  generateSelectedReport() {
    if (!this.init_date || !this.end_date || !this.wallet) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }

    switch (this.selectedReport) {
      case 'sales':
        this.print();
        break;
      case 'payments':
        this.printPaymentsReport();
        break;
      case 'inventory':
        this.printInventoryReport();
        break;
      case 'expired':
        this.printExpiredServices();
        break;
      case 'withdrawal':
        this.printWithdrawalServices();
        break;
      case 'canceled':
        this.printCanceledServices();
        break;
      case 'wallet':
        this.generateWalletReport();
        break;
      default:
        this.uiService.InfoAlert('Seleccione un tipo de reporte válido');
    }
  }

}


