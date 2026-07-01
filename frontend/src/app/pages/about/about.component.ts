import { Component } from '@angular/core';
import { InfoPageComponent } from '../info-page.component';

@Component({
  selector: 'app-about-page',
  imports: [InfoPageComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutPageComponent {
  items = ['Frontend agora em Angular.', 'Backend Java Spring Boot preservado.', 'Banco de dados serdefinido na prxima etapa.'];
}
