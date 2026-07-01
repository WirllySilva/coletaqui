import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-how-to-separate-page',
  imports: [CommonModule, RouterModule, FooterComponent],
  templateUrl: './how-to-separate.component.html',
  styleUrl: './how-to-separate.component.css',
})
export class HowToSeparatePageComponent {
  materials = [
    { route: '/infobanner', image: 'assets/info-banner-button.png', alt: 'O que você precisa saber sobre coleta seletiva' },
    { route: '/paper', image: 'assets/paper-button.png', alt: 'Papel' },
    { route: '/glass', image: 'assets/glass-button.png', alt: 'Vidro' },
    { route: '/plastic', image: 'assets/plastic-button.png', alt: 'Plástico' },
    { route: '/organic', image: 'assets/organic-button.png', alt: 'Orgânico' },
    { route: '/metal', image: 'assets/metal-button.png', alt: 'Metal' },
    { route: '/battery', image: 'assets/battery-button.png', alt: 'Baterias e Pilhas' },
  ];
}
