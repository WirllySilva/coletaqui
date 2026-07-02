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
      { label: 'Pontos', route: '/collectors', icon: 'bi-geo-alt-fill' },
      { label: 'Agendar', route: '/my-appointments', icon: 'bi-calendar-check-fill' },
    ];
  }

  private collectorItems(): FooterItem[] {
    return [
      { label: 'Início', route: '/collectors', icon: 'bi-house-fill' },
      { label: 'Solicitações', route: '/collectors', icon: 'bi-clipboard-check-fill' },
      { label: 'Agenda', route: '/collectors', icon: 'bi-calendar-week-fill' },
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
