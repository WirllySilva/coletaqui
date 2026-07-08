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
  selectedFilter: 'ALL' | CollectorServiceType = 'ALL';
  isLoading = true;
  error = '';

  serviceFilters: Array<{ label: string; value: 'ALL' | CollectorServiceType }> = [
    { label: 'Todos', value: 'ALL' },
    { label: 'Coleta domiciliar', value: 'HOME_COLLECTION' },
    { label: 'Recebimento no local', value: 'DROP_OFF_POINT' },
    { label: 'Coleta + recebimento', value: 'HOME_COLLECTION_AND_DROP_OFF' },
  ];

  constructor(
    private readonly userService: UserService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadCollectors();
  }

  get filteredCollectors(): Collector[] {
    if (this.selectedFilter === 'ALL') {
      return this.collectors;
    }

    return this.collectors.filter(collector => collector.collectorServiceType === this.selectedFilter);
  }

  canSchedule(collector: Collector): boolean {
    return collector.collectorServiceType === 'HOME_COLLECTION' || collector.collectorServiceType === 'HOME_COLLECTION_AND_DROP_OFF';
  }

  canDropOff(collector: Collector): boolean {
    return collector.collectorServiceType === 'DROP_OFF_POINT' || collector.collectorServiceType === 'HOME_COLLECTION_AND_DROP_OFF';
  }

  serviceTypeLabel(type: CollectorServiceType): string {
    const labels: Record<CollectorServiceType, string> = {
      HOME_COLLECTION: 'Coleta domiciliar',
      DROP_OFF_POINT: 'Ponto de recebimento',
      HOME_COLLECTION_AND_DROP_OFF: 'Coleta + recebimento',
    };

    return labels[type] ?? 'Coleta domiciliar';
  }

  serviceTypeIcon(type: CollectorServiceType): string {
    const icons: Record<CollectorServiceType, string> = {
      HOME_COLLECTION: 'bi-house-check-fill',
      DROP_OFF_POINT: 'bi-shop',
      HOME_COLLECTION_AND_DROP_OFF: 'bi-truck-front-fill',
    };

    return icons[type] ?? 'bi-truck';
  }

  serviceTypeDescription(collector: Collector): string {
    if (collector.collectorServiceType === 'HOME_COLLECTION') {
      return 'Atende somente por coleta domiciliar. O endereço do coletor não é exibido.';
    }

    if (collector.collectorServiceType === 'DROP_OFF_POINT') {
      return 'Recebe materiais no local informado. Não realiza busca em domicílio.';
    }

    return 'Realiza coleta domiciliar e também recebe materiais no estabelecimento.';
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

  routeLink(collector: Collector): string {
    return `https://www.google.com/maps/search/?api=1&query=${collector.address ?? ''}`;
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
