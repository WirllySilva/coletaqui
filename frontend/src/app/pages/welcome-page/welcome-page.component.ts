import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_VERSION } from '../../app-version';

@Component({
  selector: 'app-welcome-page',
  imports: [RouterModule],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.css',
})
export class WelcomePageComponent {
  readonly version = APP_VERSION;
}
