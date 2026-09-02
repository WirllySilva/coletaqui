import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { from, Observable, of, switchMap, take, timeout } from 'rxjs';

interface PushPublicKeyResponse {
  publicKey: string;
  configured: boolean;
}

interface PushSubscriptionPayload {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  private readonly apiUrl = '/api/push';

  constructor(
    private readonly http: HttpClient,
    private readonly swPush: SwPush,
  ) {}

  isSupported(): boolean {
    return this.swPush.isEnabled && 'Notification' in window;
  }

  subscribe(): Observable<void> {
    return this.publicKey().pipe(
      switchMap(response => {
        if (!response.configured || !response.publicKey) {
          throw new Error('As chaves de notificação ainda não foram configuradas.');
        }
        return from(this.swPush.requestSubscription({ serverPublicKey: response.publicKey }));
      }),
      switchMap(subscription => this.saveSubscription(subscription)),
      switchMap(() => this.sendTestNotification()),
    );
  }

  unsubscribe(): Observable<void> {
    return this.swPush.subscription.pipe(
      take(1),
      switchMap(subscription => {
        if (!subscription) {
          return of(undefined);
        }
        const payload = this.toPayload(subscription);
        return this.removeSubscription(payload).pipe(
          switchMap(() => from(subscription.unsubscribe()).pipe(switchMap(() => of(undefined)))),
        );
      }),
    );
  }

  private publicKey(): Observable<PushPublicKeyResponse> {
    return this.http.get<PushPublicKeyResponse>(`${this.apiUrl}/public-key`, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  private saveSubscription(subscription: PushSubscription): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/subscriptions`, this.toPayload(subscription), { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  private removeSubscription(payload: PushSubscriptionPayload): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/subscriptions`, { body: payload, headers: this.authHeaders() }).pipe(timeout(15000));
  }

  private sendTestNotification(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/test`, {
      title: 'Coletaqui Araçoiaba',
      body: 'Notificações ativadas neste dispositivo.',
      url: '/home',
    }, { headers: this.authHeaders() }).pipe(timeout(15000));
  }

  private toPayload(subscription: PushSubscription): PushSubscriptionPayload {
    const json = subscription.toJSON();
    return {
      endpoint: json.endpoint ?? '',
      keys: {
        p256dh: json.keys?.['p256dh'] ?? '',
        auth: json.keys?.['auth'] ?? '',
      },
    };
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('coletaqui_token') ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
