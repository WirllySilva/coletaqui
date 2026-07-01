import { Component } from '@angular/core';
import { InfoPageComponent } from '../info-page.component';

@Component({
  selector: 'app-plant-a-tree-page',
  imports: [InfoPageComponent],
  templateUrl: './plant-a-tree.component.html',
  styleUrl: './plant-a-tree.component.css',
})
export class PlantATreePageComponent {
  items = ['Campanhas ambientais.', 'Metas de impacto.', 'Recompensas futuras.'];
}
