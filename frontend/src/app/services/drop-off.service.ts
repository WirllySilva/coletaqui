import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

export interface DropOffDelivery {
  id: string;
  userName?: string | null;
  userPhone: string;
  collectorName?: string | null;
  materials: string[];
  notes?: string | null;
  confirmedAt: string;
}

export interface CreateDropOffDeliveryPayload {
  userPhone: string;
  materialTypeIds: string[];
  notes?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class DropOffService {
  private readonly apiUrl = '/api/drop-offs';

  constructor(private readonly http: HttpClient) {}

  confirmDelivery(payload: CreateDropOffDeliveryPayload): Observable<DropOffDelivery> {
    return this.http.post<DropOffDelivery>(this.apiUrl, payload, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  listMine(): Observable<DropOffDelivery[]> {
    return this.http.get<DropOffDelivery[]>(`${this.apiUrl}/collector`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('coletaqui_token') ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
