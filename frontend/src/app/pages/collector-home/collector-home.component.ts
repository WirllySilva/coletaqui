import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Schedule, ScheduleService } from '../../services/schedule.service';

interface CollectorMetric {
  label: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-collector-home',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './collector-home.component.html',
  styleUrl: './collector-home.component.css',
})
export class CollectorHomeComponent implements OnInit {
  openRequests: Schedule[] = [];
  agenda: Schedule[] = [];
  isLoading = true;

  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  get metrics(): CollectorMetric[] {
    return [
      { label: 'Solicitações novas', value: String(this.openRequests.length), icon: 'bi-inbox-fill' },
      { label: 'Na agenda', value: String(this.agenda.filter(item => item.status === 'ACCEPTED').length), icon: 'bi-calendar-check-fill' },
      { label: 'Concluídas', value: String(this.agenda.filter(item => item.status === 'COMPLETED').length), icon: 'bi-check-circle-fill' },
    ];
  }

  get nextCollection(): Schedule | null {
    return this.agenda.find(item => item.status === 'ACCEPTED') ?? null;
  }

  ngOnInit(): void {
    this.scheduleService.listOpenSchedules().subscribe({
      next: requests => {
        this.openRequests = requests;
        this.changeDetector.detectChanges();
      },
    });

    this.scheduleService.listCollectorSchedules().subscribe({
      next: agenda => {
        this.agenda = agenda;
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
    });
  }
}
