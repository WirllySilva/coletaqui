import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

export type TreePlantingStatus = 'REGISTERED' | 'VALIDATED' | 'REJECTED';

export interface TreePlanting {
  id: string;
  userId: string;
  userName?: string | null;
  treeName?: string | null;
  species: string;
  plantedDate: string;
  locationType: string;
  neighborhood: string;
  locationDescription?: string | null;
  notes?: string | null;
  rejectionReason?: string | null;
  photoUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: TreePlantingStatus;
  createdAt: string;
  validatedAt?: string | null;
}

export interface CreateTreePlantingPayload {
  treeName?: string | null;
  species: string;
  plantedDate: string;
  locationType: string;
  neighborhood: string;
  locationDescription?: string | null;
  notes?: string | null;
  photo?: File | null;
  latitude?: number | null;
  longitude?: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class TreePlantingService {
  private readonly apiUrl = '/api/tree-plantings';
  private readonly adminUrl = '/api/admin/tree-plantings';

  constructor(private readonly http: HttpClient) {}

  create(payload: CreateTreePlantingPayload): Observable<TreePlanting> {
    const formData = new FormData();
    this.append(formData, 'treeName', payload.treeName);
    this.append(formData, 'species', payload.species);
    this.append(formData, 'plantedDate', payload.plantedDate);
    this.append(formData, 'locationType', payload.locationType);
    this.append(formData, 'neighborhood', payload.neighborhood);
    this.append(formData, 'locationDescription', payload.locationDescription);
    this.append(formData, 'notes', payload.notes);
    this.append(formData, 'latitude', payload.latitude);
    this.append(formData, 'longitude', payload.longitude);
    if (payload.photo) {
      formData.append('photo', payload.photo);
    }
    return this.http.post<TreePlanting>(this.apiUrl, formData, { headers: this.authHeaders() }).pipe(timeout(30000));
  }

  mine(): Observable<TreePlanting[]> {
    return this.http.get<TreePlanting[]>(`${this.apiUrl}/me`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  community(): Observable<TreePlanting[]> {
    return this.http.get<TreePlanting[]>(`${this.apiUrl}/community`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  adminList(): Observable<TreePlanting[]> {
    return this.http.get<TreePlanting[]>(this.adminUrl, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  validate(plantingId: string): Observable<TreePlanting> {
    return this.http.post<TreePlanting>(`${this.adminUrl}/${plantingId}/validate`, {}, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  reject(plantingId: string, reason: string): Observable<TreePlanting> {
    return this.http.post<TreePlanting>(`${this.adminUrl}/${plantingId}/reject`, { reason }, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('coletaqui_token') ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private append(formData: FormData, key: string, value: unknown): void {
    if (value === null || value === undefined || value === '') {
      return;
    }
    formData.append(key, String(value));
  }
}
