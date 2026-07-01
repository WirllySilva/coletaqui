import { Component } from '@angular/core';
import { AuthFormPageComponent } from '../auth/auth-form-page.component';

@Component({
  selector: 'app-common-user-login-page',
  imports: [AuthFormPageComponent],
  templateUrl: './common-user-login.component.html',
  styleUrl: './common-user-login.component.css',
})
export class CommonUserLoginPageComponent {
}
