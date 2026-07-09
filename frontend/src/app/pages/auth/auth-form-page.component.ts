import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthResponse, AuthService } from '../../services/auth.service';
import { CollectorServiceType } from '../../services/user.service';
import { friendlyErrorMessage } from '../../utils/error-message';

@Component({
  selector: 'app-auth-form-page',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './auth-form-page.component.html',
  styleUrl: './auth-form-page.component.css',
})
export class AuthFormPageComponent {
  private readonly defaultAreaCode = '81';

  @Input() title = 'Entrar ou criar conta';
  @Input() subtitle = 'Informe seu telefone para receber um código de acesso.';
  @Input() profile: 'common' | 'collector' = 'common';

  step: 'phone' | 'otp' | 'profile' = 'phone';
  phone = '';
  otp = '';
  name = '';
  region = '';
  materials = '';
  availability = '';
  collectorServiceType: CollectorServiceType = 'HOME_COLLECTION';
  selectedMaterials: string[] = [];
  selectedAvailability: string[] = [];
  termsAccepted = false;
  privacyAccepted = false;
  error = '';
  isLoading = false;
  devOtp = '';
  private authToken = '';

  materialOptions = ['Papel', 'Plástico', 'Vidro', 'Metal', 'Óleo', 'Pilhas e baterias', 'Orgânico'];
  availabilityOptions = ['Manhã', 'Tarde', 'Noite', 'Segunda a sexta', 'Fim de semana'];

  serviceTypeOptions: Array<{ value: CollectorServiceType; label: string; description: string }> = [
    { value: 'HOME_COLLECTION', label: 'Coleta domiciliar', description: 'Retiro os materiais no endereço do usuário.' },
    { value: 'DROP_OFF_POINT', label: 'Ponto de recebimento', description: 'Recebo materiais no meu estabelecimento.' },
    { value: 'HOME_COLLECTION_AND_DROP_OFF', label: 'Coleta + recebimento', description: 'Retiro no endereço e também recebo no local.' },
  ];

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  get profileLabel(): string {
    return this.profile === 'collector' ? 'coletor' : 'usuário comum';
  }

  get formattedPhone(): string {
    return this.formatPhone(this.normalizedPhone() ?? this.onlyNumbers(this.phone)) || 'telefone informado';
  }

