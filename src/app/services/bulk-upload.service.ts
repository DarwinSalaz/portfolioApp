import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { read, utils } from 'xlsx';
import { Storage } from '@ionic/storage';
import { switchMap } from 'rxjs/operators';

export interface BulkUploadRecord {
  name: string;
  last_name?: string;
  cellphone?: string;
  email?: string;
  address?: string;
  identification_number?: string;
  gender?: string;
  observation?: string;
  valor_servicio: number;
  cuota_inicial: number;
  descuento: number;
  deuda: number;
  valor_total: number;
  dias_cuota: number;
  nro_cuotas: number;
  valor_cuota: number;
  abono?: number;
  next_payment_date: string;
  application_user_id?: number;
  product_name: string;
  product_quantity: string;
}

export interface BulkUploadRequest {
  wallet_id: number;
  records: BulkUploadRecord[];
}

export interface ValidationResult {
  valid: boolean;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  errors: Array<{
    rowNumber: number;
    field: string;
    message: string;
  }>;
  summary: {
    totalCustomers: number;
    totalServices: number;
    totalProducts: number;
    estimatedValue: number;
  };
}

export interface UploadResult {
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  results: Array<{
    rowNumber: number;
    success: boolean;
    customerId?: number;
    serviceId?: number;
    message: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class BulkUploadService {
  private readonly API_URL = environment.url;

  constructor(private http: HttpClient, private storage: Storage) {}

  validateFile(file: File, walletId: number): Observable<ValidationResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('wallet_id', walletId.toString());

    return from(this.storage.get('token')).pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          'Authorization': token
        });
        return this.http.post<ValidationResult>(
          `${this.API_URL}/api/portfolio/bulk-upload/validate`,
          formData,
          { headers }
        );
      })
    );
  }

  processBulkUpload(request: BulkUploadRequest): Observable<UploadResult> {
    return from(this.storage.get('token')).pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          'Authorization': token,
          'Content-Type': 'application/json'
        });
        return this.http.post<UploadResult>(
          `${this.API_URL}/api/portfolio/bulk-upload/process`,
          request,
          { headers }
        );
      })
    );
  }

  parseExcelFile(file: File): Promise<BulkUploadRecord[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const target = e.target as FileReader;
          const data = new Uint8Array(target.result as ArrayBuffer);
          const workbook = read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const records = utils.sheet_to_json(worksheet, { header: 1 });
          
          // Convertir a formato BulkUploadRecord
          const bulkRecords: BulkUploadRecord[] = [];
          
          // Saltar la primera fila (headers)
          for (let i = 1; i < records.length; i++) {
            const row = records[i] as any[];
            if (row.length === 0) continue;
            
            try {
              // Manejo especial de fechas de Excel (serial numérico)
              const rawNextPayment = row[20];
              let nextPaymentStr = this.getStringValue(rawNextPayment);
              if (typeof rawNextPayment === 'number') {
                nextPaymentStr = this.excelSerialToDateTimeString(rawNextPayment);
              }

              const record: BulkUploadRecord = {
                // 0: codigo (ignored)
                name: this.getStringValue(row[1]),
                last_name: this.getStringValue(row[2]),
                cellphone: this.getStringValue(row[3]) || '0',
                email: this.getStringValue(row[4]),
                address: this.getStringValue(row[5]),
                identification_number: this.getStringValue(row[6]),
                gender: this.getStringValue(row[7]),
                observation: this.getStringValue(row[8]),
                product_name: this.getStringValue(row[9]),
                product_quantity: this.getStringValue(row[10]),
                valor_servicio: this.getNumberValue(row[11]),
                descuento: this.getNumberValue(row[12]),
                valor_total: this.getNumberValue(row[13]),
                cuota_inicial: this.getNumberValue(row[14]),
                abono: this.getNumberValue(row[15]) || 0,
                deuda: this.getNumberValue(row[16]),
                nro_cuotas: this.getIntValue(row[17]),
                dias_cuota: this.getIntValue(row[18]),
                valor_cuota: this.getNumberValue(row[19]),
                next_payment_date: nextPaymentStr
              };
              
              bulkRecords.push(record);
            } catch (error) {
              console.warn(`Error parsing row ${i + 1}:`, error);
              continue;
            }
          }
          
          resolve(bulkRecords);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsArrayBuffer(file);
    });
  }

  private getStringValue(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value).trim();
  }

  private getNumberValue(value: any): number {
    if (value === null || value === undefined) return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }

  private getIntValue(value: any): number {
    return Math.floor(this.getNumberValue(value));
  }

  // Convierte un serial de Excel a string 'yyyy-MM-dd HH:mm:ss'
  private excelSerialToDateTimeString(serial: number): string {
    // Excel epoch starts at 1899-12-30
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const millis = Math.round(serial * 24 * 60 * 60 * 1000);
    const dt = new Date(excelEpoch.getTime() + millis);
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = dt.getUTCFullYear();
    const MM = pad(dt.getUTCMonth() + 1);
    const dd = pad(dt.getUTCDate());
    const HH = pad(dt.getUTCHours());
    const mm = pad(dt.getUTCMinutes());
    const ss = pad(dt.getUTCSeconds());
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
  }
}