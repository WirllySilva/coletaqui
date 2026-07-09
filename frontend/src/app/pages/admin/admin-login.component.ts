import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent {
  email = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  submit(): void {
    this.error = '';

    if (!this.email.trim() || !this.password) {
      this.error = 'Informe e-mail e senha para acessar o painel.';
      return;
    }

    this.isLoading = true;
    this.authService.adminLogin({
      email: this.email.trim(),
      password: this.password,
    }).pipe(
      finalize(() => this.isLoading = false),
    ).subscribe({
      next: response => {
        localStorage.setItem('coletaqui_token', response.token);
        localStorage.setItem('coletaqui_user', JSON.stringify(response));
        void this.router.navigateByUrl('/admin/dashboard');
      },
      error: () => {
        this.error = 'E-mail ou senha inválidos.';
      },
    });
  }
}
