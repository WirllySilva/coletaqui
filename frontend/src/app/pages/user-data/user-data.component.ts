import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { UserAddress, UserProfile, UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-data-page',
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.css',
})
export class UserDataPageComponent implements OnInit {
  profile: UserProfile | null = null;
  name = '';
  region = '';
  selectedMaterials: string[] = [];
  selectedAvailability: string[] = [];
  addresses: UserAddress[] = [];
  addressForm = this.emptyAddressForm();
  isLoading = true;
  isSaving = false;
  isSavingAddress = false;
  isLoadingAddresses = false;
  message = '';
  error = '';
  addressMessage = '';
  addressError = '';

  materialOptions = ['Papel', 'Plástico', 'Vidro', 'Metal', 'Óleo', 'Pilhas e baterias', 'Orgânico'];
  availabilityOptions = ['Manhã', 'Tarde', 'Noite', 'Segunda a sexta', 'Fim de semana'];

  get isCollector(): boolean {
    return this.profile?.role === 'COLLECTOR';
  }

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('coletaqui_token')) {
      void this.router.navigateByUrl('/');
      return;
    }

    this.loadProfile();
    this.loadAddresses();
  }

  isMaterialSelected(value: string): boolean {
    return this.selectedMaterials.includes(value);
  }

  isAvailabilitySelected(value: string): boolean {
    return this.selectedAvailability.includes(value);
  }

  toggleMaterial(value: string): void {
    this.selectedMaterials = this.toggleValue(this.selectedMaterials, value);
  }

  toggleAvailability(value: string): void {
    this.selectedAvailability = this.toggleValue(this.selectedAvailability, value);
  }

  goBack(): void {
    void this.router.navigateByUrl(this.isCollector ? '/collector-home' : '/home');
  }

  save(): void {
    if (!this.name.trim()) {
      this.error = 'Informe seu nome para salvar o perfil.';
      return;
    }

    this.isSaving = true;
    this.message = '';
    this.error = '';

    this.userService.updateMyProfile({
      name: this.name.trim(),
      region: this.region.trim() || null,
      materials: this.selectedMaterials.join(', ') || null,
      availability: this.selectedAvailability.join(', ') || null,
    }).pipe(
      finalize(() => {
        this.isSaving = false;
        this.changeDetector.detectChanges();
      }),
    ).subscribe({
      next: profile => {
        this.profile = profile;
        this.fillForm(profile);
        this.updateStoredUser(profile);
        this.message = 'Perfil atualizado com sucesso.';
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível atualizar seu perfil. Tente novamente.';
        this.changeDetector.detectChanges();
      },
    });
  }

  saveAddress(): void {
    if (!this.addressForm.label.trim() || !this.addressForm.street.trim() || !this.addressForm.neighborhood.trim() || !this.addressForm.city.trim() || !this.addressForm.state.trim()) {
      this.addressError = 'Preencha identificacao, rua, bairro, cidade e UF.';
      return;
    }

    this.isSavingAddress = true;
    this.addressMessage = '';
    this.addressError = '';

    this.userService.createMyAddress({
      label: this.addressForm.label.trim(),
      street: this.addressForm.street.trim(),
      number: this.blankToNull(this.addressForm.number),
      complement: this.blankToNull(this.addressForm.complement),
      neighborhood: this.addressForm.neighborhood.trim(),
      city: this.addressForm.city.trim(),
      state: this.addressForm.state.trim().toUpperCase(),
      zipCode: this.blankToNull(this.addressForm.zipCode),
      defaultAddress: this.addressForm.defaultAddress,
    }).pipe(
      finalize(() => {
        this.isSavingAddress = false;
        this.changeDetector.detectChanges();
      }),
    ).subscribe({
      next: () => {
        this.addressForm = this.emptyAddressForm(false);
        this.addressMessage = 'Endereco cadastrado com sucesso.';
        this.loadAddresses();
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.addressError = 'Nao foi possivel cadastrar o endereco. Tente novamente.';
        this.changeDetector.detectChanges();
      },
    });
  }

  removeAddress(address: UserAddress): void {
    this.addressMessage = '';
    this.addressError = '';

    this.userService.deleteMyAddress(address.id).subscribe({
      next: () => {
        this.addresses = this.addresses.filter(item => item.id !== address.id);
        this.addressMessage = 'Endereco removido.';
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.addressError = 'Nao foi possivel remover o endereco.';
        this.changeDetector.detectChanges();
      },
    });
  }

  addressLine(address: UserAddress): string {
    const number = address.number ? `, ${address.number}` : '';
    const complement = address.complement ? ` - ${address.complement}` : '';
    const zipCode = address.zipCode ? `, CEP ${address.zipCode}` : '';

    return `${address.street}${number}${complement}, ${address.neighborhood}, ${address.city}/${address.state}${zipCode}`;
  }

  private loadProfile(): void {
    this.userService.getMyProfile().pipe(
      finalize(() => {
        this.isLoading = false;
        this.changeDetector.detectChanges();
      }),
    ).subscribe({
      next: profile => {
        this.profile = profile;
        this.fillForm(profile);
        this.updateStoredUser(profile);
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível carregar seu perfil.';
        this.changeDetector.detectChanges();
      },
    });
  }

  private loadAddresses(): void {
    this.isLoadingAddresses = true;

    this.userService.getMyAddresses().pipe(
      finalize(() => {
        this.isLoadingAddresses = false;
        this.changeDetector.detectChanges();
      }),
    ).subscribe({
      next: addresses => {
        this.addresses = addresses;
        if (addresses.length > 0 && this.isAddressFormEmpty()) {
          this.addressForm = this.emptyAddressForm(false);
        }
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.addressError = 'Nao foi possivel carregar seus enderecos.';
        this.changeDetector.detectChanges();
      },
    });
  }

  private fillForm(profile: UserProfile): void {
    this.name = profile.name ?? '';
    this.region = profile.region ?? '';
    this.selectedMaterials = this.splitOptions(profile.materials);
    this.selectedAvailability = this.splitOptions(profile.availability);
  }

  private splitOptions(value?: string | null): string[] {
    return value?.split(',').map(item => item.trim()).filter(Boolean) ?? [];
  }

  private toggleValue(values: string[], value: string): string[] {
    return values.includes(value)
      ? values.filter(item => item !== value)
      : [...values, value];
  }

  private emptyAddressForm(defaultAddress = this.addresses.length === 0) {
    return {
      label: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      defaultAddress,
    };
  }

  private isAddressFormEmpty(): boolean {
    return !this.addressForm.label
      && !this.addressForm.street
      && !this.addressForm.number
      && !this.addressForm.complement
      && !this.addressForm.neighborhood
      && !this.addressForm.city
      && !this.addressForm.state
      && !this.addressForm.zipCode;
  }

  private blankToNull(value: string): string | null {
    return value.trim() ? value.trim() : null;
  }

  private updateStoredUser(profile: UserProfile): void {
    const storedUser = localStorage.getItem('coletaqui_user');
    const user = storedUser ? JSON.parse(storedUser) : {};

    localStorage.setItem('coletaqui_user', JSON.stringify({
      ...user,
      name: profile.name,
      phone: profile.phone,
      role: profile.role,
      status: profile.status,
      profileComplete: profile.profileComplete,
    }));
  }
}
