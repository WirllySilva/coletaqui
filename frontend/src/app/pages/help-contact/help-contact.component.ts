import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';

interface StoredUser {
  role?: 'COMMON_USER' | 'COLLECTOR' | 'ADMIN';
}

@Component({
  selector: 'app-help-contact-page',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './help-contact.component.html',
  styleUrl: './help-contact.component.css',
})
export class HelpContactPageComponent implements OnInit {
  isCollector = false;

  topics = [
    'Tire dúvidas sobre separação de materiais.',
    'Informe problemas em pontos de coleta.',
    'Peça orientação sobre agendamento de coleta.',
  ];

  collectorTopics = [
    'Tire dúvidas sobre recebimento de solicitações.',
    'Informe problemas em rotas ou atendimentos.',
    'Peça orientação sobre agenda e registro de coletas.',
  ];

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
