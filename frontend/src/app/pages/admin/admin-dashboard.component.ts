import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminService, AdminSummary } from '../../services/admin.service';
import { ImpactDashboard, ImpactMetric } from '../../services/schedule.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-pages.css',
})
export class AdminDashboardComponent implements OnInit {
  summary: AdminSummary | null = null;
  impact: ImpactDashboard | null = null;
  error = '';
  statusColors: Record<string, string> = {
    requested: '#f4c430',
    accepted: '#74c6d8',
    completed: '#198754',
    canceled: '#d9534f',
  };

  constructor(
    private readonly adminService: AdminService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.adminService.summary().subscribe({
      next: summary => {
        this.summary = summary;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Nao foi possivel carregar o resumo administrativo.';
        this.changeDetector.detectChanges();
      },
    });

    this.adminService.impact().subscribe({
      next: impact => {
        this.impact = impact;
        this.changeDetector.detectChanges();
      },
    });
  }

  max(metrics: ImpactMetric[]): number {
    return Math.max(...metrics.map(metric => metric.total), 1);
  }

  get statusSegments(): Array<{ label: string; value: number; color: string }> {
    if (!this.impact) {
      return [];
    }

    return [
      { label: 'Solicitadas', value: this.impact.requested, color: this.statusColors['requested'] },
      { label: 'Aceitas', value: this.impact.accepted, color: this.statusColors['accepted'] },
      { label: 'Concluidas', value: this.impact.completed, color: this.statusColors['completed'] },
      { label: 'Canceladas', value: this.impact.canceled, color: this.statusColors['canceled'] },
    ];
  }

  get statusChartBackground(): string {
    const total = this.impact?.total ?? 0;

    if (!total) {
      return 'conic-gradient(#edf3ef 0deg 360deg)';
    }

    let cursor = 0;
    const parts = this.statusSegments.map(segment => {
      const start = cursor;
      cursor += (segment.value / total) * 360;
      return `${segment.color} ${start}deg ${cursor}deg`;
    });

    return `conic-gradient(${parts.join(', ')})`;
  }

  get pointDeliveryTotal(): number {
    if (!this.summary) {
      return 0;
    }
    return this.summary.pointDeliveries + this.summary.directDropOffDeliveries;
  }

  get confirmedPointDeliveryTotal(): number {
    if (!this.summary) {
      return 0;
    }
    return this.summary.confirmedPointDeliveries + this.summary.directDropOffDeliveries;
  }

  get confirmedPointDeliveryPercent(): number {
    return this.pointDeliveryTotal ? Math.round((this.confirmedPointDeliveryTotal / this.pointDeliveryTotal) * 100) : 0;
  }

  percent(value: number): number {
    const total = this.impact?.total ?? 0;
    return total ? Math.round((value / total) * 100) : 0;
  }
}
