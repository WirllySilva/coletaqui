import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ImpactDashboard, ImpactMetric, ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-impact-dashboard',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './impact-dashboard.component.html',
  styleUrl: './impact-dashboard.component.css',
})
export class ImpactDashboardComponent implements OnInit {
  dashboard: ImpactDashboard | null = null;
  isLoading = true;
  error = '';

  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly router: Router,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.scheduleService.getImpactDashboard().subscribe({
      next: dashboard => {
        this.dashboard = dashboard;
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Nao foi possivel carregar os indicadores.';
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
    });
  }

  goHome(): void {
    void this.router.navigateByUrl('/collector-home');
  }

  percentage(value: number): number {
    if (!this.dashboard?.total) {
      return 0;
    }
    return Math.round((value / this.dashboard.total) * 100);
  }

  max(metrics: ImpactMetric[]): number {
    return Math.max(...metrics.map(metric => metric.total), 1);
  }
}
