import { Component } from '@angular/core';
import { InfoPageComponent } from '../info-page.component';

@Component({
  selector: 'app-user-data-page',
  imports: [InfoPageComponent],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.css',
})
export class UserDataPageComponent {
  items = ['Nome e contato.', 'Tipo de conta.', 'Preferncias do app.'];
}
