import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MaterialType, Schedule, ScheduleService } from '../../services/schedule.service';
import { UserAddress, UserService } from '../../services/user.service';

@Component({
  selector: 'app-my-appointments-page',
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './my-appointments.component.html',
  styleUrl: './my-appointments.component.css',
})
export class MyAppointmentsPageComponent implements OnInit {
  addresses: UserAddress[] = [];
  materials: MaterialType[] = [];
  schedules: Schedule[] = [];
  selectedAddressId = '';
  selectedMaterialIds: string[] = [];
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
    if (!this.selectedAddressId || !this.selectedMaterialIds.length || !this.preferredPeriod) {
      this.error = 'Escolha endereço, materiais e disponibilidade.';
      return;
    }

    this.isSaving = true;
    this.message = '';
    this.error = '';

    this.scheduleService.createSchedule({
      addressId: this.selectedAddressId,
      materialTypeIds: this.selectedMaterialIds,
      preferredPeriod: this.preferredPeriod,
      notes: this.notes.trim() || null,
    }).pipe(
      finalize(() => {
        this.isSaving = false;
        this.changeDetector.detectChanges();
      }),
    ).subscribe({
      next: schedule => {
        this.schedules = [schedule, ...this.schedules];
        this.selectedMaterialIds = [];
        this.preferredPeriod = '';
        this.notes = '';
        this.message = 'Solicitação enviada para os coletores.';
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível enviar a solicitação. Tente novamente.';
        this.changeDetector.detectChanges();
      },
    });
  }

  goHome(): void {
    void this.router.navigateByUrl('/home');
  }

  openDetail(schedule: Schedule): void {
    void this.router.navigate(['/schedules', schedule.id]);
  }

  cancel(schedule: Schedule): void {
    this.message = '';
    this.error = '';

    this.scheduleService.cancelSchedule(schedule.id).subscribe({
      next: updated => {
        this.schedules = this.schedules.map(item => item.id === updated.id ? updated : item);
        this.message = 'Solicitacao cancelada.';
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Nao foi possivel cancelar a solicitacao.';
        this.changeDetector.detectChanges();
      },
    });
  }

  statusLabel(status: Schedule['status']): string {
    const labels: Record<Schedule['status'], string> = {
      REQUESTED: 'Solicitada',
      ACCEPTED: 'Aceita',
      COMPLETED: 'Concluída',
      CANCELED: 'Cancelada',
    };
    return labels[status];
  }

  private loadData(): void {
    this.isLoading = true;

    this.userService.getMyAddresses().subscribe({
      next: addresses => {
        this.addresses = addresses;
        this.selectedAddressId = addresses.find(address => address.defaultAddress)?.id ?? addresses[0]?.id ?? '';
        this.changeDetector.detectChanges();
      },
    });

    this.scheduleService.listMaterials().subscribe({
      next: materials => {
        this.materials = materials;
        this.changeDetector.detectChanges();
      },
    });

    this.scheduleService.listMySchedules().pipe(
      finalize(() => {
        this.isLoading = false;
        this.changeDetector.detectChanges();
      }),
    ).subscribe({
      next: schedules => {
        this.schedules = schedules;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível carregar seus agendamentos.';
        this.changeDetector.detectChanges();
      },
    });
  }
}
