import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Service, ServicesByCustomerResponse, WalletRequest, CustomerServiceSchedule, CancelServiceReq, WalletReport, ServicesReportResp, PaymentsReportResp, UpdateServiceReq, ExpiredServiceDetail, ExpiredServiceResp } from '../interfaces/interfaces';
import { Storage } from '@ionic/storage';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient,
              private storage: Storage) { }


  async updateService(quantityOfFees: number, feeValue: number, serviceId: number) {
    const token = await this.storage.get('token');

    const request: UpdateServiceReq = {
      service_id: serviceId,
      quantity_of_fees: quantityOfFees,
      fee_value: feeValue
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: token
      })
    };

    return new Promise( resolve => {
      this.http.put(`${ URL }/api/portfolio/service/update`, request, httpOptions )
      .subscribe( resp => {
        console.log(resp);

        if ( resp['code'] == 'ok' ) {
          resolve(true);
        } else {
          resolve(false);
        }

      });
    });
  }

  async cancelService(productIds: number[], serviceId: number, discount: number) {
    const token = await this.storage.get('token');

    const request: CancelServiceReq = {
      service_id: serviceId,
      product_ids: productIds,
      discount: discount
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: token
      })
    };

    return new Promise( resolve => {
      this.http.post(`${ URL }/api/portfolio/service/cancel_service`, request, httpOptions )
      .subscribe( resp => {
        console.log(resp);

        if ( resp['code'] == 'ok' ) {
          resolve(true);
        } else {
          resolve(false);
        }

      });
    });
  }

  async registerService(service: Service) {
    console.log( service );

    const token = await this.storage.get('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: token
      })
    };

    return new Promise( resolve => {
      this.http.post(`${ URL }/api/portfolio/service/create`, service, httpOptions )
      .subscribe( resp => {
        console.log(resp);

        if ( resp['service_id'] ) {
          resolve(true);
        } else {
          resolve(false);
        }

      });
    });
  }

  getServicesByCustomer(customerId: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        customerid: customerId
      })
    };

    return this.http.get<ServicesByCustomerResponse[]>(`${ URL }/api/portfolio/service/services_by_customer`, httpOptions);
  }

  getServicesByDate(date: string, walletIds: number[] = [], expiredServices: boolean = false) {

    const request: WalletRequest = {
      wallet_ids: walletIds,
      date: date,
      expired_services: expiredServices
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<CustomerServiceSchedule[]>(`${ URL }/api/portfolio/service/services_schedule`, request, httpOptions);
  }

  getExpiredServices(date: string, walletIds: number[] = []) {

    const request: WalletRequest = {
      wallet_ids: walletIds,
      date: date
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<CustomerServiceSchedule[]>(`${ URL }/api/portfolio/service/expired_services`, request, httpOptions);
  }


  getWalletReport(init_date: string, end_date: string, walletId: number) {

    const request = {
      "starts_at": init_date,
      "ends_at": end_date,
      "wallet_id": walletId
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<WalletReport>(`${ URL }/api/portfolio/cash_movement/wallet_resume`, request, httpOptions);
  }

  getReportPdf(init_date: string, end_date: string, walletId: number) {

    const request = {
      "starts_at": init_date,
      "ends_at": end_date,
      "wallet_id": walletId
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<ServicesReportResp>(`${ URL }/api/portfolio/service/report`, request, httpOptions);
  }

  getPaymentsReport(init_date: string, end_date: string, walletId: number) {

    const request = {
      "starts_at": init_date,
      "ends_at": end_date,
      "wallet_id": walletId
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<PaymentsReportResp>(`${ URL }/api/portfolio/payment/report`, request, httpOptions);
  }

  getExpiredServiceReport(init_date: string, end_date: string, walletId: number) {

    const request = {
      "starts_at": init_date,
      "ends_at": end_date,
      "wallet_id": walletId
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<ExpiredServiceResp>(`${ URL }/api/portfolio/expired/report`, request, httpOptions);
  }

  getWithdrawalServiceReport(init_date: string, end_date: string, walletId: number) {

    const request = {
      "starts_at": init_date,
      "ends_at": end_date,
      "wallet_id": walletId
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<ExpiredServiceResp>(`${ URL }/api/portfolio/withdrawal/report`, request, httpOptions);
  }

  getCanceledServiceReport(init_date: string, end_date: string, walletId: number) {

    const request = {
      "starts_at": init_date,
      "ends_at": end_date,
      "wallet_id": walletId
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<ExpiredServiceResp>(`${ URL }/api/portfolio/canceled/report`, request, httpOptions);
  }

  generateWalletResumeReport(payload: {
    wallet_id: number;
    starts_at: string;
    ends_at: string;
  }) {
    return this.http.post(`${URL}/api/portfolio/wallet-resume`, payload);
  }

  markAccountForWithdrawal(data: { serviceId: number; customerId: number }) {

    return this.http.post(`${ URL }/api/portfolio/mark-for-withdrawal`, data).pipe(
      catchError((error) => {
        console.error('Error al marcar para retiro:', error);
        return throwError(() => error);
      })
    );
  }

  markAsLost(data: { serviceId: number; customerId: number }) {

    return this.http.post(`${ URL }/api/portfolio/mark-as-lost`, data).pipe(
      catchError((error) => {
        console.error('Error al marcar como perdida:', error);
        return throwError(() => error);
      })
    );
  }
  
  
}
