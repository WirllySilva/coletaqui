import { Component } from '@angular/core';
import { GuideData } from '../../models/guide.model';
import { GuidePageComponent } from '../guide/guide-page.component';

@Component({
  selector: 'app-paper-page',
  imports: [GuidePageComponent],
  templateUrl: './paper.component.html',
  styleUrl: './paper.component.css',
})
export class PaperPageComponent {
  data: GuideData = {
  theme: '#1eaaf5',
  title: 'Coleta de Papel: Guia Completo de Reciclagem',
  subtitle: '',
  intro: 'A coleta de papel é uma parte fundamental da reciclagem, economizando recursos naturais e reduzindo significativamente o impacto ambiental. Veja tudo o que você precisa saber sobre como reciclar papel corretamente:',
  colorLabel: 'AZUL',
  colorText: 'Todos os tipos de papel e papelão devem ser descartados em lixeiras azuis. O símbolo internacional de reciclagem com o número 21 ou 22 identifica materiais de papel.',
  listTitle: 'O que pode ser reciclado',
  sections: [
    {
      title: 'Papéis recicláveis:',
      items: [
        'Jornais e revistas',
        'Folhas de caderno e sulfite',
        'Envelopes (sem janelas plásticas)',
        'Caixas de papelão',
        'Embalagens longa vida (Tetra Pak)',
        'Papel de embrulho',
        'Cartões e cartolinas',
        'Papel cartão',
        'Formulários de computador',
        'Aparas de papel',
        'Folhetos publicitários',
      ],
    },
    {
      title: 'Papéis não recicláveis:',
      items: [
        'Papel higiênico, guardanapos e lenços usados',
        'Papéis plastificados, metalizados ou parafinados',
        'Papéis sujos, engordurados ou contaminados',
        'Adesivos e etiquetas',
        'Fotografias',
        'Papel carbono',
        'Papel térmico (de recibos)',
        'Papel de fax',
        'Papel vegetal',
      ],
    },
  ],
  stepsTitle: 'Como preparar o papel para reciclagem',
  steps: [
    { title: 'Remova elementos não recicláveis', text: 'Retire grampos, clipes, fitas adesivas e espirais. Separe as janelas plásticas de envelopes.' },
    { title: 'Dobre ou amasse', text: 'Desmonte caixas de papelão para ocuparem menos espaço. Amasse papéis para otimizar o armazenamento.' },
    { title: 'Mantenha limpo e seco', text: 'Evite misturar com resíduos líquidos ou orgânicos. Armazene em local protegido de chuva.' },
    { title: 'Separe por tipo (opcional)', text: 'Agrupar papéis similares facilita o processo nas cooperativas. Papelão, papel branco e jornais podem ser separados em grupos.' },
  ],
  cycleTitle: 'Ciclo de reciclagem do papel',
  cycleText: 'O ciclo de reciclagem do papel envolve coleta, triagem, trituração, purificação, branqueamento, refino, formação da folha e secagem. Cada etapa é crucial para transformar o papel usado em novos produtos.',
  benefitsTitle: 'Benefícios da reciclagem de papel',
  benefits: [
    { icon: 'bi-tree', title: 'Ambientais', text: 'Cada tonelada de papel reciclado poupa o corte de 15-20 árvores e reduz a poluição do ar e da água.' },
    { icon: 'bi-cash', title: 'Econômicos', text: 'Gera empregos nas cooperativas de reciclagem e diminui custos de produção industrial.' },
  ],
  extraLists: [
    {
      title: 'Dicas práticas para o dia a dia',
      items: [
        'Utilize os dois lados das folhas antes de descartá-las.',
        'Prefira recibos digitais aos impressos.',
        'Reutilize caixas de papelão para armazenamento antes de enviá-las para reciclagem.',
        'Cancele correspondências impressas desnecessárias.',
        'Crie um ponto de coleta de papel dedicado em sua casa ou escritório.',
        'Verifique se há cooperativas de catadores na sua região que recolhem papel.',
        'Dê preferência a produtos feitos com papel reciclado para fechar o ciclo.',
      ],
    },
    {
      title: 'Curiosidades',
      items: [
        'O papel pode ser reciclado de 5 a 7 vezes antes que suas fibras fiquem curtas demais.',
        'O Brasil recicla aproximadamente 68% do papel ondulado consumido.',
        'Um brasileiro produz, em média, 96 kg de resíduos de papel por ano.',
        'A reciclagem de papel reduz em 70% o consumo de água em comparação com a produção a partir de fibras virgens.',
      ],
    },
  ],
  footerText: 'Adotar práticas adequadas de reciclagem de papel é um passo simples mas poderoso para contribuir com a preservação ambiental.',
};
}
