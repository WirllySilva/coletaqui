import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Schedule } from '../../services/schedule.service';

@Component({
  selector: 'app-admin-schedules',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-schedules.component.html',
  styleUrl: './admin-pages.css',
})
export class AdminSchedulesComponent implements OnInit {
  schedules: Schedule[] = [];
  statusFilter = '';
  materialFilter = '';
  neighborhoodFilter = '';
  collectorFilter = '';
  error = '';

  constructor(
    private readonly adminService: AdminService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  get filteredSchedules(): Schedule[] {
    return this.schedules.filter(schedule => {
      const matchesStatus = this.statusFilter ? schedule.status === this.statusFilter : true;
      const matchesMaterial = this.materialFilter ? schedule.materials.includes(this.materialFilter) : true;
      const matchesNeighborhood = this.neighborhoodFilter ? this.neighborhood(schedule.address) === this.neighborhoodFilter : true;
      const matchesCollector = this.collectorFilter ? (schedule.collectorName || 'Sem coletor') === this.collectorFilter : true;
      return matchesStatus && matchesMaterial && matchesNeighborhood && matchesCollector;
    });
  }

  get materials(): string[] {
    return [...new Set(this.schedules.flatMap(schedule => schedule.materials))].sort();
  }

  get neighborhoods(): string[] {
    return [...new Set(this.schedules.map(schedule => this.neighborhood(schedule.address)).filter(Boolean))].sort();
  }

  get collectors(): string[] {
    return [...new Set(this.schedules.map(schedule => schedule.collectorName || 'Sem coletor'))].sort();
  }

  ngOnInit(): void {
    this.adminService.schedules().subscribe({
      next: schedules => {
        this.schedules = schedules;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Nao foi possivel carregar coletas.';
        this.changeDetector.detectChanges();
      },
    });
  }

  exportCsv(): void {
    const headers = ['Status', 'Solicitante', 'Telefone', 'Coletor', 'Materiais', 'Periodo', 'Endereco', 'Criada em'];
    const rows = this.filteredSchedules.map(schedule => [
      schedule.status,
      schedule.requesterName || '',
      schedule.requesterPhone || '',
      schedule.collectorName || '',
      schedule.materials.join(', '),
      schedule.preferredPeriod,
      schedule.address,
      schedule.createdAt,
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(';'))
      .join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'coletas-coletaqui.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  private neighborhood(address: string): string {
    const parts = address.split(',');
    return parts.length >= 2 ? parts[parts.length - 2].trim() : '';
  }
}