  get canContinue(): boolean {
    if (this.step === 'phone') {
      return this.normalizedPhone() !== null;
    }

    if (this.step === 'otp') {
      return this.onlyNumbers(this.otp).length === 6;
    }

    const acceptedLegal = this.termsAccepted && this.privacyAccepted;

    if (this.profile === 'collector') {
      return Boolean(
        this.name.trim()
        && this.region.trim()
        && this.collectorServiceType
        && this.selectedMaterials.length
        && this.selectedAvailability.length
        && acceptedLegal,
      );
    }

    return Boolean(this.name.trim() && acceptedLegal);
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

  onPhoneChange(value: string): void {
    this.phone = this.formatPhoneInput(value);
  }

  continue(): void {
    this.error = '';

    if (this.isLoading) {
      return;
    }

    if (!this.canContinue) {
      this.error = this.validationMessage();
      return;
    }

    if (this.step === 'phone') {
      this.requestOtp();
      return;
    }

    if (this.step === 'otp') {
      this.verifyOtp();
      return;
    }

    this.completeProfile();
  }

  back(): void {
    this.error = '';

    if (this.step === 'profile') {
      this.step = 'otp';
      return;
    }

    if (this.step === 'otp') {
      this.step = 'phone';
      return;
    }

    void this.router.navigateByUrl('/loginselectionpage');
  }

  private requestOtp(): void {
    const phone = this.normalizedPhone();
    if (!phone) {
      this.error = this.validationMessage();
      return;
    }

    this.isLoading = true;
    this.devOtp = '';

    this.authService.requestOtp(this.profile, phone).pipe(
      finalize(() => {
        this.isLoading = false;
        this.changeDetector.detectChanges();
      }),
    ).subscribe({
      next: response => {
        this.devOtp = response.devOtp ?? '';
        this.step = 'otp';
        this.changeDetector.detectChanges();
      },
      error: error => {
        this.error = this.authErrorMessage(error, 'Não foi possível enviar o código pelo WhatsApp. Confira o telefone e tente novamente.');
        this.changeDetector.detectChanges();
      },
    });
  }

  private verifyOtp(): void {
    const phone = this.normalizedPhone();
    if (!phone) {
      this.error = this.validationMessage();
      return;
    }

    this.isLoading = true;

    this.authService.verifyOtp(this.profile, phone, this.onlyNumbers(this.otp)).pipe(
      finalize(() => {
        this.isLoading = false;
        this.changeDetector.detectChanges();
      }),
    ).subscribe({
      next: response => {
        this.authToken = response.token;
        localStorage.setItem('coletaqui_token', response.token);

        if (response.profileComplete) {
          this.navigateAfterLogin(response);
          return;
        }

        this.step = 'profile';
        this.changeDetector.detectChanges();
      },
      error: error => {
        this.error = this.authErrorMessage(error, 'Código inválido ou expirado. Confira o código ou solicite um novo.');
        this.changeDetector.detectChanges();
      },
    });
  }

  private completeProfile(): void {
    this.isLoading = true;

    this.authService.completeProfile(this.authToken, {
      name: this.name.trim(),
      region: this.region.trim() || undefined,
      materials: this.profile === 'collector' ? this.selectedMaterials.join(', ') : this.materials.trim() || undefined,
      availability: this.profile === 'collector' ? this.selectedAvailability.join(', ') : this.availability.trim() || undefined,
      collectorServiceType: this.profile === 'collector' ? this.collectorServiceType : undefined,
      termsAccepted: this.termsAccepted,
      privacyAccepted: this.privacyAccepted,
    }).pipe(
      finalize(() => {
        this.isLoading = false;
        this.changeDetector.detectChanges();
      }),
    ).subscribe({
      next: response => this.navigateAfterLogin(response),
      error: error => {
        this.error = this.authErrorMessage(error, 'Não foi possível concluir o cadastro. Confira os campos e tente novamente.');
        this.changeDetector.detectChanges();
      },
    });
  }

  private navigateAfterLogin(response: AuthResponse): void {
    localStorage.setItem('coletaqui_user', JSON.stringify(response));
    const route = response.role === 'ADMIN'
      ? '/admin/dashboard'
      : response.role === 'COLLECTOR'
        ? (response.status === 'ACTIVE' ? '/collector-home' : '/collector-pending')
        : '/home';
    void this.router.navigateByUrl(route);
  }

  private onlyNumbers(value: string): string {
    return value.replace(/\D/g, '');
  }

  private normalizedPhone(): string | null {
    let digits = this.onlyNumbers(this.phone);

    if (digits.length === 13 && digits.startsWith('55')) {
      digits = digits.slice(2);
    }

    if (digits.length === 9 && digits.startsWith('9')) {
      return `${this.defaultAreaCode}${digits}`;
    }

    if (digits.length === 11 && /^[1-9]\d9\d{8}$/.test(digits)) {
      return digits;
    }

    return null;
  }

  private formatPhoneInput(value: string): string {
    let digits = this.onlyNumbers(value);

    if (digits.length > 11 && digits.startsWith('55')) {
      digits = digits.slice(2);
    }

    return this.formatPhone(digits.slice(0, 11));
  }

  private formatPhone(value: string): string {
    const digits = this.onlyNumbers(value);

    if (digits.length <= 9) {
      return digits.replace(/^(\d{0,5})(\d{0,4}).*/, (_, first, second) => [first, second].filter(Boolean).join('-'));
    }

    if (digits.length <= 10) {
      return digits.replace(/^(\d{0,2})(\d{0,4})(\d{0,4}).*/, (_, ddd, first, second) => {
        const phone = [first, second].filter(Boolean).join('-');
        return ddd ? `(${ddd}) ${phone}`.trim() : phone;
      });
    }

    return digits.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, (_, ddd, first, second) => `(${ddd}) ${first}${second ? `-${second}` : ''}`);
  }

  private validationMessage(): string {
    if (this.step === 'phone') {
      return 'Informe um celular válido. Pode digitar com DDD ou apenas o número de Araçoiaba.';
    }

    if (this.step === 'otp') {
      return 'Digite o código de 6 números recebido pelo WhatsApp.';
    }

    if (!this.termsAccepted || !this.privacyAccepted) {
      return 'Para continuar, leia e aceite os Termos de Uso e a Política de Privacidade.';
    }

    if (this.profile === 'collector') {
      return 'Preencha nome, região, materiais coletados e disponibilidade.';
    }

    return 'Informe seu nome para concluir o cadastro.';
  }

  private authErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null && 'status' in error && error.status === 502) {
      return 'O servidor ainda está iniciando. Aguarde alguns segundos e tente novamente.';
    }

    return friendlyErrorMessage(error, fallback);
  }

  private toggleValue(values: string[], value: string): string[] {
    return values.includes(value)
      ? values.filter(item => item !== value)
      : [...values, value];
  }
}
