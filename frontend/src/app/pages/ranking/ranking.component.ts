import { Component } from '@angular/core';
import { InfoPageComponent } from '../info-page.component';

@Component({
  selector: 'app-ranking-page',
  imports: [InfoPageComponent],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.css',
})
export class RankingPageComponent {
  items = ['Pontuao por descarte.', 'Histrico mensal.', 'Classificao da comunidade.'];
}
