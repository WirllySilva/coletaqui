import { Component } from '@angular/core';
import { InfoPageComponent } from '../info-page.component';

@Component({
  selector: 'app-ranking-page',
  imports: [InfoPageComponent],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.css',
})
export class RankingPageComponent {
  items = [
    'Pontuacao por participacao em coletas seletivas.',
    'Selos para moradores que mantem frequencia.',
    'Ranking comunitario para incentivar a cidade.',
  ];
}
