import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

interface StoredUser {
  name?: string | null;
  phone?: string | null;
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

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.userName = this.getStoredUserName();
  }

  logout(): void {
    localStorage.removeItem('coletaqui_token');
    localStorage.removeItem('coletaqui_user');
    void this.router.navigateByUrl('/');
  }

  private getStoredUserName(): string {
    const storedUser = localStorage.getItem('coletaqui_user');

    if (!storedUser) {
      return 'usuário';
    }

    try {
      const user = JSON.parse(storedUser) as StoredUser;
      return user.name?.trim() || user.phone?.trim() || 'usuário';
    } catch {
      return 'usuário';
    }
  }
}
