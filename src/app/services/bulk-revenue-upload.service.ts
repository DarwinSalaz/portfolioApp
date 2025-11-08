import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { read, utils } from 'xlsx';
import { Storage } from '@ionic/storage';
import { switchMap } from 'rxjs/operators';

export interface RevenueUploadRecord {
  revenue_type: string;
  value: number;
  revenue_date: string;
  justification?: string;
  username?: string;
}

export interface BulkRevenueUploadRequest {
  wallet_id: number;
  records: RevenueUploadRecord[];
}

export interface RevenueValidationResult {
  isValid: boolean;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  errors: Array<{
    rowNumber: number;
    field: string;
    message: string;
  }>;
  summary: {
    totalRevenues: number;
    estimatedValue: number;
  };
}

export interface RevenueUploadResult {
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  results: Array<{
    rowNumber: number;
    success: boolean;
    revenueId?: number;
    message: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class BulkRevenueUploadService {
  private readonly API_URL = environment.url;

  constructor(private http: HttpClient, private storage: Storage) {}

  validateFile(file: File, walletId: number): Observable<RevenueValidationResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('wallet_id', walletId.toString());

    return from(this.storage.get('token')).pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          'Authorization': token
        });
        return this.http.post<RevenueValidationResult>(
          `${this.API_URL}/api/portfolio/bulk-revenue-upload/validate`,
          formData,
          { headers }
        );
      })
    );
  }

  processBulkUpload(request: BulkRevenueUploadRequest): Observable<RevenueUploadResult> {
    return from(this.storage.get('token')).pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          'Authorization': token,
          'Content-Type': 'application/json'
        });
        return this.http.post<RevenueUploadResult>(
          `${this.API_URL}/api/portfolio/bulk-revenue-upload/process`,
          request,
          { headers }
        );
      })
    );
  }

  parseExcelFile(file: File): Promise<RevenueUploadRecord[]> {
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
          
          const revenueRecords: RevenueUploadRecord[] = [];
          
          // Saltar la primera fila (headers)
          for (let i = 1; i < records.length; i++) {
            const row = records[i] as any[];
            if (row.length === 0) continue;
            
            try {
              // Manejo especial de fechas de Excel (serial numérico)
              const rawDate = row[2];
              let dateStr = this.getStringValue(rawDate);
              if (typeof rawDate === 'number') {
                dateStr = this.excelSerialToDateString(rawDate);
              }

              const record: RevenueUploadRecord = {
                revenue_type: this.getStringValue(row[0]),
                value: this.getNumberValue(row[1]),
                revenue_date: dateStr,
                justification: this.getStringValue(row[3])
              };
              
              revenueRecords.push(record);
            } catch (error) {
              console.warn(`Error parsing row ${i + 1}:`, error);
              continue;
            }
          }
          
          resolve(revenueRecords);
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

  private excelSerialToDateString(serial: number): string {
    // Excel epoch starts at 1899-12-30
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const millis = Math.round(serial * 24 * 60 * 60 * 1000);
    const dt = new Date(excelEpoch.getTime() + millis);
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = dt.getUTCFullYear();
    const MM = pad(dt.getUTCMonth() + 1);
    const dd = pad(dt.getUTCDate());
    return `${MM}/${dd}/${yyyy}`;
  }
}

