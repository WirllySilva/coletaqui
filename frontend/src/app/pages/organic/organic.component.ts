import { Component } from '@angular/core';
import { GuideData } from '../../models/guide.model';
import { GuidePageComponent } from '../guide/guide-page.component';

@Component({
  selector: 'app-organic-page',
  imports: [GuidePageComponent],
  templateUrl: './organic.component.html',
  styleUrl: './organic.component.css',
})
export class OrganicPageComponent {
  data: GuideData = {
  theme: '#774936',
  title: 'Coleta de Resíduos Orgânicos: Guia Completo',
  subtitle: '',
  intro: 'Os resíduos orgânicos representam mais de 50% do lixo doméstico brasileiro e seu tratamento adequado é essencial para reduzir o impacto ambiental. Veja como fazer a coleta seletiva de resíduos orgânicos corretamente:',
  colorLabel: 'MARROM',
  colorText: 'Todos os resíduos orgânicos devem ser descartados em lixeiras marrons. Em algumas localidades, utiliza-se o símbolo de compostagem para identificar os coletores.',
  listTitle: 'O que é considerado resíduo orgânico',
  sections: [
    {
      title: 'Resíduos orgânicos compostáveis:',
      items: ['Restos de frutas, legumes e verduras', 'Cascas de ovos', 'Borra e filtro de café', 'Sachês de chá', 'Restos de alimentos cozidos sem molhos', 'Folhas secas e podas de jardim', 'Palitos de madeira', 'Guardanapos e papel-toalha sem produtos químicos', 'Serragem não tratada'],
    },
    {
      title: 'Resíduos orgânicos não recomendados:',
      items: ['Carnes, laticínios e derivados', 'Alimentos muito gordurosos', 'Fezes de animais domésticos', 'Plantas doentes', 'Madeira tratada com produtos químicos', 'Papel higiênico usado', 'Cinzas de churrasqueira'],
    },
  ],
  stepsTitle: 'Como separar resíduos orgânicos',
  steps: [
    { title: 'Recipiente adequado', text: 'Use recipientes com tampa para evitar odores e insetos. Prefira baldes ou composteiras específicas.' },
    { title: 'Preparação dos resíduos', text: 'Corte em pedaços menores para acelerar a decomposição. Escorra o excesso de líquidos antes de descartar.' },
    { title: 'Frequência de descarte', text: 'Não acumule por mais de 3-4 dias. Em climas quentes, faça o descarte diariamente.' },
  ],
  cycleTitle: 'Métodos de tratamento de resíduos orgânicos',
  cycleText: 'Os métodos de tratamento incluem compostagem doméstica, vermicompostagem e biodigestão. Cada método tem suas vantagens e é adequado para diferentes situações.',
  benefitsTitle: 'Benefícios do tratamento adequado',
  benefits: [
    { icon: 'bi-tree', title: 'Ambientais', text: 'Reduz o volume de resíduos enviados aos aterros e diminui a emissão de gases de efeito estufa.' },
    { icon: 'bi-cash', title: 'Econômicos', text: 'Produção de composto orgânico gratuito e redução de custos com coleta e tratamento de resíduos.' },
  ],
  footerText: 'Separar corretamente os resíduos orgânicos é uma das atitudes mais efetivas para reduzir nosso impacto ambiental.',
};
}
