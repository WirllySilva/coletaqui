import { Component } from '@angular/core';
import { GuideData } from '../../models/guide.model';
import { GuidePageComponent } from '../guide/guide-page.component';

@Component({
  selector: 'app-info-banner-page',
  imports: [GuidePageComponent],
  templateUrl: './info-banner.component.html',
  styleUrl: './info-banner.component.css',
})
export class InfoBannerPageComponent {
  data: GuideData = {
  theme: '#097756',
  title: 'O QUE VOCÊ PRECISA SABER SOBRE COLETA SELETIVA',
  subtitle: 'Um pequeno gesto individual com grande impacto coletivo para a preservação do meio ambiente e o futuro sustentável do planeta.',
  intro: 'A coleta seletiva é um sistema de recolhimento de materiais recicláveis que podem ser reaproveitados, diminuindo o impacto ambiental e contribuindo para a sustentabilidade. Veja os principais pontos que você precisa conhecer:',
  layout: 'info',
  listTitle: 'O que pode e não pode ser reciclado',
  sections: [
    {
      title: 'Recicláveis comuns:',
      items: ['Papel: jornais, revistas, cadernos, embalagens', 'Plástico: garrafas, embalagens, sacos', 'Vidro: garrafas, potes, frascos', 'Metal: latas de alumínio, tampas, panelas sem cabo'],
    },
    {
      title: 'Não recicláveis ou que exigem coleta especial:',
      items: ['Papéis engordurados, adesivos, fotografias', 'Espelhos, cristais, cerâmicas, lâmpadas', 'Pilhas, baterias e eletrônicos (precisam de coleta específica)', 'Isopor (em alguns lugares já há reciclagem específica)'],
    },
  ],
  stepsTitle: 'Como participar',
  steps: [
    { title: 'Separe o lixo em sua casa ou local de trabalho', text: 'Tenha recipientes diferentes para cada tipo de material reciclável.' },
    { title: 'Lave embalagens que contiveram alimentos', text: 'Remova restos de alimentos para evitar mau cheiro e atrair insetos.' },
    { title: 'Desmonte caixas de papelão', text: 'Isso ajuda a ocupar menos espaço e facilitar o transporte.' },
    { title: 'Informe-se sobre os dias e horários da coleta seletiva em sua região', text: 'Verifique os dias e horários em que o serviço é realizado na sua área.' },
    { title: 'Procure pontos de entrega voluntária próximos à sua residência', text: 'Identifique locais próximos que recebam materiais recicláveis.' },
  ],
  cycleTitle: 'Como funciona',
  cycleText: 'A coleta seletiva separa os resíduos conforme sua composição: papel, plástico, vidro, metal e orgânicos. Cada tipo de material é destinado a processos específicos de reciclagem, permitindo sua transformação em novos produtos.',
  benefitsTitle: 'Benefícios',
  benefits: [
    { icon: 'bi-trash', title: 'Redução de lixo', text: 'Redução do volume de lixo em aterros sanitários.' },
    { icon: 'bi-tree', title: 'Economia de recursos', text: 'Conservação de recursos naturais.' },
    { icon: 'bi-droplet', title: 'Redução de poluição', text: 'Diminuição da poluição do solo, água e ar.' },
    { icon: 'bi-people', title: 'Geração de empregos', text: 'Criação de postos de trabalho.' },
    { icon: 'bi-lightning', title: 'Economia de energia', text: 'Reprocessar materiais consome menos energia.' },
  ],
  footerText: 'Adotar a coleta seletiva é um pequeno gesto individual com grande impacto coletivo para a preservação do meio ambiente e o futuro sustentável do planeta.',
  colorBoxes: [
    { className: 'blue', text: 'AZUL\nPapel/Papelão' },
    { className: 'red', text: 'VERMELHO\nPlástico' },
    { className: 'green', text: 'VERDE\nVidro' },
    { className: 'yellow', text: 'AMARELO\nMetal' },
    { className: 'brown', text: 'MARROM\nOrgânicos' },
    { className: 'gray', text: 'CINZA\nNão reciclável' },
  ],
};
}
