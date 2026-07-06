import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

interface StoredUser {
  name?: string | null;
  status?: 'ACTIVE' | 'PENDING_APPROVAL' | 'INACTIVE' | 'BLOCKED';
}

@Component({
  selector: 'app-collector-pending',
  imports: [CommonModule, RouterModule],
  templateUrl: './collector-pending.component.html',
  styleUrl: './collector-pending.component.css',
})
export class CollectorPendingComponent {
  user = this.currentUser();

  constructor(private readonly router: Router) {}

  get title(): string {
    return this.user?.status === 'BLOCKED'
      ? 'Cadastro bloqueado'
      : 'Cadastro em análise';
  }

  get description(): string {
    if (this.user?.status === 'BLOCKED') {
      return 'Seu acesso como coletor foi bloqueado pela administração. Entre em contato para revisar a situação.';
    }

    return 'Recebemos seu cadastro de coletor. A equipe administrativa precisa aprovar seu perfil antes de liberar solicitações, agenda e indicadores.';
  }

  logout(): void {
    localStorage.removeItem('coletaqui_token');
    localStorage.removeItem('coletaqui_user');
    void this.router.navigateByUrl('/');
  }

  private currentUser(): StoredUser | null {
    const raw = localStorage.getItem('coletaqui_user');

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as StoredUser;
    } catch {
      return null;
    }
  }
}
