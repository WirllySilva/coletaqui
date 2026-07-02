import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-my-appointments-page',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './my-appointments.component.html',
  styleUrl: './my-appointments.component.css',
})
export class MyAppointmentsPageComponent {
  statuses = [
    { label: 'Solicitadas', value: 0, icon: 'bi-send' },
    { label: 'Aceitas', value: 0, icon: 'bi-check-circle' },
    { label: 'Concluídas', value: 0, icon: 'bi-award' },
  ];
}
