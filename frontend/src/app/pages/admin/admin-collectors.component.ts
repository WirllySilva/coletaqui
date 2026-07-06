import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { UserProfile } from '../../services/user.service';

@Component({
  selector: 'app-admin-collectors',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-collectors.component.html',
  styleUrl: './admin-pages.css',
})
export class AdminCollectorsComponent implements OnInit {
  collectors: UserProfile[] = [];
  selectedCollector: UserProfile | null = null;
  statusFilter: UserProfile['status'] | '' = '';
  message = '';
  error = '';

  constructor(
    private readonly adminService: AdminService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  get filteredCollectors(): UserProfile[] {
    return this.statusFilter
      ? this.collectors.filter(collector => collector.status === this.statusFilter)
      : this.collectors;
  }

  count(status: UserProfile['status']): number {
    return this.collectors.filter(collector => collector.status === status).length;
  }

  approve(collector: UserProfile): void {
    this.message = '';
    this.error = '';
    this.adminService.approveCollector(collector.id).subscribe({
      next: updated => {
        this.updateCollector(updated);
        this.message = 'Coletor aprovado.';
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Nao foi possivel aprovar o coletor.';
        this.changeDetector.detectChanges();
      },
    });
  }

  block(collector: UserProfile): void {
    this.message = '';
    this.error = '';
    this.adminService.blockCollector(collector.id).subscribe({
      next: updated => {
        this.updateCollector(updated);
        this.message = 'Coletor bloqueado.';
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Nao foi possivel bloquear o coletor.';
        this.changeDetector.detectChanges();
      },
    });
  }

  reactivate(collector: UserProfile): void {
    this.message = '';
    this.error = '';
    this.adminService.reactivateCollector(collector.id).subscribe({
      next: updated => {
        this.updateCollector(updated);
        this.message = 'Coletor reativado.';
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Nao foi possivel reativar o coletor.';
        this.changeDetector.detectChanges();
      },
    });
  }

  selectCollector(collector: UserProfile): void {
    this.selectedCollector = collector;
  }

  statusLabel(status: UserProfile['status']): string {
    const labels: Record<UserProfile['status'], string> = {
      ACTIVE: 'Ativo',
      PENDING_APPROVAL: 'Pendente',
      INACTIVE: 'Inativo',
      BLOCKED: 'Bloqueado',
    };
    return labels[status];
  }

  private load(): void {
    this.adminService.collectors().subscribe({
      next: collectors => {
        this.collectors = collectors;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Nao foi possivel carregar coletores.';
        this.changeDetector.detectChanges();
      },
    });
  }

  private updateCollector(updated: UserProfile): void {
    this.collectors = this.collectors.map(item => item.id === updated.id ? updated : item);
    if (this.selectedCollector?.id === updated.id) {
      this.selectedCollector = updated;
    }
  }
}
