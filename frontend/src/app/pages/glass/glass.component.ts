import { Component } from '@angular/core';
import { GuideData } from '../../models/guide.model';
import { GuidePageComponent } from '../guide/guide-page.component';

@Component({
  selector: 'app-glass-page',
  imports: [GuidePageComponent],
  templateUrl: './glass.component.html',
  styleUrl: './glass.component.css',
})
export class GlassPageComponent {
  data: GuideData = {
  theme: '#097756',
  title: 'Coleta de Vidro: Guia Completo de Reciclagem',
  subtitle: '',
  intro: 'A reciclagem de vidro é um processo eficiente que permite reutilizar o material infinitas vezes sem perda de qualidade. Conheça todos os detalhes para fazer a coleta seletiva de vidro corretamente:',
  colorLabel: 'VERDE',
  colorText: 'Todos os tipos de vidro devem ser descartados em lixeiras verdes. O símbolo internacional de reciclagem com o número 70 a 79 identifica materiais de vidro.',
  listTitle: 'O que pode ser reciclado',
  sections: [
    {
      title: 'Vidros recicláveis:',
      items: [
        'Garrafas de bebidas (refrigerante, cerveja, vinho)',
        'Frascos de conservas e molhos',
        'Potes de alimentos (geleia, requeijão)',
        'Frascos de perfumes e cosméticos',
        'Vidros de remédios (sem medicamentos)',
        'Cacos de vidro comum',
      ],
    },
    {
      title: 'Vidros não recicláveis:',
      items: [
        'Espelhos e vidros planos (janelas)',
        'Cristais e porcelanas',
        'Lâmpadas (precisam de coleta específica)',
        'Tubos de TV e monitores',
        'Pirex e vidros temperados',
        'Vidros de automóveis',
        'Ampolas de medicamentos',
        'Cerâmicas, louças e porcelanas',
      ],
    },
  ],
  stepsTitle: 'Como preparar o vidro para reciclagem',
  steps: [
    { title: 'Limpeza básica', text: 'Enxágue para remover resíduos de alimentos. Retire rótulos quando possível.' },
    { title: 'Cuidados essenciais', text: 'Remova tampas e rolhas (metal e plástico). Embale cacos em papel jornal para evitar acidentes.' },
    { title: 'Armazenamento seguro', text: 'Guarde em recipientes resistentes. Evite misturar com outros materiais.' },
  ],
  cycleTitle: 'Ciclo de reciclagem do vidro',
  cycleText: 'O ciclo de reciclagem do vidro envolve coleta, triagem, trituração, limpeza, fusão, modelagem e resfriamento controlado. Cada etapa é crucial para transformar o vidro usado em novos produtos.',
  benefitsTitle: 'Benefícios da reciclagem de vidro',
  benefits: [
    { icon: 'bi-tree', title: 'Ambientais', text: 'O vidro pode ser reciclado infinitas vezes sem perder qualidade. Economiza recursos naturais e reduz a poluição.' },
    { icon: 'bi-cash', title: 'Econômicos', text: 'Gera empregos na cadeia de reciclagem e reduz custos de produção industrial.' },
  ],
  footerText: 'A reciclagem de vidro representa um ciclo perfeito de sustentabilidade, pois permite que o material seja reaproveitado infinitamente com o mesmo padrão de qualidade.',
};
}
