import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { CreateTreePlantingPayload, TreePlantingService } from '../../services/tree-planting.service';

@Component({
  selector: 'app-plant-a-tree-register',
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './plant-a-tree-register.component.html',
  styleUrl: '../plant-a-tree/plant-a-tree.component.css',
})
export class PlantATreeRegisterComponent {
  isSaving = false;
  isLocating = false;
  message = '';
  error = '';
  photoPreview = '';
  selectedPhoto: File | null = null;

  speciesOptions = ['Ipê', 'Araçá', 'Pau-ferro', 'Mangueira', 'Cajueiro', 'Aroeira', 'Jambo', 'Outra'];
  locationTypes = ['Quintal de casa', 'Rua', 'Escola', 'Praça', 'Sítio', 'Outro'];
  form: CreateTreePlantingPayload = this.emptyForm();

  constructor(
    private readonly treePlantingService: TreePlantingService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  useMyLocation(): void {
    this.error = '';
    if (!window.isSecureContext) {
      this.error = 'O GPS do navegador exige HTTPS. No teste pelo celular usando IP local, registre sem localização ou preencha a referência do local.';
      return;
    }
    if (!navigator.geolocation) {
      this.error = 'Seu navegador não permite usar localização.';
      return;
    }

    this.isLocating = true;
    navigator.geolocation.getCurrentPosition(
      position => {
        this.form.latitude = Number(position.coords.latitude.toFixed(7));
        this.form.longitude = Number(position.coords.longitude.toFixed(7));
        this.isLocating = false;
        this.changeDetector.detectChanges();
      },
      locationError => {
        this.error = locationError.code === locationError.PERMISSION_DENIED
          ? 'Permissão de localização negada. Libere o acesso ao GPS no navegador ou registre sem localização.'
          : 'Não foi possível obter sua localização. Você pode registrar sem GPS e informar a referência do local.';
        this.isLocating = false;
        this.changeDetector.detectChanges();
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  }

  onPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedPhoto = file;
    this.photoPreview = '';
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.error = 'Envie uma imagem do plantio.';
      this.selectedPhoto = null;
      return;
    }
    this.photoPreview = URL.createObjectURL(file);
  }

  submit(): void {
    this.message = '';
    this.error = '';

    if (!this.form.species || !this.form.plantedDate || !this.form.locationType || !this.form.neighborhood) {
      this.error = 'Informe espécie, data, tipo de local e bairro.';
      return;
    }
    if (!this.selectedPhoto) {
      this.error = 'Envie uma foto da muda plantada.';
      return;
    }

    this.isSaving = true;
    this.treePlantingService.create({
      ...this.form,
      treeName: this.blankToNull(this.form.treeName),
      locationDescription: this.blankToNull(this.form.locationDescription),
      notes: this.blankToNull(this.form.notes),
      photo: this.selectedPhoto,
    }).subscribe({
      next: () => {
        this.form = this.emptyForm();
        this.selectedPhoto = null;
        this.photoPreview = '';
        this.message = 'Árvore registrada. Ela ficará aguardando validação do admin.';
        this.isSaving = false;
        this.changeDetector.detectChanges();
      },
      error: error => {
        this.error = this.submitErrorMessage(error);
        this.isSaving = false;
        this.changeDetector.detectChanges();
      },
    });
  }

  private emptyForm(): CreateTreePlantingPayload {
    return {
      treeName: '',
      species: 'Ipê',
      plantedDate: new Date().toISOString().slice(0, 10),
      locationType: 'Quintal de casa',
      neighborhood: '',
      locationDescription: '',
      notes: '',
      latitude: null,
      longitude: null,
      photo: null,
    };
  }

  private blankToNull(value?: string | null): string | null {
    return value?.trim() || null;
  }

  private submitErrorMessage(error: { status?: number; error?: { message?: string } }): string {
    if (error.status === 401 || error.status === 403) {
      return 'Sua sessão expirou. Entre novamente e tente registrar a árvore.';
    }
    if (error.status === 413) {
      return 'A foto está muito grande. Envie uma imagem com no máximo 10 MB.';
    }
    return error?.error?.message || 'Não foi possível registrar a árvore. Confira a foto, os campos obrigatórios e tente novamente.';
  }
}
