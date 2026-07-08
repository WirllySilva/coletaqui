import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { UserImpactItem, UserImpactService, UserImpactSummary } from '../../services/user-impact.service';

@Component({
  selector: 'app-user-impact',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './user-impact.component.html',
  styleUrl: './user-impact.component.css',
})
export class UserImpactComponent implements OnInit {
  impact: UserImpactSummary | null = null;
  isLoading = true;
  error = '';

  constructor(
    private readonly userImpactService: UserImpactService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userImpactService.mine().subscribe({
      next: impact => {
        this.impact = impact;
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível carregar seu impacto agora.';
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
    });
  }

  iconFor(item: UserImpactItem): string {
    if (item.type === 'Coleta domiciliar') {
      return 'bi-truck';
    }
    if (item.type === 'Entrega direta') {
      return 'bi-shop';
    }
    if (item.type === 'Árvore plantada') {
      return 'bi-tree-fill';
    }
    return 'bi-geo-alt-fill';
  }

  statusClass(item: UserImpactItem): string {
    return item.status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
