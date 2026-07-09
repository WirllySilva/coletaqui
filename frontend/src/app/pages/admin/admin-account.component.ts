import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { UserProfile } from '../../services/user.service';

@Component({
  selector: 'app-admin-account',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-account.component.html',
  styleUrl: './admin-pages.css',
})
export class AdminAccountComponent implements OnInit {
  admin: UserProfile | null = null;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  error = '';
  isSaving = false;

  constructor(
    private readonly adminService: AdminService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.adminService.me().subscribe({
      next: admin => {
        this.admin = admin;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível carregar sua conta.';
        this.changeDetector.detectChanges();
      },
    });
  }

  changePassword(): void {
    this.message = '';
    this.error = '';

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.error = 'Preencha todos os campos de senha.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'A confirmação da nova senha não confere.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.error = 'A nova senha deve ter pelo menos 6 caracteres.';
      return;
    }

    this.isSaving = true;
    this.adminService.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    }).subscribe({
      next: () => {
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.message = 'Senha alterada com sucesso.';
        this.isSaving = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível alterar a senha. Verifique a senha atual.';
        this.isSaving = false;
        this.changeDetector.detectChanges();
      },
    });
  }
}
