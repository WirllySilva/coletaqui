import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-shell',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-shell.component.html',
  styleUrl: './admin-shell.component.css',
})
export class AdminShellComponent {
  navItems = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'bi-speedometer2' },
    { label: 'Coletores', route: '/admin/collectors', icon: 'bi-person-check-fill' },
    { label: 'Usuarios', route: '/admin/users', icon: 'bi-people-fill' },
    { label: 'Coletas', route: '/admin/schedules', icon: 'bi-clipboard-data-fill' },
    { label: 'Ranking', route: '/admin/ranking', icon: 'bi-trophy-fill' },
    { label: 'Materiais', route: '/admin/materials', icon: 'bi-recycle' },
    { label: 'Pontos', route: '/admin/collection-points', icon: 'bi-geo-alt-fill' },
    { label: 'Árvores', route: '/admin/tree-plantings', icon: 'bi-tree-fill' },
    { label: 'Minha conta', route: '/admin/account', icon: 'bi-person-circle' },
  ];

  constructor(private readonly router: Router) {}

  logout(): void {
    localStorage.removeItem('coletaqui_token');
    localStorage.removeItem('coletaqui_user');
    void this.router.navigateByUrl('/admin/login');
  }
}
