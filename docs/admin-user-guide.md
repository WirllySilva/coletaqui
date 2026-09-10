# Guia do administrador

Este documento explica como o administrador usa o painel do Coletaqui Araçoiaba.

O administrador é responsável por acompanhar a operação da plataforma, validar cadastros, gerenciar dados básicos e analisar os indicadores ambientais da comunidade.

## 1. Acesso ao painel

Endereço:

```text
https://coletaquiaracoiaba.com.br/admin/login
```

Diferente dos moradores e coletores, o administrador entra com:

- e-mail;
- senha.

O administrador não usa código por SMS para entrar no painel.

## 2. Dashboard administrativo

Depois do login, o administrador acessa o dashboard.

O dashboard mostra uma visão geral da plataforma:

- total de usuários;
- total de coletores;
- coletores pendentes;
- pontos de coleta ativos;
- coletas registradas;
- coletas abertas;
- coletas concluídas;
- entregas confirmadas em pontos;
- árvores registradas;
- árvores aguardando validação;
- indicadores por material e bairro.

Essa tela ajuda o administrador a entender rapidamente como o projeto está funcionando.

## 3. Aprovar coletores

Novos coletores entram como pendentes.

O administrador deve avaliar:

- nome do coletor ou estabelecimento;
- região de atendimento;
- materiais coletados;
- disponibilidade;
- tipo de atendimento;
- endereço, quando receber material em ponto fixo.

Após a avaliação, o administrador pode:

- aprovar;
- bloquear;
- reativar.

Um coletor pendente não consegue aceitar coletas nem confirmar entregas como participante ativo.

## 4. Gerenciar usuários

Na área de usuários, o administrador pode consultar as contas cadastradas.

Essa tela ajuda a acompanhar:

- moradores;
- coletores;
- administradores;
- status da conta;
- dados básicos de cadastro.

O administrador pode usar essa área para identificar contas bloqueadas, perfis incompletos ou registros que precisam de atenção.

## 5. Gerenciar materiais

Materiais são os tipos de resíduos usados no sistema.

Exemplos:

- papel;
- plástico;
- vidro;
- metal;
- óleo de cozinha;
- pilhas e baterias;
- orgânico, quando aplicável.

Esses materiais aparecem em:

- pontos de coleta;
- coletores;
- agendamentos;
- entregas em ponto;
- indicadores;
- ranking.

Manter os materiais bem cadastrados evita confusão no uso do app.

## 6. Gerenciar pontos de coleta

O administrador cadastra os locais fixos onde moradores podem entregar materiais.

Dados importantes:

- nome do ponto;
- telefone responsável;
- endereço;
- cidade e estado;
- latitude e longitude;
- materiais aceitos;
- dias de funcionamento;
- horário de abertura e fechamento;
- status ativo ou inativo.

Para aparecer corretamente no mapa, o ponto precisa ter latitude e longitude válidas.

Quando o ponto possui telefone responsável, esse responsável pode confirmar entregas feitas por moradores.

## 7. Acompanhar coletas

Na área de coletas, o administrador acompanha o andamento das solicitações.

Status comuns:

- solicitada;
- aceita;
- concluída;
- cancelada.

Essa tela permite observar se existem pedidos abertos aguardando coletor, quais coletas foram concluídas e como a operação está acontecendo na cidade.

## 8. Validar árvores plantadas

Moradores podem registrar árvores com foto, data, espécie, bairro e localização.

O administrador analisa cada registro e decide se valida ou rejeita.

Ao validar:

- a árvore passa a contar no impacto;
- pode aparecer no mapa público;
- a foto de evidência é removida do armazenamento.

Ao rejeitar:

- o administrador informa o motivo;
- o morador consegue ver a justificativa;
- a foto de evidência também é removida.

A foto é tratada como evidência temporária.

## 9. Gerenciar ranking

O ranking mostra a participação dos moradores.

Ele pode considerar:

- coletas domiciliares concluídas;
- entregas confirmadas em pontos;
- materiais com maior impacto ambiental;
- árvores validadas.

O administrador pode usar o ranking para acompanhar engajamento, planejar campanhas e reconhecer moradores mais participativos.

## 10. Gerenciar conteúdos

O administrador pode criar e editar conteúdos exibidos para os usuários.

Tipos comuns:

- dica;
- notícia;
- campanha.

O conteúdo pode ter:

- título;
- resumo;
- texto completo;
- imagem enviada;
- imagem por URL;
- link externo;
- status ativo ou inativo.

Esses conteúdos aparecem principalmente na experiência do morador e ajudam na educação ambiental.

## 11. Minha conta

Na área de conta, o administrador pode:

- consultar seus dados;
- alterar informações básicas;
- trocar senha.

A senha deve ser forte e não deve ser compartilhada.

## 12. Rotina recomendada

### Diariamente

- verificar coletores pendentes;
- acompanhar coletas abertas;
- validar ou rejeitar árvores pendentes;
- conferir se há entregas aguardando confirmação.

### Semanalmente

- revisar indicadores do dashboard;
- revisar ranking;
- conferir pontos de coleta ativos;
- atualizar dicas, notícias ou campanhas.

### Mensalmente

- fazer backup do banco;
- revisar materiais cadastrados;
- revisar usuários e coletores bloqueados;
- preparar dados para relatório do projeto.

## 13. Cuidados importantes

### Dados sensíveis

O administrador deve evitar compartilhar:

- senha;
- tokens;
- chaves de API;
- dados pessoais dos usuários;
- arquivos internos do sistema.

### Fotos de plantio

As fotos são usadas apenas para validação. Depois da aprovação ou rejeição, o sistema remove a imagem para reduzir exposição de dados e uso de armazenamento.

### Coletores

O administrador deve aprovar apenas coletores confiáveis, pois eles podem visualizar solicitações de coleta e confirmar entregas.

### Pontos de coleta

Pontos com endereço ou coordenadas incorretas podem confundir os moradores. Antes de divulgar o app, vale revisar os pontos principais.

## 14. Problemas comuns

### Não consigo entrar no painel

Confira se o e-mail e senha estão corretos. O login administrativo é separado do login por telefone usado por moradores e coletores.

### Um coletor não vê solicitações

Verifique se o coletor está aprovado e ativo.

### Um ponto não aparece no mapa

Confira se latitude e longitude foram preenchidas corretamente.

### Uma árvore não aparece no mapa público

Somente árvores validadas pelo administrador aparecem no mapa público.

### O ranking não atualizou

Verifique se a ação foi concluída ou confirmada. Solicitações abertas, entregas não confirmadas e árvores pendentes não entram no ranking consolidado.
