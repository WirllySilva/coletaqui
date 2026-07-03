import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';

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
  notifications = true;
  location = true;
  isCollector = false;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.isCollector = this.currentRole() === 'COLLECTOR';
  }

  goBack(): void {
    void this.router.navigateByUrl(this.isCollector ? '/collector-home' : '/home');
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
}
