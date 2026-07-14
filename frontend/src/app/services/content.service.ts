import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { Tip } from '../models/tip.model';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private readonly apiUrl = '/api/contents';

  constructor(private readonly http: HttpClient) {}

  active(): Observable<Tip[]> {
    return this.http.get<Tip[]>(this.apiUrl).pipe(timeout(15000));
  }

  show(contentId: string): Observable<Tip> {
    return this.http.get<Tip>(`${this.apiUrl}/${contentId}`).pipe(timeout(15000));
  }
}
