import { Component } from '@angular/core';
import { AuthFormPageComponent } from '../auth/auth-form-page.component';

@Component({
  selector: 'app-common-user-register-page',
  imports: [AuthFormPageComponent],
  templateUrl: './common-user-register.component.html',
  styleUrl: './common-user-register.component.css',
})
export class CommonUserRegisterPageComponent {
}
