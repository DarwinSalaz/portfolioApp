import { Component, OnInit } from '@angular/core';
import { Wallet } from 'src/app/interfaces/interfaces';
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
import { Platform } from '@ionic/angular';
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

  constructor(
    private walletService: WalletService,
    private storage: Storage,
    private uiService: UiServiceService,
    public router: Router,
    private transactionService: TransactionService,
    public platform: Platform,
    private productService: ProductService
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

    this.init_date = this.init_date.split('.')[0].split('T')[0] + "T00:00:00"
    this.end_date = this.end_date.split('.')[0].split('T')[0] + "T00:00:00"
    const response = this.transactionService.getReportPdf(this.init_date, this.end_date, this.wallet.wallet_id);
    response.subscribe(
      resp => {
        console.log( resp );
        var data = []

        for (var i = 0; i < resp.services_data.length; i++) {
          var row = resp.services_data[i];
          console.log("Nombre: " + row.id + ", Valor: " + row.product_values);
          var rowArr = [row.id, row.client, row.products, row.product_values, row.discount, row.service_value, row.debt, row.created_at, row.username]

          data.push(rowArr);
        }

        var dataResume = ['TOTAL', '', '', resp.total_product_values, resp.total_discount, resp.total_service_value, resp.total_debt, '', '']

        this.printF(data, dataResume, resp.services_data[0].wallet);
      }
    );
  }



  printF(data, dataResume, wallet) {
    let docDefinition = {
      content: [
        {text: 'Informe De Ventas - Cartera: ' + wallet, style: 'header'},
        {
          style: 'tableExample',
          color: '#444',
          alignment: 'center',
          fontSize: 10,
          table: {
            headerRows: 1,
            widths: [30, 'auto','auto', 'auto','auto', 'auto','auto', 'auto','auto'],
            //widths: ['*', '*','*', '*','*', '*','*', '*','*'],
            body: [
              [
                {text:'ID', alignment: 'center', style: 'tableHeader'}, 
                {text:'Cliente', alignment: 'center', style: 'tableHeader'}, 
                {text:'Productos', alignment: 'center', style: 'tableHeader'},
                {text:'Valor Productos', alignment: 'center', style: 'tableHeader'},
                {text:'Descuento', alignment: 'center', style: 'tableHeader'}, 
                {text:'Valor Total', alignment: 'center', style: 'tableHeader'},
                {text:'Saldo', alignment: 'center', style: 'tableHeader'}, 
                {text:'Fecha', alignment: 'center', style: 'tableHeader'}, 
                {text:'Usuario', alignment: 'center', style: 'tableHeader'}, 
              ],
              ...data,
              dataResume
            ]
          }
        },
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: 'black'
        }
      },
      layout: {
				hLineWidth: function (i, node) {
					return (i === 0 || i === node.table.body.length) ? 2 : 1;
				},
				vLineWidth: function (i, node) {
					return (i === 0 || i === node.table.widths.length) ? 2 : 1;
				},
				hLineColor: function (i, node) {
					return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
				},
				vLineColor: function (i, node) {
					return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
				},
				// hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
				// vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
				// paddingLeft: function(i, node) { return 4; },
				// paddingRight: function(i, node) { return 4; },
				// paddingTop: function(i, node) { return 2; },
				// paddingBottom: function(i, node) { return 2; },
				// fillColor: function (rowIndex, node, columnIndex) { return null; }
			},
      defaultStyle: {
        // alignment: 'justify'
      }
    };

    this.pdfObj = pdfMake.createPdf(docDefinition);

    this.openFile('informe-ventas.pdf');

    alert('Reporte Generado!')
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
          var rowArr = [row.id, row.service_id, row.client, row.value, row.created_at, row.username]

          data.push(rowArr);
        }

        var dataResume = ['TOTAL', '', '', resp.total_value, '', '']

        this.printPaymentReport(data, dataResume, resp.payments_data[0].wallet);
      }
    );
  }

  printPaymentReport(data, dataResume, wallet) {
    let docDefinition = {
      content: [
        {text: 'Informe De Pagos - Cartera: ' + wallet, style: 'header'},
        {
          style: 'tableExample',
          color: '#444',
          alignment: 'center',
          fontSize: 10,
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 200, 'auto','auto', 'auto'],
            body: [
              [
                {text:'ID', alignment: 'center', style: 'tableHeader'}, 
                {text:'ID Servicio', alignment: 'center', style: 'tableHeader'}, 
                {text:'Cliente', alignment: 'center', style: 'tableHeader'}, 
                {text:'Valor', alignment: 'center', style: 'tableHeader'},
                {text:'Fecha', alignment: 'center', style: 'tableHeader'}, 
                {text:'Usuario', alignment: 'center', style: 'tableHeader'}, 
              ],
              ...data,
              dataResume
            ]
          }
        },
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: 'black'
        }
      },
      layout: {
				hLineWidth: function (i, node) {
					return (i === 0 || i === node.table.body.length) ? 2 : 1;
				},
				vLineWidth: function (i, node) {
					return (i === 0 || i === node.table.widths.length) ? 2 : 1;
				},
				hLineColor: function (i, node) {
					return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
				},
				vLineColor: function (i, node) {
					return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
				},
				// hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
				// vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
				// paddingLeft: function(i, node) { return 4; },
				// paddingRight: function(i, node) { return 4; },
				// paddingTop: function(i, node) { return 2; },
				// paddingBottom: function(i, node) { return 2; },
				// fillColor: function (rowIndex, node, columnIndex) { return null; }
			},
      defaultStyle: {
        // alignment: 'justify'
      }
    };

    this.pdfObj = pdfMake.createPdf(docDefinition);

    this.openFile('informe-pagos.pdf');

    alert('Reporte Generado!')
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

        this.printInventory(data, resp[0].wallet_name);
      }
    );
  }

  printInventory(data, wallet) {
    let docDefinition = {
      content: [
        {text: 'Informe De Inventario - Cartera: ' + wallet, style: 'header'},
        {
          style: 'tableExample',
          color: '#444',
          alignment: 'center',
          fontSize: 10,
          table: {
            headerRows: 1,
            widths: ['auto', 300, 'auto', 'auto'],
            body: [
              [
                {text:'ID', alignment: 'center', style: 'tableHeader'}, 
                {text:'Producto', alignment: 'center', style: 'tableHeader'}, 
                {text:'Vendido', alignment: 'center', style: 'tableHeader'}, 
                {text:'Saldo', alignment: 'center', style: 'tableHeader'},
              ],
              ...data
            ]
          }
        },
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: 'black'
        }
      },
      layout: {
				hLineWidth: function (i, node) {
					return (i === 0 || i === node.table.body.length) ? 2 : 1;
				},
				vLineWidth: function (i, node) {
					return (i === 0 || i === node.table.widths.length) ? 2 : 1;
				},
				hLineColor: function (i, node) {
					return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
				},
				vLineColor: function (i, node) {
					return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
				},
				// hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
				// vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
				// paddingLeft: function(i, node) { return 4; },
				// paddingRight: function(i, node) { return 4; },
				// paddingTop: function(i, node) { return 2; },
				// paddingBottom: function(i, node) { return 2; },
				// fillColor: function (rowIndex, node, columnIndex) { return null; }
			},
      defaultStyle: {
        // alignment: 'justify'
      }
    };

    this.pdfObj = pdfMake.createPdf(docDefinition);

    this.openFile('informe-inventario.pdf');

    alert('Reporte Generado!')
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
          var rowArr = [row.client, row.cellphone, row.address, row.total_value, row.debt, row.pending_fees, row.next_payment_date]

          data.push(rowArr);
        }

        var dataResume = ['TOTAL', '', '', resp.total_value, '', '', '']

        this.printExpiredServiceReport(data, dataResume);
      }
    );
  }


  printExpiredServiceReport(data, dataResume) {
    let docDefinition = {
      content: [
        {text: 'Informe De Coutas Expiradas', style: 'header'},
        {
          style: 'tableExample',
          color: '#444',
          alignment: 'center',
          fontSize: 10,
          table: {
            headerRows: 1,
            widths: [100, 'auto', 'auto', 'auto','auto', 'auto', 'auto'],
            body: [
              [
                {text:'Cliente', alignment: 'center', style: 'tableHeader'}, 
                {text:'Celular', alignment: 'center', style: 'tableHeader'}, 
                {text:'Dirección', alignment: 'center', style: 'tableHeader'}, 
                {text:'Total', alignment: 'center', style: 'tableHeader'},
                {text:'Deuda', alignment: 'center', style: 'tableHeader'}, 
                {text:'Cuotas Pend', alignment: 'center', style: 'tableHeader'}, 
                {text:'Fec Pago', alignment: 'center', style: 'tableHeader'}, 
              ],
              ...data,
              dataResume
            ]
          }
        },
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: 'black'
        }
      },
      layout: {
				hLineWidth: function (i, node) {
					return (i === 0 || i === node.table.body.length) ? 2 : 1;
				},
				vLineWidth: function (i, node) {
					return (i === 0 || i === node.table.widths.length) ? 2 : 1;
				},
				hLineColor: function (i, node) {
					return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
				},
				vLineColor: function (i, node) {
					return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
				},
			},
      defaultStyle: {
        // alignment: 'justify'
      }
    };

    this.pdfObj = pdfMake.createPdf(docDefinition);

    this.openFile('informe-pagos-pendientes.pdf');

    alert('Reporte Generado!')
  }

}


