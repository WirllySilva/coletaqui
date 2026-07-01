import { Component } from '@angular/core';
import { AuthFormPageComponent } from '../auth/auth-form-page.component';

@Component({
  selector: 'app-collector-login-page',
  imports: [AuthFormPageComponent],
  templateUrl: './collector-login.component.html',
  styleUrl: './collector-login.component.css',
})
export class CollectorLoginPageComponent {
}
