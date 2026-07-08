import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreePlanting, TreePlantingService, TreePlantingStatus } from '../../services/tree-planting.service';

@Component({
  selector: 'app-admin-tree-plantings',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-tree-plantings.component.html',
  styleUrl: './admin-pages.css',
})
export class AdminTreePlantingsComponent implements OnInit {
  trees: TreePlanting[] = [];
  rejectionReasons: Record<string, string> = {};
  rejectingId: string | null = null;
  isLoading = true;
  message = '';
  error = '';

  constructor(
    private readonly treePlantingService: TreePlantingService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  validate(tree: TreePlanting): void {
    this.message = '';
    this.error = '';
    this.treePlantingService.validate(tree.id).subscribe({
      next: updated => this.updateTree(updated, 'Árvore validada. A foto de evidência foi removida.'),
      error: () => this.showError('Não foi possível validar a árvore.'),
    });
  }

  startReject(tree: TreePlanting): void {
    this.message = '';
    this.error = '';
    this.rejectingId = tree.id;
    this.rejectionReasons[tree.id] = this.rejectionReasons[tree.id] || tree.rejectionReason || '';
  }

  cancelReject(): void {
    this.rejectingId = null;
  }

  confirmReject(tree: TreePlanting): void {
    this.message = '';
    this.error = '';
    const reason = this.rejectionReasons[tree.id]?.trim() ?? '';
    if (!reason) {
      this.showError('Informe o motivo da rejeição.');
      return;
    }

    this.treePlantingService.reject(tree.id, reason).subscribe({
      next: updated => {
        this.rejectingId = null;
        this.updateTree(updated, 'Árvore rejeitada. A foto de evidência foi removida.');
      },
      error: error => this.showError(error?.error?.message || 'Não foi possível rejeitar a árvore.'),
    });
  }

  statusLabel(status: TreePlantingStatus): string {
    const labels: Record<TreePlantingStatus, string> = {
      REGISTERED: 'Aguardando',
      VALIDATED: 'Validada',
      REJECTED: 'Rejeitada',
    };
    return labels[status];
  }

  coordinates(tree: TreePlanting): string {
    if (typeof tree.latitude !== 'number' || typeof tree.longitude !== 'number') {
      return 'Não informada';
    }
    return `${tree.latitude}, ${tree.longitude}`;
  }

  private load(): void {
    this.treePlantingService.adminList().subscribe({
      next: trees => {
        this.trees = trees;
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível carregar árvores registradas.';
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
    });
  }

  private updateTree(updated: TreePlanting, message: string): void {
    this.trees = this.trees.map(tree => tree.id === updated.id ? updated : tree);
    this.message = message;
    this.changeDetector.detectChanges();
  }

  private showError(message: string): void {
    this.error = message;
    this.changeDetector.detectChanges();
  }
}
