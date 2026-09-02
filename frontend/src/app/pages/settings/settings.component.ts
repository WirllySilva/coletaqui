import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { PushNotificationService } from '../../services/push-notification.service';

interface StoredUser {
  role?: 'COMMON_USER' | 'COLLECTOR' | 'ADMIN';
}

@Component({
  selector: 'app-settings-page',
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsPageComponent implements OnInit {
  notifications = false;
  location = false;
  isCollector = false;
  message = '';
  error = '';

  constructor(
    private readonly router: Router,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  ngOnInit(): void {
    this.isCollector = this.currentRole() === 'COLLECTOR';
    this.notifications = localStorage.getItem(this.settingKey('notifications')) === 'true' && this.notificationPermission() === 'granted';
    this.location = localStorage.getItem(this.settingKey('location')) === 'true';
  }

  goBack(): void {
    void this.router.navigateByUrl(this.isCollector ? '/collector-home' : '/home');
  }

  onNotificationChange(enabled: boolean): void {
    this.message = '';
    this.error = '';

    if (!enabled) {
      this.pushNotificationService.unsubscribe().subscribe({
        next: () => {
          this.notifications = false;
          localStorage.setItem(this.settingKey('notifications'), 'false');
          this.message = 'Notificações desativadas neste dispositivo.';
        },
        error: () => {
          this.notifications = false;
          localStorage.setItem(this.settingKey('notifications'), 'false');
          this.message = 'Notificações desativadas neste dispositivo.';
        },
      });
      return;
    }

    if (!this.canUseSensitiveBrowserApis()) {
      this.notifications = false;
      localStorage.setItem(this.settingKey('notifications'), 'false');
      this.error = 'Notificações precisam de HTTPS ou localhost. No celular, elas funcionam quando o app estiver publicado com HTTPS.';
      return;
    }

    if (!this.pushNotificationService.isSupported()) {
      this.notifications = false;
      localStorage.setItem(this.settingKey('notifications'), 'false');
      this.error = 'Notificações push precisam do PWA em build de produção. Use Docker ou a versão publicada em HTTPS.';
      return;
    }

    this.pushNotificationService.subscribe().subscribe({
      next: () => {
        this.notifications = true;
        localStorage.setItem(this.settingKey('notifications'), 'true');
        this.message = 'Notificações ativadas neste dispositivo. Uma notificação de teste foi enviada.';
      },
      error: error => {
        this.notifications = false;
        localStorage.setItem(this.settingKey('notifications'), 'false');
        this.error = error?.message ?? 'Não foi possível ativar notificações neste dispositivo.';
      },
    });
  }

  onLocationChange(enabled: boolean): void {
    this.message = '';
    this.error = '';

    if (!enabled) {
      this.location = false;
      localStorage.setItem(this.settingKey('location'), 'false');
      localStorage.removeItem(this.settingKey('last-location'));
      this.message = 'Localização desativada neste dispositivo.';
      return;
    }

    if (!this.canUseSensitiveBrowserApis()) {
      this.location = false;
      localStorage.setItem(this.settingKey('location'), 'false');
      this.error = 'Localização precisa de HTTPS ou localhost. No celular, use a versão publicada com HTTPS.';
      return;
    }

    if (!navigator.geolocation) {
      this.location = false;
      localStorage.setItem(this.settingKey('location'), 'false');
      this.error = 'Este navegador não permite usar localização.';
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        this.location = true;
        localStorage.setItem(this.settingKey('location'), 'true');
        localStorage.setItem(this.settingKey('last-location'), JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          savedAt: new Date().toISOString(),
        }));
        this.message = 'Localização ativada neste dispositivo.';
      },
      () => {
        this.location = false;
        localStorage.setItem(this.settingKey('location'), 'false');
        this.error = 'Não foi possível ativar a localização. Confira a permissão do navegador.';
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }

  private currentRole(): StoredUser['role'] | null {
    const storedUser = localStorage.getItem('coletaqui_user');

    if (!storedUser) {
      return null;
    }

    try {
      return (JSON.parse(storedUser) as StoredUser).role ?? null;
    } catch {
      return null;
    }
  }

  private settingKey(name: string): string {
    return `coletaqui_${this.isCollector ? 'collector' : 'common'}_${name}`;
  }

  private notificationPermission(): NotificationPermission | 'unsupported' {
    return 'Notification' in window ? Notification.permission : 'unsupported';
  }

  private canUseSensitiveBrowserApis(): boolean {
    return window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  }
}
