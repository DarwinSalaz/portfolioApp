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
      service.id || service.service_id,
      service.client,
      service.products || service.product_name || '',
      this.parseNumber(service.product_values || service.value || 0),
      this.parseNumber(service.discount || 0),
      this.parseNumber(service.service_value || service.value || 0),
      this.parseNumber(service.debt || 0),
      service.quantity_of_fees || 0,
      service.payments_made || (service.quantity_of_fees ? (service.quantity_of_fees - (service.pending_fees || 0)) : 0),
      service.created_at,
      service.username
    ]);

    const servicesHeaders = [
      'ID',
      'Cliente',
      'Productos',
      'Valor Productos',
      'Descuento',
      'Valor Total',
      'Saldo',
      'Cuotas Totales',
      'Total Abonos',
      'Fecha',
      'Usuario'
    ];

    const servicesWorksheet = XLSXLib.utils.aoa_to_sheet([servicesHeaders, ...servicesSheet]);

    // Hoja de productos vendidos
    const productsSheet = productsSold.map(product => [
      product.product_id || '',
      product.product_name,
      product.quantity_sold || product.total_quantity || 0,
      this.parseNumber(product.value || 0),
      product.wallet || ''
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
      payment.products || '',
      payment.service_created_at || '',
      this.parseNumber(payment.value),
      this.parseNumber(payment.debt),
      payment.created_at,
      payment.username
    ]);

    const paymentsHeaders = [
      'ID',
      'ID Servicio',
      'Cliente',
      'Productos',
      'Fecha Venta',
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
    const totalIncome = walletData.totalIncome || walletData.totalRevenues || 0;
    const totalExpense = walletData.totalExpense || walletData.totalExpenses || 0;
    const generalSummary = [
      ['RESUMEN GENERAL DE CARTERA'],
      [''],
      ['Cartera:', walletName],
      ['Período:', `${startDate} - ${endDate}`],
      [''],
      ['Total Ingresos:', this.parseNumber(totalIncome)],
      ['Total Egresos:', this.parseNumber(totalExpense)],
      ['Balance:', this.parseNumber(totalIncome - totalExpense)]
    ];

    const generalWorksheet = XLSXLib.utils.aoa_to_sheet(generalSummary);

    // Función auxiliar para formatear fecha
    const formatDate = (dateValue: any): string => {
      if (!dateValue) return '';
      
      // Si es string, intentar parsearlo
      if (typeof dateValue === 'string') {
        // Si contiene 'T', tomar solo la parte de la fecha
        if (dateValue.includes('T')) {
          return dateValue.split('T')[0];
        }
        // Si ya es solo fecha, retornarla
        return dateValue;
      }
      
      // Si es un objeto Date, formatearlo
      if (dateValue instanceof Date) {
        const year = dateValue.getFullYear();
        const month = String(dateValue.getMonth() + 1).padStart(2, '0');
        const day = String(dateValue.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      
      return String(dateValue);
    };

    // Hoja de ingresos (el backend devuelve 'incomes' no 'revenues')
    const incomes = walletData.incomes || walletData.revenues || [];
    // Ordenar por fecha ascendente (más antiguos primero)
    const sortedIncomes = incomes.slice().sort((a: any, b: any) => {
      const dateA = new Date(a.date || a.revenue_date || 0).getTime();
      const dateB = new Date(b.date || b.revenue_date || 0).getTime();
      return dateA - dateB;
    });
    if (sortedIncomes.length > 0) {
      const incomesSheet = sortedIncomes.map((income: any) => [
        formatDate(income.date || income.revenue_date),
        income.category || income.revenue_type || '',
        this.parseNumber(income.value),
        income.justification || ''
      ]);

      const incomesHeaders = [
        'Fecha',
        'Tipo',
        'Valor',
        'Justificación'
      ];

      const incomesWorksheet = XLSXLib.utils.aoa_to_sheet([incomesHeaders, ...incomesSheet]);
      XLSXLib.utils.book_append_sheet(workbook, incomesWorksheet, 'Ingresos');
    }

    // Hoja de egresos
    const expenses = walletData.expenses || [];
    // Ordenar por fecha ascendente (más antiguos primero)
    const sortedExpenses = expenses.slice().sort((a: any, b: any) => {
      const dateA = new Date(a.date || a.expense_date || 0).getTime();
      const dateB = new Date(b.date || b.expense_date || 0).getTime();
      return dateA - dateB;
    });
    if (sortedExpenses.length > 0) {
      const expensesSheet = sortedExpenses.map((expense: any) => [
        formatDate(expense.date || expense.expense_date),
        expense.category || expense.expense_type || '',
        this.parseNumber(expense.value),
        expense.justification || ''
      ]);

      const expensesHeaders = [
        'Fecha',
        'Tipo',
        'Valor',
        'Justificación'
      ];

      const expensesWorksheet = XLSXLib.utils.aoa_to_sheet([expensesHeaders, ...expensesSheet]);
      XLSXLib.utils.book_append_sheet(workbook, expensesWorksheet, 'Egresos');
    }

    // Agregar hoja de resumen general
    XLSXLib.utils.book_append_sheet(workbook, generalWorksheet, 'Resumen General');

    this.openExcelFile(workbook, `reporte-cartera-${walletName}-${startDate}.xlsx`);
  }

  exportUserMovementsReport(reportData: any, userFullName: string, startDate: string, endDate: string) {
    const workbook = XLSXLib.utils.book_new();

    // Hoja de movimientos detallados
    const movementsSheet = reportData.movements.map(movement => {
      const dateTimeParts = movement.created_at.split('T');
      const timePart = dateTimeParts[1];
      const timeOnly = timePart ? (timePart.split('.')[0] || '') : '';
      
      return [
        movement.cash_movement_id,
        dateTimeParts[0], // Solo la fecha
        timeOnly, // Solo la hora
        movement.cash_movement_type_label,
        movement.movement_type_label,
        this.parseNumber(movement.value_number),
        this.parseNumber(movement.commission_number),
        this.parseNumber(movement.down_payments_number),
        movement.description || '',
        movement.justification || '',
        movement.wallet_name || '',
        movement.service_id || '',
        movement.payment_id || '',
        movement.expense_id || '',
        movement.revenue_id || ''
      ];
    });

    const movementsHeaders = [
      'ID Movimiento',
      'Fecha',
      'Hora',
      'Tipo de Movimiento',
      'Entrada/Salida',
      'Valor',
      'Comisión',
      'Señas',
      'Descripción',
      'Justificación',
      'Cartera',
      'ID Servicio',
      'ID Pago',
      'ID Gasto',
      'ID Ingreso'
    ];

    const movementsWorksheet = XLSXLib.utils.aoa_to_sheet([movementsHeaders, ...movementsSheet]);

    // Aplicar formato de ancho de columnas
    movementsWorksheet['!cols'] = [
      { wch: 12 }, // ID Movimiento
      { wch: 12 }, // Fecha
      { wch: 10 }, // Hora
      { wch: 20 }, // Tipo de Movimiento
      { wch: 12 }, // Entrada/Salida
      { wch: 15 }, // Valor
      { wch: 12 }, // Comisión
      { wch: 12 }, // Señas
      { wch: 30 }, // Descripción
      { wch: 30 }, // Justificación
      { wch: 20 }, // Cartera
      { wch: 12 }, // ID Servicio
      { wch: 12 }, // ID Pago
      { wch: 12 }, // ID Gasto
      { wch: 12 }  // ID Ingreso
    ];

    // Hoja de resumen
    const summarySheet = [
      ['REPORTE DE MOVIMIENTOS DE USUARIO'],
      [''],
      ['Usuario:', userFullName],
      ['Username:', reportData.username],
      ['Período:', reportData.period_label],
      [''],
      ['RESUMEN GENERAL'],
      [''],
      ['Total Entradas:', this.parseNumber(reportData.total_inputs_number)],
      ['Total Salidas:', this.parseNumber(reportData.total_outputs_number)],
      ['Total Comisiones:', this.parseNumber(reportData.total_commissions_number)],
      ['Total Señas:', this.parseNumber(reportData.total_down_payments_number)],
      [''],
      ['Balance Neto:', this.parseNumber(reportData.net_balance_number)],
      [''],
      ['Total de Movimientos:', reportData.movements_count]
    ];

    const summaryWorksheet = XLSXLib.utils.aoa_to_sheet(summarySheet);

    // Agregar hojas al workbook
    XLSXLib.utils.book_append_sheet(workbook, summaryWorksheet, 'Resumen');
    XLSXLib.utils.book_append_sheet(workbook, movementsWorksheet, 'Movimientos');

    const filename = `reporte-movimientos-${userFullName.replace(/ /g, '-')}-${startDate}.xlsx`;
    this.openExcelFile(workbook, filename);
  }
} 
