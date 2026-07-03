import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

export interface MaterialType {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  hazardous: boolean;
}

export interface Schedule {
  id: string;
  requesterName?: string | null;
  requesterPhone?: string | null;
  collectorName?: string | null;
  collectorPhone?: string | null;
  address: string;
  preferredPeriod: string;
  materials: string[];
  notes?: string | null;
  status: 'REQUESTED' | 'ACCEPTED' | 'COMPLETED' | 'CANCELED';
  createdAt: string;
  acceptedAt?: string | null;
  completedAt?: string | null;
}

export interface CreateSchedulePayload {
  addressId: string;
  materialTypeIds: string[];
  preferredPeriod: string;
  notes?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private readonly materialsUrl = '/api/materials';
  private readonly schedulesUrl = '/api/schedules';

  constructor(private readonly http: HttpClient) {}

  listMaterials(): Observable<MaterialType[]> {
    return this.http.get<MaterialType[]>(this.materialsUrl, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  createSchedule(payload: CreateSchedulePayload): Observable<Schedule> {
    return this.http.post<Schedule>(this.schedulesUrl, payload, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  listMySchedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.schedulesUrl}/me`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  listOpenSchedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.schedulesUrl}/open`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  listCollectorSchedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.schedulesUrl}/collector`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  acceptSchedule(scheduleId: string): Observable<Schedule> {
    return this.http.post<Schedule>(`${this.schedulesUrl}/${scheduleId}/accept`, {}, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  completeSchedule(scheduleId: string): Observable<Schedule> {
    return this.http.post<Schedule>(`${this.schedulesUrl}/${scheduleId}/complete`, {}, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('coletaqui_token') ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
