import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminMaterial, AdminService, CollectionPoint, UpsertCollectionPointPayload } from '../../services/admin.service';

type CollectionPointForm = Omit<UpsertCollectionPointPayload, 'latitude' | 'longitude' | 'openingHours'> & {
  latitude: string;
  longitude: string;
  weekdays: string[];
  openingStart: string;
  openingEnd: string;
};

@Component({
  selector: 'app-admin-collection-points',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-collection-points.component.html',
  styleUrl: './admin-pages.css',
})
export class AdminCollectionPointsComponent implements OnInit {
  readonly weekdays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  readonly timeOptions = this.buildTimeOptions();

  points: CollectionPoint[] = [];
  materials: AdminMaterial[] = [];
  selectedMaterials: string[] = [];
  editing: CollectionPoint | null = null;
  form: CollectionPointForm = this.emptyForm();
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
    const latitude = this.parseCoordinate(this.form.latitude);
    const longitude = this.parseCoordinate(this.form.longitude);
    if (!this.isCoordinateInsideAracoiaba(latitude, longitude)) {
      this.error = 'Informe coordenadas válidas dentro de Araçoiaba. Ex.: latitude -7.789004 e longitude -35.087497.';
      return;
    }

    const openingHours = this.composeOpeningHours();
    if (openingHours === undefined) {
      return;
    }

    const payload: UpsertCollectionPointPayload = {
      name: this.form.name,
      description: this.form.description,
      address: this.form.address,
      city: this.form.city,
      state: this.form.state,
      materials: this.selectedMaterials.join(', '),
      openingHours,
      responsiblePhone: this.form.responsiblePhone,
      latitude,
      longitude,
      active: this.form.active,
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
        this.error = 'Não foi possível salvar o ponto.';
        this.changeDetector.detectChanges();
      },
    });
  }

  edit(point: CollectionPoint): void {
    this.editing = point;
    this.selectedMaterials = this.parseMaterials(point.materials);
    const schedule = this.parseOpeningHours(point.openingHours);
    this.form = {
      name: point.name,
      description: point.description ?? '',
      address: point.address,
      city: point.city,
      state: point.state,
      materials: point.materials ?? '',
      weekdays: schedule.weekdays,
      openingStart: schedule.openingStart,
      openingEnd: schedule.openingEnd,
      responsiblePhone: point.responsiblePhone ?? '',
      latitude: point.latitude?.toString() ?? '',
      longitude: point.longitude?.toString() ?? '',
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
        this.error = 'Não foi possível alterar o status do ponto.';
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

  isWeekdaySelected(day: string): boolean {
    return this.form.weekdays.includes(day);
  }

  toggleWeekday(day: string): void {
    this.form.weekdays = this.isWeekdaySelected(day)
      ? this.form.weekdays.filter(item => item !== day)
      : [...this.form.weekdays, day];
  }

  private load(): void {
    this.adminService.collectionPoints().subscribe({
      next: points => {
        this.points = points;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível carregar pontos.';
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

  private emptyForm(): CollectionPointForm {
    return {
      name: '',
      description: '',
      address: '',
      city: 'Araçoiaba',
      state: 'PE',
      materials: '',
      weekdays: [],
      openingStart: '',
      openingEnd: '',
      responsiblePhone: '',
      latitude: '',
      longitude: '',
      active: true,
    };
  }

  private parseCoordinate(value: string): number | null {
    const normalized = value.trim().replace(',', '.');
    if (!normalized) {
      return null;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private isCoordinateInsideAracoiaba(latitude: number | null, longitude: number | null): boolean {
    if (latitude === null && longitude === null) {
      return true;
    }

    if (latitude === null || longitude === null) {
      return false;
    }

    return latitude >= -7.835 && latitude <= -7.745 && longitude >= -35.14 && longitude <= -35.045;
  }

  private composeOpeningHours(): string | null | undefined {
    const hasWeekdays = this.form.weekdays.length > 0;
    const hasStart = Boolean(this.form.openingStart);
    const hasEnd = Boolean(this.form.openingEnd);

    if (!hasWeekdays && !hasStart && !hasEnd) {
      return null;
    }

    if (!hasWeekdays || !hasStart || !hasEnd) {
      this.error = 'Informe os dias da semana, o horário de início e o horário de fim.';
      return undefined;
    }

    if (this.toMinutes(this.form.openingStart) >= this.toMinutes(this.form.openingEnd)) {
      this.error = 'O horário de início deve ser menor que o horário de fim.';
      return undefined;
    }

    return `${this.form.weekdays.join(', ')} - ${this.form.openingStart} às ${this.form.openingEnd}`;
  }

  private parseOpeningHours(value?: string | null): Pick<CollectionPointForm, 'weekdays' | 'openingStart' | 'openingEnd'> {
    const empty = { weekdays: [], openingStart: '', openingEnd: '' };
    if (!value) {
      return empty;
    }

    const match = value.match(/^(.*?) - (\d{2}:\d{2}) às (\d{2}:\d{2})$/);
    if (!match) {
      return empty;
    }

    return {
      weekdays: match[1].split(',').map(day => day.trim()).filter(day => this.weekdays.includes(day)),
      openingStart: match[2],
      openingEnd: match[3],
    };
  }

  private buildTimeOptions(): string[] {
    return Array.from({ length: 49 }, (_, index) => {
      const totalMinutes = index * 30;
      const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
      const minutes = (totalMinutes % 60).toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    });
  }

  private toMinutes(value: string): number {
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
