import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

export interface UserProfile {
  id: string;
  phone: string;
  name: string | null;
  role: 'COMMON_USER' | 'COLLECTOR' | 'ADMIN';
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'INACTIVE' | 'BLOCKED';
  profileComplete: boolean;
  region?: string | null;
  materials?: string | null;
  availability?: string | null;
  collectorServiceType?: CollectorServiceType | null;
  createdAt: string;
  updatedAt: string;
}

export type CollectorServiceType = 'HOME_COLLECTION' | 'DROP_OFF_POINT' | 'HOME_COLLECTION_AND_DROP_OFF';

export interface Collector {
  id: string;
  name: string | null;
  phone: string;
  region?: string | null;
  materials?: string | null;
  availability?: string | null;
  collectorServiceType: CollectorServiceType;
  address?: string | null;
}

export interface UserAddress {
  id: string;
  label: string;
  street: string;
  number?: string | null;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  defaultAddress: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfilePayload {
  name: string;
  region?: string | null;
  materials?: string | null;
  availability?: string | null;
  collectorServiceType?: CollectorServiceType | null;
}

export interface UpsertUserAddressPayload {
  label: string;
  street: string;
  number?: string | null;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  defaultAddress: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = '/api/users';

  constructor(private readonly http: HttpClient) {}

  getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  updateMyProfile(payload: UpdateUserProfilePayload): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/me`, payload, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  listCollectors(): Observable<Collector[]> {
    return this.http.get<Collector[]>(`${this.apiUrl}/collectors`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  getMyAddresses(): Observable<UserAddress[]> {
    return this.http.get<UserAddress[]>(`${this.apiUrl}/me/addresses`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  createMyAddress(payload: UpsertUserAddressPayload): Observable<UserAddress> {
    return this.http.post<UserAddress>(`${this.apiUrl}/me/addresses`, payload, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  updateMyAddress(addressId: string, payload: UpsertUserAddressPayload): Observable<UserAddress> {
    return this.http.put<UserAddress>(`${this.apiUrl}/me/addresses/${addressId}`, payload, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  deleteMyAddress(addressId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/me/addresses/${addressId}`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('coletaqui_token') ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
