import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Schedule, ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-collector-requests',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './collector-requests.component.html',
  styleUrl: './collector-requests.component.css',
})
export class CollectorRequestsComponent implements OnInit {
  requests: Schedule[] = [];
  isLoading = true;
  message = '';
  error = '';

  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly router: Router,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  accept(schedule: Schedule): void {
    this.message = '';
    this.error = '';

    this.scheduleService.acceptSchedule(schedule.id).subscribe({
      next: accepted => {
        this.requests = this.requests.filter(item => item.id !== accepted.id);
        this.message = 'Solicitação aceita e enviada para sua agenda.';
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível aceitar a solicitação.';
        this.changeDetector.detectChanges();
      },
    });
  }

  goHome(): void {
    void this.router.navigateByUrl('/collector-home');
  }

  private loadRequests(): void {
    this.scheduleService.listOpenSchedules().subscribe({
      next: requests => {
        this.requests = requests;
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível carregar solicitações.';
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
    });
  }
}
