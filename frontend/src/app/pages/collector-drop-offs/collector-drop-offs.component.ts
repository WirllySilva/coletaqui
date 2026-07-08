import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { CollectionPointDelivery, CollectionPointDeliveryService } from '../../services/collection-point-delivery.service';
import { DropOffDelivery, DropOffService } from '../../services/drop-off.service';
import { MaterialType, ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-collector-drop-offs',
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './collector-drop-offs.component.html',
  styleUrl: './collector-drop-offs.component.css',
})
export class CollectorDropOffsComponent implements OnInit {
  materials: MaterialType[] = [];
  deliveries: DropOffDelivery[] = [];
  plannedDeliveries: CollectionPointDelivery[] = [];
  userPhone = '';
  selectedMaterialIds: string[] = [];
  notes = '';
  isLoading = true;
  isSaving = false;
  message = '';
  error = '';

  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly dropOffService: DropOffService,
    private readonly collectionPointDeliveryService: CollectionPointDeliveryService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  isMaterialSelected(materialId: string): boolean {
    return this.selectedMaterialIds.includes(materialId);
  }

  toggleMaterial(materialId: string): void {
    this.selectedMaterialIds = this.isMaterialSelected(materialId)
      ? this.selectedMaterialIds.filter(id => id !== materialId)
      : [...this.selectedMaterialIds, materialId];
  }

  confirmDelivery(): void {
    this.message = '';
    this.error = '';

    if (!this.userPhone.trim() || !this.selectedMaterialIds.length) {
      this.error = 'Informe o telefone do morador e pelo menos um material recebido.';
      return;
    }

    this.isSaving = true;
    this.dropOffService.confirmDelivery({
      userPhone: this.userPhone,
      materialTypeIds: this.selectedMaterialIds,
      notes: this.notes.trim() || null,
    }).subscribe({
      next: delivery => {
        this.deliveries = [delivery, ...this.deliveries];
        this.userPhone = '';
        this.selectedMaterialIds = [];
        this.notes = '';
        this.message = 'Entrega confirmada e pontuada no ranking do morador.';
        this.isSaving = false;
        this.changeDetector.detectChanges();
      },
      error: error => {
        this.error = this.errorMessage(error);
        this.isSaving = false;
        this.changeDetector.detectChanges();
      },
    });
  }

  confirmPlannedDelivery(delivery: CollectionPointDelivery): void {
    this.message = '';
    this.error = '';
    this.isSaving = true;

    this.collectionPointDeliveryService.confirm(delivery.id).subscribe({
      next: updated => {
        this.plannedDeliveries = this.plannedDeliveries.map(item => item.id === updated.id ? updated : item);
        this.message = 'Entrega registrada no ponto e pontuada no ranking do morador.';
        this.isSaving = false;
        this.changeDetector.detectChanges();
      },
      error: error => {
        this.error = this.errorMessage(error);
        this.isSaving = false;
        this.changeDetector.detectChanges();
      },
    });
  }

  private loadData(): void {
    this.scheduleService.listMaterials().subscribe({
      next: materials => {
        this.materials = materials;
        this.changeDetector.detectChanges();
      },
    });

    this.dropOffService.listMine().subscribe({
      next: deliveries => {
        this.deliveries = deliveries;
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
    });

    this.collectionPointDeliveryService.listForCollector().subscribe({
      next: deliveries => {
        this.plannedDeliveries = deliveries;
        this.changeDetector.detectChanges();
      },
    });
  }

  private errorMessage(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const body = error.error as { message?: string };
      if (body?.message) {
        return body.message;
      }
    }
    return 'Nao foi possivel confirmar a entrega.';
  }
}
