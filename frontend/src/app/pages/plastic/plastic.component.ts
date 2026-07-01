import { Component } from '@angular/core';
import { GuideData } from '../../models/guide.model';
import { GuidePageComponent } from '../guide/guide-page.component';

@Component({
  selector: 'app-plastic-page',
  imports: [GuidePageComponent],
  templateUrl: './plastic.component.html',
  styleUrl: './plastic.component.css',
})
export class PlasticPageComponent {
  data: GuideData = {
  theme: '#e63946',
  title: 'Coleta de Plástico: Guia Completo de Reciclagem',
  subtitle: '',
  intro: 'O plástico é um dos materiais mais abundantes em nosso cotidiano e sua reciclagem adequada é essencial para reduzir o impacto ambiental. Confira como fazer a coleta seletiva de plásticos corretamente:',
  colorLabel: 'VERMELHO',
  colorText: 'Todos os tipos de plástico devem ser descartados em lixeiras vermelhas. Os plásticos são identificados pelos símbolos de 1 a 7 dentro do triângulo de reciclagem.',
  listTitle: 'Tipos de plásticos recicláveis',
  sections: [
    {
      title: '1 - PET (Polietileno Tereftalato):',
      items: ['Garrafas de refrigerante, água e óleo', 'Embalagens de produtos de limpeza', 'Bandejas de microondas'],
    },
    {
      title: '2 - PEAD (Polietileno de Alta Densidade):',
      items: ['Frascos de shampoo e cosméticos', 'Garrafas de leite e sucos', 'Embalagens de produtos de limpeza'],
    },
  ],
  stepsTitle: 'Como preparar o plástico para reciclagem',
  steps: [
    { title: 'Limpeza básica', text: 'Enxágue para remover resíduos de alimentos. Retire rótulos de papel quando possível.' },
    { title: 'Compactação', text: 'Amasse garrafas e frascos para reduzir volume. Empilhe potes do mesmo tipo quando possível.' },
    { title: 'Separação por tipo (se possível)', text: 'Agrupamento conforme numeração facilita o processo de reciclagem.' },
  ],
  cycleTitle: 'Ciclo de reciclagem do plástico',
  cycleText: 'O ciclo de reciclagem do plástico envolve coleta, triagem, lavagem, trituração, aglutinação, extrusão e fabricação. Cada etapa é crucial para transformar o plástico usado em novos produtos.',
  benefitsTitle: 'Benefícios da reciclagem de plástico',
  benefits: [
    { icon: 'bi-tree', title: 'Ambientais', text: 'Reduz o volume de resíduos em aterros e oceanos. Economiza energia e diminui a extração de recursos não renováveis.' },
    { icon: 'bi-cash', title: 'Econômicos', text: 'Gera empregos na cadeia de reciclagem e reduz custos de produção industrial.' },
  ],
  footerText: 'A separação correta dos plásticos para reciclagem é um passo fundamental para combater a poluição causada por este material tão presente em nosso dia a dia.',
};
}
