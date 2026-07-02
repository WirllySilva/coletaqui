import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-help-contact-page',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './help-contact.component.html',
  styleUrl: './help-contact.component.css',
})
export class HelpContactPageComponent {
  topics = [
    'Tire dúvidas sobre separação de materiais.',
    'Informe problemas em pontos de coleta.',
    'Peça orientação sobre agendamento de coleta.',
  ];
}
