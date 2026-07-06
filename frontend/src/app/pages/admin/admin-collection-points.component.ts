import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminMaterial, AdminService, CollectionPoint, UpsertCollectionPointPayload } from '../../services/admin.service';

@Component({
  selector: 'app-admin-collection-points',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-collection-points.component.html',
  styleUrl: './admin-pages.css',
})
export class AdminCollectionPointsComponent implements OnInit {
  points: CollectionPoint[] = [];
  materials: AdminMaterial[] = [];
  selectedMaterials: string[] = [];
  editing: CollectionPoint | null = null;
  form: UpsertCollectionPointPayload = this.emptyForm();
  message = '';
  error = '';

  constructor(
    private readonly adminService: AdminService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
    this.loadMaterials();
  }

  submit(): void {
    this.message = '';
    this.error = '';
    const payload = {
      ...this.form,
      materials: this.selectedMaterials.join(', '),
    };
    const request = this.editing
      ? this.adminService.updateCollectionPoint(this.editing.id, payload)
      : this.adminService.createCollectionPoint(payload);

    request.subscribe({
      next: point => {
        this.points = this.editing
          ? this.points.map(item => item.id === point.id ? point : item)
          : [point, ...this.points];
        this.message = this.editing ? 'Ponto atualizado.' : 'Ponto criado.';
        this.cancelEdit();
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Nao foi possivel salvar o ponto.';
        this.changeDetector.detectChanges();
      },
    });
  }

  edit(point: CollectionPoint): void {
    this.editing = point;
    this.selectedMaterials = this.parseMaterials(point.materials);
    this.form = {
      name: point.name,
      description: point.description ?? '',
      address: point.address,
      city: point.city,
      state: point.state,
      materials: point.materials ?? '',
      openingHours: point.openingHours ?? '',
      active: point.active,
    };
  }

  toggle(point: CollectionPoint): void {
    this.adminService.toggleCollectionPoint(point.id).subscribe({
      next: updated => {
        this.points = this.points.map(item => item.id === updated.id ? updated : item);
        this.message = updated.active ? 'Ponto ativado.' : 'Ponto desativado.';
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Nao foi possivel alterar o status do ponto.';
        this.changeDetector.detectChanges();
      },
    });
  }

  cancelEdit(): void {
    this.editing = null;
    this.selectedMaterials = [];
    this.form = this.emptyForm();
  }

  isMaterialSelected(name: string): boolean {
    return this.selectedMaterials.includes(name);
  }

  toggleMaterial(name: string): void {
    this.selectedMaterials = this.isMaterialSelected(name)
      ? this.selectedMaterials.filter(item => item !== name)
      : [...this.selectedMaterials, name];
  }

  private load(): void {
    this.adminService.collectionPoints().subscribe({
      next: points => {
        this.points = points;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Nao foi possivel carregar pontos.';
        this.changeDetector.detectChanges();
      },
    });
  }

  private loadMaterials(): void {
    this.adminService.materials().subscribe({
      next: materials => {
        this.materials = materials.filter(material => material.active);
        this.changeDetector.detectChanges();
      },
    });
  }

  private parseMaterials(value?: string | null): string[] {
    if (!value) {
      return [];
    }

    return value.split(',').map(item => item.trim()).filter(Boolean);
  }

  private emptyForm(): UpsertCollectionPointPayload {
    return {
      name: '',
      description: '',
      address: '',
      city: 'Araçoiaba',
      state: 'PE',
      materials: '',
      openingHours: '',
      active: true,
    };
  }
}
