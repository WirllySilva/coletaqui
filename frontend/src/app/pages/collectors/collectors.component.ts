import { Component } from '@angular/core';
import { InfoPageComponent } from '../info-page.component';

@Component({
  selector: 'app-collectors-page',
  imports: [InfoPageComponent],
  templateUrl: './collectors.component.html',
  styleUrl: './collectors.component.css',
})
export class CollectorsPageComponent {
  items = ['Mapa de coleta em preparao.', 'Perfis de catadores sero integrados ao backend.', 'Use filtros por material no prximo ciclo.'];
}
