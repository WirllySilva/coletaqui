import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Schedule, ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-collector-schedule',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './collector-schedule.component.html',
  styleUrl: './collector-schedule.component.css',
})
export class CollectorScheduleComponent implements OnInit {
  schedules: Schedule[] = [];
  isLoading = true;
  message = '';
  error = '';

  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly router: Router,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadSchedules();
  }

  complete(schedule: Schedule): void {
    this.message = '';
    this.error = '';

    this.scheduleService.completeSchedule(schedule.id).subscribe({
      next: updated => {
        this.schedules = this.schedules.map(item => item.id === updated.id ? updated : item);
        this.message = 'Coleta marcada como concluída.';
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível concluir a coleta.';
        this.changeDetector.detectChanges();
      },
    });
  }

  goHome(): void {
    void this.router.navigateByUrl('/collector-home');
  }

  openDetail(schedule: Schedule): void {
    void this.router.navigate(['/schedules', schedule.id]);
  }

  statusLabel(status: Schedule['status']): string {
    const labels: Record<Schedule['status'], string> = {
      REQUESTED: 'Solicitada',
      ACCEPTED: 'Aceita',
      COMPLETED: 'Concluída',
      CANCELED: 'Cancelada',
    };
    return labels[status];
  }

  private loadSchedules(): void {
    this.scheduleService.listCollectorSchedules().subscribe({
      next: schedules => {
        this.schedules = schedules;
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível carregar sua agenda.';
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
    });
  }
}
