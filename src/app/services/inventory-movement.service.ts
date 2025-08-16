import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { InventoryMovement, InventoryMovementRequest, WalletRequest } from '../interfaces/interfaces';
import { Storage } from '@ionic/storage';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class InventoryMovementService {

  constructor(private http: HttpClient, private storage: Storage) { }

  async registerMovement(request: InventoryMovementRequest): Promise<InventoryMovement> {
    try {
      const token = await this.storage.get('token');
      const username = await this.storage.get('username');

      if (!token || !username) {
        throw new Error('Token o username no disponible');
      }

      console.log('Datos del usuario:', { username }); // Debug

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token,
          'username': username
        })
      };

      console.log('Headers enviados:', httpOptions.headers); // Debug

      return this.http.post<InventoryMovement>(`${URL}/api/portfolio/inventory/movement`, request, httpOptions).toPromise();
    } catch (error) {
      console.error('Error en registerMovement service:', error);
      throw error;
    }
  }

  getMovements(walletIds: number[] = []): Promise<InventoryMovement[]> {
    const request: WalletRequest = {
      wallet_ids: walletIds
    };

    return this.http.post<InventoryMovement[]>(`${URL}/api/portfolio/inventory/movements`, request).toPromise();
  }

  getMovementsByProduct(productId: number): Promise<InventoryMovement[]> {
    return this.http.get<InventoryMovement[]>(`${URL}/api/portfolio/inventory/movements/product/${productId}`).toPromise();
  }

  getMovementsByDateRange(walletIds: number[], startDate: string, endDate: string): Promise<InventoryMovement[]> {
    const request: WalletRequest = {
      wallet_ids: walletIds
    };

    return this.http.post<InventoryMovement[]>(`${URL}/api/portfolio/inventory/movements/date-range?startDate=${startDate}&endDate=${endDate}`, request).toPromise();
  }
} 