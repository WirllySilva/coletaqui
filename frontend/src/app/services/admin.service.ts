import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { ImpactDashboard, RankingEntry, Schedule } from './schedule.service';
import { UserProfile } from './user.service';

export interface AdminSummary {
  users: number;
  commonUsers: number;
  collectors: number;
  pendingCollectors: number;
  collectionPoints: number;
  activeCollectionPoints: number;
  schedules: number;
  openSchedules: number;
  completedSchedules: number;
  canceledSchedules: number;
  pointDeliveries: number;
  confirmedPointDeliveries: number;
  directDropOffDeliveries: number;
  treePlantings: number;
  validatedTreePlantings: number;
  pendingTreePlantings: number;
}

export interface AdminMaterial {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  hazardous: boolean;
  active: boolean;
}

export interface UpsertAdminMaterialPayload {
  name: string;
  description?: string | null;
  hazardous: boolean;
  active: boolean;
}

export interface CollectionPoint {
  id: string;
  name: string;
  description?: string | null;
  address: string;
  city: string;
  state: string;
  materials?: string | null;
  openingHours?: string | null;
  responsibleCollectorId?: string | null;
  responsibleName?: string | null;
  responsiblePhone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertCollectionPointPayload {
  name: string;
  description?: string | null;
  address: string;
  city?: string | null;
  state?: string | null;
  materials?: string | null;
  openingHours?: string | null;
  responsiblePhone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  active: boolean;
}

export interface ChangeAdminPasswordPayload {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly apiUrl = '/api/admin';

  constructor(private readonly http: HttpClient) {}

  summary(): Observable<AdminSummary> {
    return this.http.get<AdminSummary>(`${this.apiUrl}/summary`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  me(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  changePassword(payload: ChangeAdminPasswordPayload): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/me/change-password`, payload, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  impact(): Observable<ImpactDashboard> {
    return this.http.get<ImpactDashboard>(`${this.apiUrl}/impact`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  ranking(): Observable<RankingEntry[]> {
    return this.http.get<RankingEntry[]>(`${this.apiUrl}/ranking`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  users(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.apiUrl}/users`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  pendingCollectors(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.apiUrl}/collectors/pending`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  collectors(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.apiUrl}/collectors`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  approveCollector(collectorId: string): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.apiUrl}/collectors/${collectorId}/approve`, {}, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  blockCollector(collectorId: string): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.apiUrl}/collectors/${collectorId}/block`, {}, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  reactivateCollector(collectorId: string): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.apiUrl}/collectors/${collectorId}/reactivate`, {}, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  blockUser(userId: string): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.apiUrl}/users/${userId}/block`, {}, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  schedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.apiUrl}/schedules`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  materials(): Observable<AdminMaterial[]> {
    return this.http.get<AdminMaterial[]>(`${this.apiUrl}/materials`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  createMaterial(payload: UpsertAdminMaterialPayload): Observable<AdminMaterial> {
    return this.http.post<AdminMaterial>(`${this.apiUrl}/materials`, payload, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  updateMaterial(materialId: string, payload: UpsertAdminMaterialPayload): Observable<AdminMaterial> {
    return this.http.put<AdminMaterial>(`${this.apiUrl}/materials/${materialId}`, payload, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  toggleMaterial(materialId: string): Observable<AdminMaterial> {
    return this.http.post<AdminMaterial>(`${this.apiUrl}/materials/${materialId}/toggle`, {}, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  collectionPoints(): Observable<CollectionPoint[]> {
    return this.http.get<CollectionPoint[]>(`${this.apiUrl}/collection-points`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  createCollectionPoint(payload: UpsertCollectionPointPayload): Observable<CollectionPoint> {
    return this.http.post<CollectionPoint>(`${this.apiUrl}/collection-points`, payload, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  updateCollectionPoint(pointId: string, payload: UpsertCollectionPointPayload): Observable<CollectionPoint> {
    return this.http.put<CollectionPoint>(`${this.apiUrl}/collection-points/${pointId}`, payload, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  toggleCollectionPoint(pointId: string): Observable<CollectionPoint> {
    return this.http.post<CollectionPoint>(`${this.apiUrl}/collection-points/${pointId}/toggle`, {}, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('coletaqui_token') ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
