import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

export interface CollectionPointDelivery {
  id: string;
  userName?: string | null;
  userPhone?: string | null;
  collectionPointId: string;
  collectionPointName: string;
  collectionPointAddress: string;
  materials: string[];
  plannedDate: string;
  preferredPeriod: string;
  notes?: string | null;
  status: 'PLANNED' | 'CONFIRMED' | 'CANCELED';
  createdAt: string;
  confirmedAt?: string | null;
  canceledAt?: string | null;
}

export interface CreateCollectionPointDeliveryPayload {
  collectionPointId: string;
  materialTypeIds: string[];
  plannedDate: string;
  preferredPeriod: string;
  notes?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class CollectionPointDeliveryService {
  private readonly apiUrl = '/api/collection-point-deliveries';

  constructor(private readonly http: HttpClient) {}

  create(payload: CreateCollectionPointDeliveryPayload): Observable<CollectionPointDelivery> {
    return this.http.post<CollectionPointDelivery>(this.apiUrl, payload, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  listMine(): Observable<CollectionPointDelivery[]> {
    return this.http.get<CollectionPointDelivery[]>(`${this.apiUrl}/me`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  listForCollector(): Observable<CollectionPointDelivery[]> {
    return this.http.get<CollectionPointDelivery[]>(`${this.apiUrl}/collector`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  confirm(deliveryId: string): Observable<CollectionPointDelivery> {
    return this.http.post<CollectionPointDelivery>(`${this.apiUrl}/${deliveryId}/confirm`, {}, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('coletaqui_token') ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
