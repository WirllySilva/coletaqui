import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Schedule, ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-my-requests',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.css',
})
export class MyRequestsComponent implements OnInit {
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

  goBack(): void {
    void this.router.navigateByUrl('/schedule-options');
  }

  openDetail(schedule: Schedule): void {
    void this.router.navigate(['/schedules', schedule.id]);
  }

  cancel(schedule: Schedule): void {
    this.message = '';
    this.error = '';

    this.scheduleService.cancelSchedule(schedule.id).subscribe({
      next: updated => {
        this.schedules = this.schedules.map(item => item.id === updated.id ? updated : item);
        this.message = 'Solicitação cancelada.';
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível cancelar a solicitação.';
        this.changeDetector.detectChanges();
      },
    });
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
    this.isLoading = true;

    this.scheduleService.listMySchedules().pipe(
      finalize(() => {
        this.isLoading = false;
        this.changeDetector.detectChanges();
      }),
    ).subscribe({
      next: schedules => {
        this.schedules = schedules;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível carregar suas solicitações.';
        this.changeDetector.detectChanges();
      },
    });
  }
}
