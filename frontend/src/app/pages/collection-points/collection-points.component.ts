import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { CollectionPoint, UserService } from '../../services/user.service';

type LeafletModule = typeof import('leaflet');

@Component({
  selector: 'app-collection-points',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './collection-points.component.html',
  styleUrl: './collection-points.component.css',
})
export class CollectionPointsComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly aracoiabaCenter: [number, number] = [-7.7902, -35.0906];
  private readonly aracoiabaBounds: [[number, number], [number, number]] = [[-7.835, -35.14], [-7.745, -35.045]];
  private leaflet: LeafletModule | null = null;
  private map: import('leaflet').Map | null = null;
  private markersLayer: import('leaflet').LayerGroup | null = null;
  private viewInitialized = false;

  points: CollectionPoint[] = [];
  selectedPoint: CollectionPoint | null = null;
  isLoading = true;
  error = '';

  get activePointCount(): number {
    return this.points.length;
  }

  get mappedPointCount(): number {
    return this.points.filter(point => this.hasCoordinates(point)).length;
  }

  constructor(
    private readonly userService: UserService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userService.listCollectionPoints().subscribe({
      next: points => {
        this.points = points;
        this.selectedPoint = null;
        this.isLoading = false;
        this.renderMarkers();
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível carregar os pontos de coleta.';
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
    });
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    void this.initMap();
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = null;
  }

  scrollToMap(): void {
    document.getElementById('collection-points-map-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => this.map?.invalidateSize(), 250);
  }

  materials(point: CollectionPoint): string[] {
    if (!point.materials) {
      return [];
    }

    return point.materials.split(',').map(material => material.trim()).filter(Boolean);
  }

  wazeLink(point: CollectionPoint): string {
    if (this.hasCoordinates(point)) {
      return `https://waze.com/ul?ll=${point.latitude},${point.longitude}&navigate=yes`;
    }

    return `https://waze.com/ul?q=${encodeURIComponent(`${point.address}, ${point.city} ${point.state}`)}&navigate=yes`;
  }

  private async initMap(): Promise<void> {
    if (!this.viewInitialized || this.map) {
      return;
    }

    const leafletModule = await import('leaflet');
    this.leaflet = (leafletModule.default ?? leafletModule) as LeafletModule;
    const L = this.leaflet;
    const bounds = L.latLngBounds(this.aracoiabaBounds);

    this.map = L.map('collection-points-map', {
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

    const markersLayer = this.markersLayer;
    markersLayer.clearLayers();

    this.points.filter(point => this.hasCoordinates(point)).forEach(point => {
      L.marker([point.latitude as number, point.longitude as number], { icon: this.materialIcon(point) })
        .on('click', () => this.selectPoint(point))
        .addTo(markersLayer);
    });
  }

  private selectPoint(point: CollectionPoint): void {
    this.selectedPoint = point;
    this.changeDetector.detectChanges();
    setTimeout(() => {
      document.getElementById('selected-collection-point')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }

  private materialIcon(point: CollectionPoint): import('leaflet').DivIcon {
    const L = this.leaflet as LeafletModule;
    const material = this.mainMaterial(point);
    const icons: Record<string, string> = {
      bateria: 'bi-battery-half',
      baterias: 'bi-battery-half',
      pilha: 'bi-battery-half',
      pilhas: 'bi-battery-half',
      papel: 'bi-newspaper',
      plastico: 'bi-cup-straw',
      plástico: 'bi-cup-straw',
      vidro: 'bi-cup',
      oleo: 'bi-droplet-fill',
      óleo: 'bi-droplet-fill',
      metal: 'bi-nut-fill',
      organico: 'bi-flower1',
      orgânico: 'bi-flower1',
    };

    return L.divIcon({
      className: `coletaqui-map-marker marker-${material}`,
      html: `<i class="bi ${icons[material] ?? 'bi-recycle'}"></i>`,
      iconAnchor: [20, 20],
      iconSize: [40, 40],
      popupAnchor: [0, -20],
    });
  }

  private popupHtml(point: CollectionPoint): string {
    const materials = this.materials(point).join(', ') || 'Materiais não informados';
    return `
      <strong>${this.escape(point.name)}</strong>
      <span>${this.escape(point.address)}, ${this.escape(point.city)}/${this.escape(point.state)}</span>
      <small>${this.escape(materials)}</small>
      <a href="${this.wazeLink(point)}" target="_blank" rel="noopener">Navegar com Waze</a>
    `;
  }

  private mainMaterial(point: CollectionPoint): string {
    return (this.materials(point)[0] ?? 'reciclagem')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(' ')[0];
  }

  private hasCoordinates(point: CollectionPoint): boolean {
    return typeof point.latitude === 'number'
      && typeof point.longitude === 'number'
      && point.latitude >= this.aracoiabaBounds[0][0]
      && point.latitude <= this.aracoiabaBounds[1][0]
      && point.longitude >= this.aracoiabaBounds[0][1]
      && point.longitude <= this.aracoiabaBounds[1][1];
  }

  private escape(value: string): string {
    return value.replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    })[char] ?? char);
  }
}
