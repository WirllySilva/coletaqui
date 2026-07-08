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
  desiredDate?: string | null;
  preferredPeriod: string;
  materials: string[];
  notes?: string | null;
  status: 'REQUESTED' | 'ACCEPTED' | 'COMPLETED' | 'CANCELED';
  createdAt: string;
  acceptedAt?: string | null;
  completedAt?: string | null;
  canceledAt?: string | null;
}

export interface ImpactMetric {
  label: string;
  total: number;
}

export interface ImpactDashboard {
  requested: number;
  accepted: number;
  completed: number;
  canceled: number;
  total: number;
  materials: ImpactMetric[];
  neighborhoods: ImpactMetric[];
  collectors: ImpactMetric[];
}

export interface RankingEntry {
  position: number;
  userId: string;
  name: string;
  points: number;
  completedCollections: number;
  currentUser: boolean;
}

export interface CreateSchedulePayload {
  addressId: string;
  materialTypeIds: string[];
  desiredDate: string;
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

  getSchedule(scheduleId: string): Observable<Schedule> {
    return this.http.get<Schedule>(`${this.schedulesUrl}/${scheduleId}`, { headers: this.authHeaders() }).pipe(timeout(15000));
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

  cancelSchedule(scheduleId: string): Observable<Schedule> {
    return this.http.post<Schedule>(`${this.schedulesUrl}/${scheduleId}/cancel`, {}, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  getImpactDashboard(): Observable<ImpactDashboard> {
    return this.http.get<ImpactDashboard>(`${this.schedulesUrl}/impact`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  getRanking(): Observable<RankingEntry[]> {
    return this.http.get<RankingEntry[]>(`${this.schedulesUrl}/ranking`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('coletaqui_token') ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
