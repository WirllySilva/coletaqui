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

  get primaryMetrics(): Array<{ label: string; value: number; icon: string; hint: string }> {
    if (!this.summary) {
      return [];
    }

    return [
      { label: 'Usuários', value: this.summary.users, icon: 'bi-people-fill', hint: `${this.summary.commonUsers} moradores cadastrados` },
      { label: 'Coletores', value: this.summary.collectors, icon: 'bi-truck', hint: `${this.summary.pendingCollectors} aguardando aprovação` },
      { label: 'Coletas', value: this.summary.schedules, icon: 'bi-calendar-check', hint: `${this.summary.completedSchedules} concluídas` },
      { label: 'Entregas', value: this.confirmedPointDeliveryTotal, icon: 'bi-geo-alt-fill', hint: 'Confirmadas em pontos de coleta' },
      { label: 'Árvores', value: this.summary.validatedTreePlantings, icon: 'bi-tree-fill', hint: `${this.summary.pendingTreePlantings} aguardando validação` },
    ];
  }

  get pendingItems(): Array<{ label: string; value: number; icon: string; tone: 'warning' | 'success'; description: string }> {
    if (!this.summary) {
      return [];
    }

    return [
      {
        label: 'Coletores pendentes',
        value: this.summary.pendingCollectors,
        icon: 'bi-person-check-fill',
        tone: this.summary.pendingCollectors ? 'warning' : 'success',
        description: this.summary.pendingCollectors ? 'Revisar cadastros de coletores.' : 'Nenhum coletor aguardando.',
      },
      {
        label: 'Árvores pendentes',
        value: this.summary.pendingTreePlantings,
        icon: 'bi-tree-fill',
        tone: this.summary.pendingTreePlantings ? 'warning' : 'success',
        description: this.summary.pendingTreePlantings ? 'Validar ou rejeitar plantios.' : 'Nenhuma árvore aguardando.',
      },
      {
        label: 'Coletas abertas',
        value: this.summary.openSchedules,
        icon: 'bi-inbox-fill',
        tone: this.summary.openSchedules ? 'warning' : 'success',
        description: this.summary.openSchedules ? 'Há solicitações sem aceite.' : 'Nenhuma coleta aberta.',
      },
    ];
  }

  get operationStats(): Array<{ label: string; value: number; meta: string }> {
    if (!this.summary) {
      return [];
    }

    return [
      { label: 'Pontos ativos', value: this.summary.activeCollectionPoints, meta: `${this.summary.collectionPoints} pontos cadastrados` },
      { label: 'Coletas abertas', value: this.summary.openSchedules, meta: 'Aguardando coletor' },
      { label: 'Coletas concluídas', value: this.summary.completedSchedules, meta: `${this.summary.canceledSchedules} canceladas` },
      { label: 'Entregas em pontos', value: this.confirmedPointDeliveryTotal, meta: `${this.summary.pointDeliveries} avisadas no app` },
    ];
  }

  get environmentalStats(): Array<{ label: string; value: number; meta: string }> {
    if (!this.summary) {
      return [];
    }

    return [
      { label: 'Árvores registradas', value: this.summary.treePlantings, meta: 'Total enviado por moradores' },
      { label: 'Árvores validadas', value: this.summary.validatedTreePlantings, meta: 'Entram no mapa público' },
      { label: 'Árvores pendentes', value: this.summary.pendingTreePlantings, meta: 'Aguardam análise do admin' },
    ];
  }

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
        this.error = 'Não foi possível carregar o resumo administrativo.';
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
