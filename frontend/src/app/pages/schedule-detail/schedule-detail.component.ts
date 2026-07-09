import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Schedule, ScheduleService } from '../../services/schedule.service';
import { friendlyErrorMessage } from '../../utils/error-message';

@Component({
  selector: 'app-schedule-detail',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './schedule-detail.component.html',
  styleUrl: './schedule-detail.component.css',
})
export class ScheduleDetailComponent implements OnInit {
  schedule: Schedule | null = null;
  isLoading = true;
  isSaving = false;
  message = '';
  error = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly scheduleService: ScheduleService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  get isCollector(): boolean {
    return this.currentRole() === 'COLLECTOR';
  }

  ngOnInit(): void {
    const scheduleId = this.route.snapshot.paramMap.get('scheduleId');
    if (!scheduleId) {
      void this.router.navigateByUrl(this.isCollector ? '/collector-home' : '/my-requests');
      return;
    }

    this.scheduleService.getSchedule(scheduleId).pipe(
      finalize(() => {
        this.isLoading = false;
        this.changeDetector.detectChanges();
      }),
    ).subscribe({
      next: schedule => {
        this.schedule = schedule;
        this.changeDetector.detectChanges();
      },
      error: error => {
        this.error = friendlyErrorMessage(error, 'Não foi possível carregar os detalhes da coleta.');
        this.changeDetector.detectChanges();
      },
    });
  }

  goBack(): void {
    void this.router.navigateByUrl(this.isCollector ? '/collector-schedule' : '/my-requests');
  }

  accept(): void {
    if (!this.schedule) {
      return;
    }
    this.runAction(this.scheduleService.acceptSchedule(this.schedule.id), 'Coleta aceita e enviada para sua agenda.');
  }

  complete(): void {
    if (!this.schedule) {
      return;
    }
    this.runAction(this.scheduleService.completeSchedule(this.schedule.id), 'Coleta marcada como concluída.');
  }

  cancel(): void {
    if (!this.schedule) {
      return;
    }
    this.runAction(this.scheduleService.cancelSchedule(this.schedule.id), 'Solicitação cancelada.');
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

  statusText(schedule: Schedule): string {
    if (schedule.status === 'REQUESTED') {
      return 'Aguardando aceite de um coletor.';
    }
    if (schedule.status === 'ACCEPTED') {
      return 'Coleta aceita e em andamento.';
    }
    if (schedule.status === 'COMPLETED') {
      return 'Coleta concluída.';
    }
    return 'Solicitação cancelada.';
  }

  whatsappLink(phone?: string | null): string {
    return `https://wa.me/55${phone ?? ''}`;
  }

  private runAction(request: ReturnType<ScheduleService['acceptSchedule']>, successMessage: string): void {
    this.isSaving = true;
    this.message = '';
    this.error = '';

    request.pipe(
      finalize(() => {
        this.isSaving = false;
        this.changeDetector.detectChanges();
      }),
    ).subscribe({
      next: schedule => {
        this.schedule = schedule;
        this.message = successMessage;
        this.changeDetector.detectChanges();
      },
      error: error => {
        this.error = friendlyErrorMessage(error, 'Não foi possível executar esta ação. Verifique o status da coleta.');
        this.changeDetector.detectChanges();
      },
    });
  }

  private currentRole(): string | null {
    const raw = localStorage.getItem('coletaqui_user');
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw).role ?? null;
    } catch {
      return null;
    }
  }
}
