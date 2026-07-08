import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

interface StoredUser {
  role?: 'COMMON_USER' | 'COLLECTOR' | 'ADMIN';
}

interface FooterItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  items: FooterItem[] = [];

  ngOnInit(): void {
    this.items = this.isCollector() ? this.collectorItems() : this.commonUserItems();
  }

  private commonUserItems(): FooterItem[] {
    return [
      { label: 'Início', route: '/home', icon: 'bi-house-fill' },
      { label: 'Pontos', route: '/collection-points', icon: 'bi-geo-alt-fill' },
      { label: 'Impacto', route: '/user-impact', icon: 'bi-stars' },
    ];
  }

  private collectorItems(): FooterItem[] {
    return [
      { label: 'Início', route: '/collector-home', icon: 'bi-house-fill' },
      { label: 'Solicitações', route: '/collector-requests', icon: 'bi-clipboard-check-fill' },
      { label: 'Agenda', route: '/collector-schedule', icon: 'bi-calendar-week-fill' },
      { label: 'Impacto', route: '/impact', icon: 'bi-bar-chart-fill' },
    ];
  }

  private isCollector(): boolean {
    const storedUser = localStorage.getItem('coletaqui_user');

    if (!storedUser) {
      return false;
    }

    try {
      const user = JSON.parse(storedUser) as StoredUser;
      return user.role === 'COLLECTOR';
    } catch {
      return false;
    }
  }
}
