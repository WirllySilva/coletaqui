import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { SupportContact, SupportContactService } from '../../services/support-contact.service';

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
  contact: SupportContact | null = null;
  error = '';

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

  constructor(
    private readonly router: Router,
    private readonly supportContactService: SupportContactService,
  ) {}

  ngOnInit(): void {
    this.isCollector = this.currentRole() === 'COLLECTOR';
    this.supportContactService.contact().subscribe({
      next: contact => {
        this.contact = contact;
      },
      error: () => {
        this.error = 'Não foi possível carregar o contato de atendimento.';
      },
    });
  }

  goBack(): void {
    void this.router.navigateByUrl(this.isCollector ? '/collector-home' : '/home');
  }

  openWhatsApp(): void {
    if (!this.contact?.whatsappUrl) {
      this.error = 'WhatsApp de atendimento ainda não foi configurado.';
      return;
    }

    window.open(this.contact.whatsappUrl, '_blank', 'noopener');
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
