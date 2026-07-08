import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { TreePlanting, TreePlantingService, TreePlantingStatus } from '../../services/tree-planting.service';

type LeafletModule = typeof import('leaflet');

@Component({
  selector: 'app-plant-a-tree-page',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './plant-a-tree.component.html',
  styleUrl: './plant-a-tree.component.css',
})
export class PlantATreePageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly aracoiabaCenter: [number, number] = [-7.7902, -35.0906];
  private readonly aracoiabaBounds: [[number, number], [number, number]] = [[-7.835, -35.14], [-7.745, -35.045]];
  private leaflet: LeafletModule | null = null;
  private map: import('leaflet').Map | null = null;
  private markersLayer: import('leaflet').LayerGroup | null = null;
  private viewInitialized = false;

  myTrees: TreePlanting[] = [];
  communityTrees: TreePlanting[] = [];
  selectedTree: TreePlanting | null = null;
  isLoading = true;
  error = '';

  tips = [
    'Consulte a Secretaria de Agricultura e Meio Ambiente sobre disponibilidade de mudas e orientação local.',
    'Escolha locais amplos, longe de fiação elétrica, muros, calçadas estreitas e encanamentos.',
    'Prepare uma cova de pelo menos 40 cm x 40 cm x 40 cm e misture a terra com adubo orgânico.',
    'Regue bem no plantio e mantenha a muda úmida nos primeiros meses.',
  ];

  constructor(
    private readonly treePlantingService: TreePlantingService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    void this.initMap();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  statusLabel(status: TreePlantingStatus): string {
    const labels: Record<TreePlantingStatus, string> = {
      REGISTERED: 'Registrada',
      VALIDATED: 'Validada',
      REJECTED: 'Rejeitada',
    };
    return labels[status];
  }

  treeAge(tree: TreePlanting): string {
    const planted = new Date(`${tree.plantedDate}T00:00:00`);
    const today = new Date();
    const months = Math.max(0, (today.getFullYear() - planted.getFullYear()) * 12 + today.getMonth() - planted.getMonth());
    if (months < 1) {
      return 'Plantada este mês';
    }
    if (months < 12) {
      return `${months} mês${months === 1 ? '' : 'es'}`;
    }
    const years = Math.floor(months / 12);
    return `${years} ano${years === 1 ? '' : 's'}`;
  }

  private load(): void {
    this.treePlantingService.mine().subscribe({
      next: trees => {
        this.myTrees = trees;
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
    });

    this.treePlantingService.community().subscribe({
      next: trees => {
        this.communityTrees = trees;
        this.renderMarkers();
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível carregar o mapa de árvores.';
        this.changeDetector.detectChanges();
      },
    });
  }

  private async initMap(): Promise<void> {
    if (!this.viewInitialized || this.map) {
      return;
    }

    const leafletModule = await import('leaflet');
    this.leaflet = (leafletModule.default ?? leafletModule) as LeafletModule;
    const L = this.leaflet;
    const bounds = L.latLngBounds(this.aracoiabaBounds);

    this.map = L.map('tree-map', {
      center: this.aracoiabaCenter,
      maxBounds: bounds,
      maxBoundsViscosity: 1,
      minZoom: 13,
      maxZoom: 17,
      zoom: 14,
      zoomControl: false,
      worldCopyJump: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      bounds,
      maxZoom: 17,
      minZoom: 13,
      noWrap: true,
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);
    this.renderMarkers();
    setTimeout(() => this.map?.invalidateSize(), 150);
  }

  private renderMarkers(): void {
    const L = this.leaflet;
    if (!L || !this.map || !this.markersLayer) {
      return;
    }

    this.markersLayer.clearLayers();
    this.communityTrees.filter(tree => this.hasCoordinates(tree)).forEach(tree => {
      L.marker([tree.latitude as number, tree.longitude as number], { icon: this.treeIcon() })
        .on('click', () => this.selectTree(tree))
        .addTo(this.markersLayer as import('leaflet').LayerGroup);
    });
  }

  private selectTree(tree: TreePlanting): void {
    this.selectedTree = tree;
    this.changeDetector.detectChanges();
    setTimeout(() => {
      document.getElementById('selected-tree')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }

  private treeIcon(): import('leaflet').DivIcon {
    const L = this.leaflet as LeafletModule;
    return L.divIcon({
      className: 'coletaqui-tree-marker',
      html: '<i class="bi bi-tree-fill"></i>',
      iconAnchor: [20, 20],
      iconSize: [40, 40],
    });
  }

  private hasCoordinates(tree: TreePlanting): boolean {
    return typeof tree.latitude === 'number'
      && typeof tree.longitude === 'number'
      && tree.latitude >= this.aracoiabaBounds[0][0]
      && tree.latitude <= this.aracoiabaBounds[1][0]
      && tree.longitude >= this.aracoiabaBounds[0][1]
      && tree.longitude <= this.aracoiabaBounds[1][1];
  }
}
