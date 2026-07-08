import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { RankingEntry, ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-ranking-page',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.css',
})
export class RankingPageComponent implements OnInit {
  entries: RankingEntry[] = [];
  isLoading = true;
  error = '';

  rules = [
    'Coleta concluida: 10 pontos',
    'Oleo, pilhas e baterias: +8 pontos',
    'Vidro: +4 pontos',
    'Plastico e metal: +3 pontos',
    'Papel e organico: +2 pontos',
  ];

  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.scheduleService.getRanking().subscribe({
      next: entries => {
        this.entries = entries;
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Nao foi possivel carregar o ranking agora.';
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
    });
  }

  positionLabel(position: number): string {
    if (position === 1) {
      return '1o';
    }
    if (position === 2) {
      return '2o';
    }
    if (position === 3) {
      return '3o';
    }
    return `${position}o`;
  }
}
