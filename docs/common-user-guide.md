# Guia do usuário comum

Este documento explica como o morador usa o Coletaqui Araçoiaba.

O usuário comum é a pessoa da comunidade que quer descartar recicláveis corretamente, solicitar coleta, registrar entregas e acompanhar seu impacto ambiental.

## 1. Acesso ao app

Endereço:

```text
https://coletaquiaracoiaba.com.br
```

O morador pode usar pelo navegador ou instalar como PWA no celular.

## 2. Login ou cadastro

1. Abra o Coletaqui Araçoiaba.
2. Toque em **Entrar ou criar conta**.
3. Escolha a opção de **usuário comum**.
4. Informe o telefone.
5. Receba o código por SMS.
6. Digite o código no app.

Se for o primeiro acesso, o sistema pede os dados básicos do perfil.

Dados mínimos:

- nome;
- aceite dos Termos de Uso;
- aceite da Política de Privacidade.

O telefone identifica a conta. Um número usado como usuário comum não deve ser usado como coletor.

## 3. Tela inicial do usuário comum

Depois do login, o morador entra na home do usuário comum.

Principais áreas:

- **Como separar**: orientações sobre materiais recicláveis.
- **Pontos**: locais fixos para entrega de recicláveis.
- **Coletores**: pessoas ou estabelecimentos que podem coletar ou receber materiais.
- **Agendar**: solicitação de coleta domiciliar.
- **Ranking**: participação dos moradores.
- **Plante uma árvore**: registro e acompanhamento de árvores plantadas.
- **Meu impacto**: histórico das ações confirmadas.

## 4. Consultar pontos de coleta

Na tela de pontos, o morador vê locais cadastrados em Araçoiaba.

O morador pode:

- consultar o mapa;
- selecionar um ponto;
- ver endereço, horário e materiais aceitos;
- abrir rota pelo Waze;
- registrar entrega no ponto, quando disponível.

Se o ponto aceitar apenas um material, o sistema pode preencher essa informação automaticamente. Se aceitar vários, o usuário escolhe o material entregue.

## 5. Registrar entrega em ponto de coleta

O morador pode avisar que deixou material em um ponto cadastrado.

Fluxo:

1. Escolhe o ponto.
2. Informa os materiais entregues.
3. Envia o registro.
4. O ponto ou coletor responsável confirma a entrega.
5. Depois da confirmação, a ação entra no impacto e no ranking.

A entrega só conta como participação quando for confirmada.

## 6. Solicitar coleta domiciliar

Na tela de agendamento, o morador solicita que um coletor retire os materiais em casa.

Dados usados:

- endereço;
- materiais;
- período preferencial;
- data desejada, quando informada;
- observações.

Depois de enviada, a solicitação fica disponível para coletores ativos. Quando um coletor aceita, a coleta passa a aparecer no histórico do usuário. Ao ser concluída pelo coletor, ela passa a contar no impacto.

## 7. Acompanhar minhas solicitações

Em **Minhas solicitações**, o morador acompanha o status das coletas.

Status comuns:

- solicitada;
- aceita;
- concluída;
- cancelada.

Enquanto a coleta ainda estiver aberta, o morador pode cancelar a solicitação.

## 8. Consultar coletores

Na tela de coletores, o morador vê quem está ativo na plataforma.

O app mostra:

- nome do coletor ou estabelecimento;
- tipo de atendimento;
- materiais aceitos;
- disponibilidade;
- região;
- contato por WhatsApp, quando disponível;
- rota, quando o coletor também recebe material em ponto fixo.

Tipos de atendimento:

- coleta domiciliar;
- ponto de recebimento;
- coleta domiciliar e ponto de recebimento.

## 9. Meu impacto

A tela **Meu impacto** consolida ações ambientais do morador.

Entram no impacto:

- coletas domiciliares concluídas;
- entregas em ponto confirmadas;
- árvores validadas pelo administrador.

Ações ainda abertas, pendentes ou rejeitadas não compõem o impacto consolidado.

## 10. Ranking

O ranking reconhece moradores que participam da coleta seletiva e das ações ambientais.

A pontuação pode considerar:

- coletas concluídas;
- entregas confirmadas;
- materiais de maior impacto ambiental;
- árvores plantadas e validadas.

O objetivo do ranking é incentivar participação comunitária.

## 11. Registrar plantio de árvore

Na área **Plante uma árvore**, o morador registra uma árvore plantada.

Dados solicitados:

- nome da árvore, se quiser informar;
- espécie;
- data do plantio;
- tipo de local;
- bairro;
- referência do local;
- foto do plantio;
- localização GPS, se o usuário permitir.

A foto é usada como evidência para o administrador validar o plantio. Depois que o registro é validado ou rejeitado, a foto é removida do armazenamento.

Somente árvores validadas aparecem no mapa público e contam no impacto.

## 12. Configurações e notificações

Na tela de configurações, o morador pode ajustar preferências do app.

As notificações push dependem de:

- app instalado como PWA;
- permissão concedida pelo usuário;
- HTTPS ativo em produção;
- chaves VAPID configuradas no backend.

## 13. Sair da conta

O login foi configurado para durar bastante tempo e evitar gasto desnecessário com SMS.

O usuário só deve precisar entrar novamente se:

- clicar em **Sair**;
- limpar dados do navegador;
- trocar de aparelho;
- ocorrer algum problema de autenticação.

## 14. Problemas comuns

### Não recebi o SMS

Verifique se o número foi digitado com DDD correto. Em Araçoiaba, o app considera DDD 81 quando o usuário informa apenas o número local.

### O número pertence a outro tipo de conta

Se um telefone já pertence a usuário comum, ele não pode entrar como coletor. O contrário também vale. Nesse caso, use a tela correta ou outro telefone.

### A coleta não aparece como concluída

A coleta precisa ser aceita e concluída por um coletor ativo.

### A árvore não aparece no mapa

O administrador precisa validar o plantio. Registros pendentes ou rejeitados não aparecem como árvores confirmadas.

### A entrega não pontuou

A entrega em ponto precisa ser confirmada pelo responsável do ponto ou coletor.
