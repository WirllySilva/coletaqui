import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Collector, CollectorServiceType, UserService } from '../../services/user.service';

@Component({
  selector: 'app-collectors-page',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './collectors.component.html',
  styleUrl: './collectors.component.css',
})
export class CollectorsPageComponent implements OnInit {
  collectors: Collector[] = [];
  isLoading = true;
  error = '';

  constructor(
    private readonly userService: UserService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadCollectors();
  }

  serviceTypeLabel(type: CollectorServiceType): string {
    const labels: Record<CollectorServiceType, string> = {
      HOME_COLLECTION: 'Coleta domiciliar',
      DROP_OFF_POINT: 'Ponto de recebimento',
      HOME_COLLECTION_AND_DROP_OFF: 'Coleta + recebimento',
    };

    return labels[type] ?? 'Coleta domiciliar';
  }

  materialList(collector: Collector): string[] {
    return this.splitList(collector.materials);
  }

  availabilityList(collector: Collector): string[] {
    return this.splitList(collector.availability);
  }

  whatsappLink(collector: Collector): string {
    return `https://wa.me/55${collector.phone}`;
  }

  private loadCollectors(): void {
    this.isLoading = true;
    this.error = '';

    this.userService.listCollectors().pipe(
      finalize(() => {
        this.isLoading = false;
        this.changeDetector.detectChanges();
      }),
    ).subscribe({
      next: collectors => {
        this.collectors = collectors;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Nao foi possivel carregar os coletores de Aracoiaba/PE.';
        this.changeDetector.detectChanges();
      },
    });
  }

  private splitList(value?: string | null): string[] {
    return value?.split(',').map(item => item.trim()).filter(Boolean) ?? [];
  }
}
