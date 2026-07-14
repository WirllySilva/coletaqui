import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MapPreviewComponent } from '../../components/map-preview/map-preview.component';
import { RecyclingTipsComponent } from '../../components/recycling-tips/recycling-tips.component';
import { Tip } from '../../models/tip.model';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, MapPreviewComponent, RecyclingTipsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  actions = [
    { label: 'Como separar', route: '/howtoseparate', icon: 'bi-recycle' },
    { label: 'Coletores', route: '/collectors', icon: 'bi-people-fill' },
    { label: 'Plante uma árvore', route: '/plantatree', icon: 'bi-tree-fill' },
    { label: 'Ranking', route: '/ranking', icon: 'bi-trophy-fill' },
  ];

  tips: Tip[] = [];
  highlights = [
    { value: 'Araçoiaba', label: 'Atuação local', icon: 'bi-geo-alt-fill' },
    { value: '4+', label: 'Tipos de materiais', icon: 'bi-box-seam-fill' },
    { value: 'Agenda', label: 'Coleta domiciliar', icon: 'bi-calendar-check-fill' },
  ];

  constructor(
    private readonly contentService: ContentService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.contentService.active().subscribe({
      next: tips => {
        this.tips = tips;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.tips = [];
        this.changeDetector.detectChanges();
      },
    });
  }
}
