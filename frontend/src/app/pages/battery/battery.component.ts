import { Component } from '@angular/core';
import { GuideData } from '../../models/guide.model';
import { GuidePageComponent } from '../guide/guide-page.component';

@Component({
  selector: 'app-battery-page',
  imports: [GuidePageComponent],
  templateUrl: './battery.component.html',
  styleUrl: './battery.component.css',
})
export class BatteryPageComponent {
  data: GuideData = {
  theme: 'orange',
  title: 'Coleta de Baterias e Pilhas: Guia Completo de Descarte',
  subtitle: '',
  intro: 'Baterias e pilhas contêm substâncias tóxicas e metais pesados que podem contaminar o meio ambiente quando descartados incorretamente. Veja como fazer o descarte adequado desses materiais:',
  colorLabel: 'LARANJA (em alguns sistemas)',
  colorText: 'Baterias e pilhas exigem coleta específica, não devendo ser misturadas com outros materiais. Procure pelo símbolo de "proibido descarte no lixo comum" nas embalagens.',
  listTitle: 'Tipos de baterias e pilhas',
  sections: [
    {
      title: 'Pilhas comuns:',
      items: ['Pilhas alcalinas (AA, AAA, C, D)', 'Pilhas de zinco-carbono', 'Pilhas recarregáveis de NiMH e NiCd', 'Pilhas botão (relógios, calculadoras)'],
    },
    {
      title: 'Baterias:',
      items: ['Baterias de celulares e smartphones', 'Baterias de notebooks e tablets', 'Baterias de câmeras digitais', 'Baterias de carros, motos e outros veículos', 'Baterias de no-breaks e sistemas de energia'],
    },
  ],
  stepsTitle: 'Como preparar pilhas e baterias para o descarte',
  steps: [
    { title: 'Isolamento', text: 'Coloque fita isolante nos terminais das baterias de lítio para evitar curto-circuito.' },
    { title: 'Armazenamento temporário', text: 'Guarde em recipientes secos, preferencialmente plásticos. Não misture com outros tipos de resíduos.' },
    { title: 'Integridade física', text: 'Nunca perfure, quebre ou desmonte pilhas e baterias. Evite contato com água ou umidade excessiva.' },
  ],
  cycleTitle: 'Processo de reciclagem de pilhas e baterias',
  cycleText: 'O processo de reciclagem envolve coleta, triagem, processamento mecânico, térmico e químico, neutralização e recuperação de materiais. Cada etapa é crucial para garantir a segurança e eficiência do processo.',
  benefitsTitle: 'Benefícios do descarte correto',
  benefits: [
    { icon: 'bi-tree', title: 'Ambientais', text: "Evita a contaminação do solo, lençóis freáticos e cursos d'água. Previne bioacumulação de metais pesados." },
    { icon: 'bi-cash', title: 'Econômicos', text: 'Recuperação de metais valiosos e desenvolvimento da indústria de reciclagem especializada.' },
  ],
  footerText: 'O descarte correto de pilhas e baterias é uma responsabilidade compartilhada entre consumidores, comerciantes e fabricantes.',
};
}
