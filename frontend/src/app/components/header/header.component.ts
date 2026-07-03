import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

interface StoredUser {
  name?: string | null;
  phone?: string | null;
  role?: 'COMMON_USER' | 'COLLECTOR' | 'ADMIN';
}

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  userName = 'usuário';
  isCollector = false;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    const storedUser = this.getStoredUser();
    this.userName = storedUser?.name?.trim() || storedUser?.phone?.trim() || 'usuário';
    this.isCollector = storedUser?.role === 'COLLECTOR';
  }

  logout(): void {
    localStorage.removeItem('coletaqui_token');
    localStorage.removeItem('coletaqui_user');
    void this.router.navigateByUrl('/');
  }

  shareApp(): void {
    this.menuOpen = false;
    const shareData = {
      title: 'Coletaqui',
      text: 'Conheça o Coletaqui para encontrar pontos de coleta e agendar coleta de recicláveis.',
      url: window.location.origin,
    };

    if (navigator.share) {
      void navigator.share(shareData);
      return;
    }

    void navigator.clipboard?.writeText(shareData.url);
  }

  private getStoredUser(): StoredUser | null {
    const storedUser = localStorage.getItem('coletaqui_user');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as StoredUser;
    } catch {
      return null;
    }
  }
}
