import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

export interface UserImpactItem {
  id: string;
  type: string;
  title: string;
  location?: string | null;
  materials: string[];
  status: string;
  date: string;
  notes?: string | null;
}

export interface UserImpactSummary {
  totalActions: number;
  completedActions: number;
  plannedActions: number;
  points: number;
  items: UserImpactItem[];
}

@Injectable({
  providedIn: 'root',
})
export class UserImpactService {
  private readonly apiUrl = '/api/user-impact';

  constructor(private readonly http: HttpClient) {}

  mine(): Observable<UserImpactSummary> {
    return this.http.get<UserImpactSummary>(`${this.apiUrl}/me`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('coletaqui_token') ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
