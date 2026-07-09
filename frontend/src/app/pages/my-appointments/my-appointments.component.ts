import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MaterialType, Schedule, ScheduleService } from '../../services/schedule.service';
import { UserAddress, UserService } from '../../services/user.service';
import { friendlyErrorMessage } from '../../utils/error-message';

@Component({
  selector: 'app-my-appointments-page',
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './my-appointments.component.html',
  styleUrl: './my-appointments.component.css',
})
export class MyAppointmentsPageComponent implements OnInit {
  addresses: UserAddress[] = [];
  materials: MaterialType[] = [];
  submittedSchedule: Schedule | null = null;
  selectedAddressId = '';
  selectedMaterialIds: string[] = [];
  desiredDate = '';
  preferredPeriod = '';
  notes = '';
  isLoading = true;
  isSaving = false;
  message = '';
  error = '';

  periodOptions = ['Manhã', 'Tarde', 'Noite', 'Segunda a sexta', 'Fim de semana'];

  constructor(
    private readonly userService: UserService,
    private readonly scheduleService: ScheduleService,
    private readonly router: Router,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  get minDate(): string {
    return new Date().toISOString().slice(0, 10);
  }

  ngOnInit(): void {
    this.loadData();
  }

  isMaterialSelected(materialId: string): boolean {
    return this.selectedMaterialIds.includes(materialId);
  }

  toggleMaterial(materialId: string): void {
    this.selectedMaterialIds = this.selectedMaterialIds.includes(materialId)
      ? this.selectedMaterialIds.filter(id => id !== materialId)
      : [...this.selectedMaterialIds, materialId];
  }

  createSchedule(): void {
    if (!this.selectedAddressId || !this.selectedMaterialIds.length || !this.desiredDate || !this.preferredPeriod) {
      this.error = 'Escolha o endereço, marque os materiais e informe a data e o melhor período.';
      return;
    }

    this.isSaving = true;
    this.message = '';
    this.error = '';

    this.scheduleService.createSchedule({
      addressId: this.selectedAddressId,
      materialTypeIds: this.selectedMaterialIds,
      desiredDate: this.desiredDate,
      preferredPeriod: this.preferredPeriod,
      notes: this.notes.trim() || null,
    }).pipe(
      finalize(() => {
        this.isSaving = false;
        this.changeDetector.detectChanges();
      }),
    ).subscribe({
      next: schedule => {
        this.submittedSchedule = schedule;
        this.selectedMaterialIds = [];
        this.desiredDate = '';
        this.preferredPeriod = '';
        this.notes = '';
        this.message = 'Solicitação enviada. Agora é só aguardar um coletor aceitar.';
        this.changeDetector.detectChanges();
      },
      error: error => {
        this.error = friendlyErrorMessage(error, 'Não foi possível enviar a solicitação. Confira os dados e tente novamente.');
        this.changeDetector.detectChanges();
      },
    });
  }

  goHome(): void {
    void this.router.navigateByUrl('/home');
  }

  newSchedule(): void {
    this.message = '';
    this.error = '';
    this.submittedSchedule = null;
  }

  private loadData(): void {
    this.isLoading = true;

    this.userService.getMyAddresses().subscribe({
      next: addresses => {
        this.addresses = addresses;
        this.selectedAddressId = addresses.find(address => address.defaultAddress)?.id ?? addresses[0]?.id ?? '';
        this.changeDetector.detectChanges();
      },
      error: error => {
        this.error = friendlyErrorMessage(error, 'Não foi possível carregar seus endereços. Cadastre um endereço no seu perfil.');
        this.changeDetector.detectChanges();
      },
    });

    this.scheduleService.listMaterials().pipe(
      finalize(() => {
        this.isLoading = false;
        this.changeDetector.detectChanges();
      }),
    ).subscribe({
      next: materials => {
        this.materials = materials;
        this.changeDetector.detectChanges();
      },
      error: error => {
        this.error = friendlyErrorMessage(error, 'Não foi possível carregar os materiais. Tente novamente.');
        this.changeDetector.detectChanges();
      },
    });
  }
}
