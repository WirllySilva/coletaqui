import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthResponse, AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-form-page',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './auth-form-page.component.html',
  styleUrl: './auth-form-page.component.css',
})
export class AuthFormPageComponent {
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
  error = '';
  isLoading = false;
  devOtp = '';
  private authToken = '';

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  get profileLabel(): string {
    return this.profile === 'collector' ? 'catador/coletor' : 'usuário comum';
  }

  get formattedPhone(): string {
    return this.phone || 'telefone informado';
  }

  get canContinue(): boolean {
    if (this.step === 'phone') {
      return this.onlyNumbers(this.phone).length >= 10;
    }

    if (this.step === 'otp') {
      return this.onlyNumbers(this.otp).length === 6;
    }

    if (this.profile === 'collector') {
      return Boolean(this.name.trim() && this.region.trim() && this.materials.trim() && this.availability.trim());
    }

    return Boolean(this.name.trim());
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
    this.isLoading = true;
    this.devOtp = '';

    this.authService.requestOtp(this.profile, this.onlyNumbers(this.phone)).pipe(
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
        this.error = this.authErrorMessage(error, 'Não foi possível enviar o código pelo WhatsApp. Tente novamente.');
        this.changeDetector.detectChanges();
      },
    });
  }

  private verifyOtp(): void {
    this.isLoading = true;

    this.authService.verifyOtp(this.profile, this.onlyNumbers(this.phone), this.onlyNumbers(this.otp)).pipe(
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
        this.error = this.authErrorMessage(error, 'Código inválido ou expirado. Solicite um novo OTP se necessário.');
        this.changeDetector.detectChanges();
      },
    });
  }

  private completeProfile(): void {
    this.isLoading = true;

    this.authService.completeProfile(this.authToken, {
      name: this.name.trim(),
      region: this.region.trim() || undefined,
      materials: this.materials.trim() || undefined,
      availability: this.availability.trim() || undefined,
    }).pipe(
      finalize(() => {
        this.isLoading = false;
        this.changeDetector.detectChanges();
      }),
    ).subscribe({
      next: response => this.navigateAfterLogin(response),
      error: error => {
        this.error = this.authErrorMessage(error, 'Não foi possível concluir o cadastro. Tente novamente.');
        this.changeDetector.detectChanges();
      },
    });
  }

  private navigateAfterLogin(response: AuthResponse): void {
    localStorage.setItem('coletaqui_user', JSON.stringify(response));
    void this.router.navigateByUrl(this.profile === 'collector' ? '/collectors' : '/home');
  }

  private onlyNumbers(value: string): string {
    return value.replace(/\D/g, '');
  }

  private validationMessage(): string {
    if (this.step === 'phone') {
      return 'Informe um telefone válido com DDD.';
    }

    if (this.step === 'otp') {
      return 'Informe o código OTP com 6 dígitos.';
    }

    if (this.profile === 'collector') {
      return 'Preencha nome, região, materiais coletados e disponibilidade.';
    }

    return 'Informe seu nome para concluir o cadastro.';
  }

  private authErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null && 'status' in error && error.status === 502) {
      return 'A API ainda não está pronta. Aguarde alguns segundos e tente novamente.';
    }

    return fallback;
  }
}
