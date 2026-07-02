import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MapPreviewComponent } from '../../components/map-preview/map-preview.component';
import { RecyclingTipsComponent } from '../../components/recycling-tips/recycling-tips.component';
import { Tip } from '../../models/tip.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, MapPreviewComponent, RecyclingTipsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  actions = [
    { label: 'Como separar', route: '/howtoseparate', icon: 'bi-recycle' },
    { label: 'Coletores', route: '/collectors', icon: 'bi-people-fill' },
    { label: 'Plante uma árvore', route: '/plantatree', icon: 'bi-tree-fill' },
    { label: 'Ranking', route: '/ranking', icon: 'bi-trophy-fill' },
  ];

  tips: Tip[] = [
    { id: 1, title: 'Como separar materiais recicláveis', summary: 'Aprenda a separar corretamente os materiais recicláveis.', link: '/howtoseparate' },
    { id: 2, title: 'Dicas para lavar recipientes', summary: 'Saiba como lavar recipientes antes de reciclar.', link: '/plastic' },
    { id: 3, title: 'Tipos de plásticos', summary: 'Evite misturar diferentes tipos de plásticos.', link: '/plastic' },
    { id: 4, title: 'Doação de objetos reutilizáveis', summary: 'Doe objetos em vez de descartá-los.', link: '/infobanner' },
  ];
}
