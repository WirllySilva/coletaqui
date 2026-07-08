import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { CollectionPointDelivery, CollectionPointDeliveryService } from '../../services/collection-point-delivery.service';
import { MaterialType, ScheduleService } from '../../services/schedule.service';
import { CollectionPoint, UserService } from '../../services/user.service';

@Component({
  selector: 'app-collection-point-delivery',
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './collection-point-delivery.component.html',
  styleUrl: './collection-point-delivery.component.css',
})
export class CollectionPointDeliveryComponent implements OnInit {
  point: CollectionPoint | null = null;
  materials: MaterialType[] = [];
  selectedMaterialIds: string[] = [];
  plannedDate = this.today();
  preferredPeriod = 'Manhã';
  notes = '';
  isLoading = true;
  isSaving = false;
  error = '';
  success: CollectionPointDelivery | null = null;
  private pointLoaded = false;
  private materialsLoaded = false;

  readonly periods = ['Manhã', 'Tarde', 'Noite'];

  get acceptedMaterials(): MaterialType[] {
    if (!this.point?.materials?.trim()) {
      return this.materials;
    }

    const acceptedText = this.normalize(this.point.materials);
    const filtered = this.materials.filter(material => this.pointAcceptsMaterial(acceptedText, material));
    return filtered.length ? filtered : this.materials;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly scheduleService: ScheduleService,
    private readonly deliveryService: CollectionPointDeliveryService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const pointId = this.route.snapshot.paramMap.get('pointId');
    if (!pointId) {
      void this.router.navigate(['/collection-points']);
      return;
    }

    this.userService.listCollectionPoints().subscribe({
      next: points => {
        this.point = points.find(item => item.id === pointId) ?? null;
        if (!this.point) {
          this.error = 'Ponto de coleta não encontrado.';
        } else if (!this.point.responsibleCollectorId) {
          this.error = 'Este ponto ainda não confirma entregas pelo app.';
        }
        this.pointLoaded = true;
        this.syncSelectedMaterials();
        this.finishLoadingIfReady();
      },
      error: () => {
        this.error = 'Não foi possível carregar o ponto de coleta.';
        this.pointLoaded = true;
        this.finishLoadingIfReady();
      },
    });

    this.scheduleService.listMaterials().subscribe({
      next: materials => {
        this.materials = materials;
        this.materialsLoaded = true;
        this.syncSelectedMaterials();
        this.finishLoadingIfReady();
      },
      error: () => {
        this.error = 'Não foi possível carregar os materiais.';
        this.materialsLoaded = true;
        this.finishLoadingIfReady();
      },
    });
  }

  isMaterialSelected(materialId: string): boolean {
    return this.selectedMaterialIds.includes(materialId);
  }

  toggleMaterial(materialId: string): void {
    this.selectedMaterialIds = this.isMaterialSelected(materialId)
      ? this.selectedMaterialIds.filter(id => id !== materialId)
      : [...this.selectedMaterialIds, materialId];
  }

  submit(): void {
    if (!this.point || this.isSaving) {
      return;
    }

    if (!this.point.responsibleCollectorId) {
      this.error = 'Este ponto ainda não confirma entregas pelo app.';
      return;
    }

    if (!this.selectedMaterialIds.length) {
      this.error = 'Selecione pelo menos um material.';
      return;
    }

    this.isSaving = true;
    this.error = '';
    this.success = null;

    this.deliveryService.create({
      collectionPointId: this.point.id,
      materialTypeIds: this.selectedMaterialIds,
      plannedDate: this.plannedDate,
      preferredPeriod: this.preferredPeriod,
      notes: this.notes.trim() || null,
    }).subscribe({
      next: delivery => {
        this.success = delivery;
        this.isSaving = false;
        this.changeDetector.detectChanges();
      },
      error: error => {
        this.error = error?.error?.message || 'Não foi possível registrar sua entrega.';
        this.isSaving = false;
        this.changeDetector.detectChanges();
      },
    });
  }

  wazeLink(): string {
    if (!this.point) {
      return '#';
    }

    if (typeof this.point.latitude === 'number' && typeof this.point.longitude === 'number') {
      return `https://waze.com/ul?ll=${this.point.latitude},${this.point.longitude}&navigate=yes`;
    }

    return `https://waze.com/ul?q=${encodeURIComponent(`${this.point.address}, ${this.point.city} ${this.point.state}`)}&navigate=yes`;
  }

  private finishLoadingIfReady(): void {
    this.isLoading = !(this.pointLoaded && this.materialsLoaded);
    this.changeDetector.detectChanges();
  }

  private syncSelectedMaterials(): void {
    if (!this.pointLoaded || !this.materialsLoaded) {
      return;
    }

    const accepted = this.acceptedMaterials;
    if (accepted.length === 1) {
      this.selectedMaterialIds = [accepted[0].id];
      return;
    }

    const acceptedIds = new Set(accepted.map(material => material.id));
    this.selectedMaterialIds = this.selectedMaterialIds.filter(id => acceptedIds.has(id));
  }

  private pointAcceptsMaterial(acceptedText: string, material: MaterialType): boolean {
    const materialName = this.normalize(material.name);
    const materialSlug = this.normalize(material.slug).replace(/-/g, ' ');

    if (acceptedText.includes(materialName) || acceptedText.includes(materialSlug) || materialName.includes(acceptedText) || materialSlug.includes(acceptedText)) {
      return true;
    }

    const acceptedTokens = acceptedText.split(/\s+|,/).filter(token => token.length > 3);
    if (acceptedTokens.some(token => materialName.includes(token) || materialSlug.includes(token))) {
      return true;
    }

    return materialSlug.split(/\s+/).some(token => token.length > 3 && acceptedText.includes(token));
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
