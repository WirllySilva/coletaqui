import { Component } from '@angular/core';
import { GuideData } from '../../models/guide.model';
import { GuidePageComponent } from '../guide/guide-page.component';

@Component({
  selector: 'app-metal-page',
  imports: [GuidePageComponent],
  templateUrl: './metal.component.html',
  styleUrl: './metal.component.css',
})
export class MetalPageComponent {
  data: GuideData = {
  theme: '#ffd723',
  title: 'Coleta de Metal: Guia Completo de Reciclagem',
  subtitle: '',
  intro: 'A reciclagem de metais é um dos processos mais eficientes e economicamente viáveis dentro da cadeia de reciclagem. Confira como fazer a coleta seletiva de metais corretamente:',
  colorLabel: 'AMARELO',
  colorText: 'Todos os tipos de metal devem ser descartados em lixeiras amarelas. Os metais geralmente são identificados pelos símbolos 40 a 49 dentro do triângulo de reciclagem.',
  listTitle: 'Tipos de metais recicláveis',
  sections: [
    {
      title: 'Metais ferrosos:',
      items: ['Latas de alimentos em conserva', 'Tampas metálicas de garrafas', 'Panelas e utensílios de cozinha de ferro', 'Clipes, grampos e pregos', 'Ferramentas de ferro', 'Aço em geral'],
    },
    {
      title: 'Metais não-ferrosos:',
      items: ['Latas de alumínio (refrigerantes e cervejas)', 'Papel alumínio limpo', 'Embalagens metalizadas de alimentos', 'Fios e cabos de cobre', 'Peças de bronze e latão', 'Esquadrias de alumínio'],
    },
  ],
  stepsTitle: 'Como preparar o metal para reciclagem',
  steps: [
    { title: 'Limpeza básica', text: 'Enxágue para remover resíduos de alimentos. Retire rótulos de papel quando possível.' },
    { title: 'Compactação', text: 'Amasse latas para reduzir volume. Separe tampas metálicas dos recipientes de vidro.' },
    { title: 'Separação magnética (opcional)', text: 'Use um ímã para separar metais ferrosos (que grudam) dos não-ferrosos (que não grudam).' },
  ],
  cycleTitle: 'Ciclo de reciclagem do metal',
  cycleText: 'O ciclo de reciclagem do metal envolve coleta, triagem, limpeza, trituração, fusão, solidificação e fabricação. Cada etapa é crucial para transformar o metal usado em novos produtos.',
  benefitsTitle: 'Benefícios da reciclagem de metal',
  benefits: [
    { icon: 'bi-tree', title: 'Ambientais', text: 'Reduz a extração de minérios e economiza energia. Diminui a emissão de gases do efeito estufa.' },
    { icon: 'bi-cash', title: 'Econômicos', text: 'Alto valor no mercado de reciclagem. Gera renda para catadores e cooperativas.' },
  ],
  footerText: 'A reciclagem de metais é um exemplo de sucesso na economia circular, combinando benefícios ambientais com vantagens econômicas significativas.',
};
}
