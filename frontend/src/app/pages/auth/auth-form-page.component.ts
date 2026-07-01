import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-form-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './auth-form-page.component.html',
  styleUrl: './auth-form-page.component.css',
})
export class AuthFormPageComponent {
  @Input() title = 'Entrar';
  @Input() subtitle = 'Acesse sua conta Coletaqui.';
  @Input() button = 'Continuar';
  @Input() mode: 'login' | 'register' | 'recover' = 'login';
}
