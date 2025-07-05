import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import * as XLSXLib from 'xlsx';
import { saveAs } from 'file-saver';
import { File as IonicFile } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor(private platform: Platform) { }

  private openExcelFile(workbook: XLSXLib.WorkBook, filename: string) {
    if (this.platform.is('cordova')) {
      // Para móviles, usar la misma lógica que PDF
      const wbout = XLSXLib.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Usar File API para guardar en el directorio de datos de la app
      IonicFile.writeFile(IonicFile.dataDirectory, filename, blob, { replace: true }).then(fileEntry => {
        FileOpener.open(IonicFile.dataDirectory + filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      }).catch(error => {
        console.error('Error al guardar archivo Excel:', error);
        // Fallback: intentar descarga directa
        saveAs(blob, filename);
      });
    } else {
      // Para navegador web
      const wbout = XLSXLib.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, filename);
    }
  }

  private parseNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Remover caracteres no numéricos excepto punto y coma
      let cleanValue = value.replace(/[^\d.,]/g, '');
      
      // Manejar formato colombiano (punto como separador de miles, coma como decimal)
      if (cleanValue.includes('.') && cleanValue.includes(',')) {
        // Formato: 1.234,56 -> 1234.56
        cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
      } else if (cleanValue.includes(',')) {
        // Si solo hay coma, verificar si es decimal o separador de miles
        const parts = cleanValue.split(',');
        if (parts[1] && parts[1].length <= 2) {
          // Probablemente es decimal: 1234,56 -> 1234.56
          cleanValue = cleanValue.replace(',', '.');
        } else {
          // Probablemente es separador de miles: 1,234 -> 1234
          cleanValue = cleanValue.replace(/,/g, '');
        }
      }
      
      const parsed = parseFloat(cleanValue);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  exportSalesReport(servicesData: any[], productsSold: any[], summary: any, walletName: string, startDate: string, endDate: string) {
    const workbook = XLSXLib.utils.book_new();

    // Hoja de servicios
    const servicesSheet = servicesData.map(service => [
      service.service_id,
      service.client,
      service.product_name,
      this.parseNumber(service.value),
      this.parseNumber(service.discount),
      this.parseNumber(service.debt),
      service.created_at,
      service.username
    ]);

    const servicesHeaders = [
      'ID Servicio',
      'Cliente',
      'Producto',
      'Valor',
      'Descuento',
      'Saldo Actual',
      'Fecha',
      'Usuario'
    ];

    const servicesWorksheet = XLSXLib.utils.aoa_to_sheet([servicesHeaders, ...servicesSheet]);

    // Hoja de productos vendidos
    const productsSheet = productsSold.map(product => [
      product.product_id,
      product.product_name,
      product.quantity_sold,
      this.parseNumber(product.value),
      product.wallet
    ]);

    const productsHeaders = [
      'ID Producto',
      'Producto',
      'Cantidad Vendida',
      'Valor',
      'Cartera'
    ];

    const productsWorksheet = XLSXLib.utils.aoa_to_sheet([productsHeaders, ...productsSheet]);

    // Hoja de resumen
    const summarySheet = [
      ['RESUMEN DE VENTAS'],
      [''],
      ['Cartera:', walletName],
      ['Período:', `${startDate} - ${endDate}`],
      [''],
      ['Total Productos:', this.parseNumber(summary.total_product_values)],
      ['Total Descuentos:', this.parseNumber(summary.total_discount)],
      ['Total Servicios:', this.parseNumber(summary.total_service_value)],
      ['Total Deuda:', this.parseNumber(summary.total_debt)]
    ];

    const summaryWorksheet = XLSXLib.utils.aoa_to_sheet(summarySheet);

    // Agregar hojas al workbook
    XLSXLib.utils.book_append_sheet(workbook, servicesWorksheet, 'Servicios');
    XLSXLib.utils.book_append_sheet(workbook, productsWorksheet, 'Productos');
    XLSXLib.utils.book_append_sheet(workbook, summaryWorksheet, 'Resumen');

    this.openExcelFile(workbook, `reporte-ventas-${walletName}-${startDate}.xlsx`);
  }

  exportPaymentsReport(paymentsData: any[], summary: any, walletName: string, startDate: string, endDate: string) {
    const workbook = XLSXLib.utils.book_new();

    // Hoja de pagos
    const paymentsSheet = paymentsData.map(payment => [
      payment.id,
      payment.service_id,
      payment.client,
      this.parseNumber(payment.value),
      this.parseNumber(payment.debt),
      payment.created_at,
      payment.username
    ]);

    const paymentsHeaders = [
      'ID Pago',
      'ID Servicio',
      'Cliente',
      'Valor',
      'Saldo Actual',
      'Fecha',
      'Usuario'
    ];

    const paymentsWorksheet = XLSXLib.utils.aoa_to_sheet([paymentsHeaders, ...paymentsSheet]);

    // Hoja de resumen
    const summarySheet = [
      ['RESUMEN DE PAGOS'],
      [''],
      ['Cartera:', walletName],
      ['Período:', `${startDate} - ${endDate}`],
      [''],
      ['Total Pagos:', this.parseNumber(summary.total_value)],
      ['Total Deuda:', this.parseNumber(summary.total_debt)]
    ];

    const summaryWorksheet = XLSXLib.utils.aoa_to_sheet(summarySheet);

    // Agregar hojas al workbook
    XLSXLib.utils.book_append_sheet(workbook, paymentsWorksheet, 'Pagos');
    XLSXLib.utils.book_append_sheet(workbook, summaryWorksheet, 'Resumen');

    this.openExcelFile(workbook, `reporte-pagos-${walletName}-${startDate}.xlsx`);
  }

  exportInventoryReport(inventoryData: any[], walletName: string, startDate: string, endDate: string) {
    const workbook = XLSXLib.utils.book_new();

    // Hoja de inventario
    const inventorySheet = inventoryData.map(item => [
      item.product_id,
      item.product_name,
      item.quantity_sold,
      item.left_quantity
    ]);

    const inventoryHeaders = [
      'ID Producto',
      'Producto',
      'Cantidad Vendida',
      'Saldo'
    ];

    const inventoryWorksheet = XLSXLib.utils.aoa_to_sheet([inventoryHeaders, ...inventorySheet]);

    // Hoja de resumen
    const summarySheet = [
      ['REPORTE DE INVENTARIO'],
      [''],
      ['Cartera:', walletName],
      ['Período:', `${startDate} - ${endDate}`],
      [''],
      ['Total Productos:', inventoryData.length]
    ];

    const summaryWorksheet = XLSXLib.utils.aoa_to_sheet(summarySheet);

    // Agregar hojas al workbook
    XLSXLib.utils.book_append_sheet(workbook, inventoryWorksheet, 'Inventario');
    XLSXLib.utils.book_append_sheet(workbook, summaryWorksheet, 'Resumen');

    this.openExcelFile(workbook, `reporte-inventario-${walletName}-${startDate}.xlsx`);
  }

  exportExpiredServicesReport(expiredServices: any[], startDate: string, endDate: string) {
    const workbook = XLSXLib.utils.book_new();

    // Hoja de servicios expirados
    const servicesSheet = expiredServices.map(service => [
      service.service_id,
      service.client,
      service.product_name,
      this.parseNumber(service.value),
      this.parseNumber(service.debt),
      service.expired_at,
      service.username
    ]);

    const servicesHeaders = [
      'ID Servicio',
      'Cliente',
      'Producto',
      'Valor',
      'Saldo Actual',
      'Fecha de Expiración',
      'Usuario'
    ];

    const servicesWorksheet = XLSXLib.utils.aoa_to_sheet([servicesHeaders, ...servicesSheet]);

    // Hoja de resumen
    const summarySheet = [
      ['REPORTE DE SERVICIOS EXPIRADOS'],
      [''],
      ['Período:', `${startDate} - ${endDate}`],
      [''],
      ['Total Servicios Expirados:', expiredServices.length],
      ['Total Deuda:', expiredServices.reduce((sum, service) => sum + this.parseNumber(service.debt), 0)]
    ];

    const summaryWorksheet = XLSXLib.utils.aoa_to_sheet(summarySheet);

    // Agregar hojas al workbook
    XLSXLib.utils.book_append_sheet(workbook, servicesWorksheet, 'Servicios Expirados');
    XLSXLib.utils.book_append_sheet(workbook, summaryWorksheet, 'Resumen');

    this.openExcelFile(workbook, `reporte-servicios-expirados-${startDate}.xlsx`);
  }

  exportWalletReport(walletData: any, walletName: string, startDate: string, endDate: string) {
    const workbook = XLSXLib.utils.book_new();

    // Hoja de resumen general
    const generalSummary = [
      ['RESUMEN GENERAL DE CARTERA'],
      [''],
      ['Cartera:', walletName],
      ['Período:', `${startDate} - ${endDate}`],
      [''],
      ['Total Ingresos:', this.parseNumber(walletData.totalRevenues || 0)],
      ['Total Egresos:', this.parseNumber(walletData.totalExpenses || 0)],
      ['Balance:', this.parseNumber((walletData.totalRevenues || 0) - (walletData.totalExpenses || 0))]
    ];

    const generalWorksheet = XLSXLib.utils.aoa_to_sheet(generalSummary);

    // Hoja de ingresos
    if (walletData.revenues && walletData.revenues.length > 0) {
      const revenuesSheet = walletData.revenues.map(revenue => [
        revenue.revenue_id,
        revenue.revenue_type,
        this.parseNumber(revenue.value),
        revenue.revenue_date,
        revenue.justification
      ]);

      const revenuesHeaders = [
        'ID Ingreso',
        'Tipo',
        'Valor',
        'Fecha',
        'Justificación'
      ];

      const revenuesWorksheet = XLSXLib.utils.aoa_to_sheet([revenuesHeaders, ...revenuesSheet]);
      XLSXLib.utils.book_append_sheet(workbook, revenuesWorksheet, 'Ingresos');
    }

    // Hoja de egresos
    if (walletData.expenses && walletData.expenses.length > 0) {
      const expensesSheet = walletData.expenses.map(expense => [
        expense.expense_id,
        expense.expense_type,
        this.parseNumber(expense.value),
        expense.expense_date,
        expense.justification
      ]);

      const expensesHeaders = [
        'ID Egreso',
        'Tipo',
        'Valor',
        'Fecha',
        'Justificación'
      ];

      const expensesWorksheet = XLSXLib.utils.aoa_to_sheet([expensesHeaders, ...expensesSheet]);
      XLSXLib.utils.book_append_sheet(workbook, expensesWorksheet, 'Egresos');
    }

    // Agregar hoja de resumen general
    XLSXLib.utils.book_append_sheet(workbook, generalWorksheet, 'Resumen General');

    this.openExcelFile(workbook, `reporte-cartera-${walletName}-${startDate}.xlsx`);
  }
} 