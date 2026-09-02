import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

export interface SupportContact {
  name?: string | null;
  phone?: string | null;
  whatsappUrl?: string | null;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupportContactService {
  constructor(private readonly http: HttpClient) {}

  contact(): Observable<SupportContact> {
    return this.http.get<SupportContact>('/api/support/contact').pipe(timeout(15000));
  }
}
