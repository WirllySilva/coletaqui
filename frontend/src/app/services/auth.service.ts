import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

export type AuthProfile = 'common' | 'collector';

export interface OtpRequestResponse {
  message: string;
  phone: string;
  channel: string;
  expiresAt: string;
  devOtp?: string | null;
}

export interface AuthResponse {
  token: string;
  userId: string;
  phone: string;
  role: 'COMMON_USER' | 'COLLECTOR' | 'ADMIN';
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'INACTIVE' | 'BLOCKED';
  profileComplete: boolean;
  name?: string | null;
}

export interface CompleteProfilePayload {
  name: string;
  region?: string;
  materials?: string;
  availability?: string;
  collectorServiceType?: string;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = '/api/auth';

  constructor(private readonly http: HttpClient) {}

  requestOtp(profile: AuthProfile, phone: string): Observable<OtpRequestResponse> {
    return this.http.post<OtpRequestResponse>(`${this.profileUrl(profile)}/request-otp`, { phone }).pipe(timeout(15000));
  }

  verifyOtp(profile: AuthProfile, phone: string, code: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.profileUrl(profile)}/verify-otp`, { phone, code }).pipe(timeout(15000));
  }

  completeProfile(token: string, payload: CompleteProfilePayload): Observable<AuthResponse> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.post<AuthResponse>(`${this.apiUrl}/complete-profile`, payload, { headers }).pipe(timeout(15000));
  }

  adminLogin(payload: AdminLoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/admin/login`, payload).pipe(timeout(15000));
  }

  private profileUrl(profile: AuthProfile): string {
    return `${this.apiUrl}/${profile}`;
  }
}
