# Documento de Requisitos
## Projeto: Coletaqui
## Versão: 2.0
## Data: 01/07/2026

---

# 1. Visão Geral

O Coletaqui é uma aplicação PWA mobile-first que tem como objetivo incentivar e facilitar a reciclagem, conectando a comunidade a pontos de coleta e catadores/coletadores, promovendo educação ambiental, organização de coletas e análise de impacto.

O sistema utilizará autenticação baseada em OTP (One-Time Password) via telefone, com emissão de JWT após validação. O fluxo recomendado de entrada será unificado: o usuário informa o telefone, valida o OTP e, se ainda não possuir cadastro completo, preenche os dados necessários.

---

# 2. Atores do Sistema

## 2.1 Usuário Comum

Usuário que:

- Acessa o aplicativo pelo PWA.
- Realiza login ou início de cadastro via telefone + OTP.
- Consulta dicas educativas sobre reciclagem.
- Consulta pontos de coleta.
- Solicita ou acompanha agendamentos de coleta.
- Acessa ranking, perfil e funcionalidades de engajamento.

## 2.2 Catador/Coletor

Usuário que:

- Realiza login ou início de cadastro via telefone + OTP.
- Completa cadastro com dados específicos de atuação.
- Informa materiais coletados, região de atendimento e disponibilidade.
- Gerencia solicitações e atividades relacionadas à coleta.

## 2.3 Administrador

Usuário administrativo que:

- Acessa o painel desktop por `/admin/login`.
- Realiza login por e-mail e senha.
- Gerencia usuários.
- Gerencia pontos de coleta.
- Acompanha relatórios e dashboards.
- Configura parâmetros do sistema.
- Pode aprovar ou revisar cadastros de catadores/coletadores.

Observação: para administrador, o sistema usa e-mail + senha. Segundo fator pode ser adicionado no futuro.

---

# 3. Escopo do MVP

O MVP deverá contemplar:

1. Fluxo unificado de entrada por telefone + OTP.
2. Identificação automática de usuário já cadastrado.
3. Complemento de cadastro quando o telefone ainda não possuir perfil completo.
4. Cadastro de usuário comum.
5. Cadastro de catador/coletor com dados específicos.
6. Geração e validação de JWT após autenticação.
7. Redirecionamento conforme perfil do usuário.
8. Conteúdo educativo sobre separação de materiais recicláveis.
9. Base para consulta de pontos de coleta, agendamentos, relatórios e dashboards.
10. Painel administrativo desktop com login por e-mail e senha.

---

# 4. Requisitos Funcionais

## RF-01 — Seleção de Tipo de Conta

O sistema deve permitir que o usuário informe se deseja seguir como usuário comum ou catador/coletor quando for necessário completar cadastro.

Critérios de aceite:

- A tela de escolha apresenta as opções de usuário comum e catador/coletor.
- A escolha define quais dados complementares serão solicitados.
- O perfil salvo define as funcionalidades liberadas ao usuário.

---

## RF-02 — Entrada Unificada por Telefone + OTP

O sistema deve permitir login ou início de cadastro utilizando telefone e validação via OTP.

Fluxo:

1. Usuário informa número de telefone.
2. Sistema valida o formato do telefone.
3. Sistema gera e envia OTP.
4. Usuário informa o OTP.
5. Sistema valida o OTP.
6. Sistema verifica se o telefone já possui usuário cadastrado.
7. Se existir usuário com perfil completo, login é concluído.
8. Se não existir usuário ou o perfil estiver incompleto, o usuário é direcionado para completar cadastro.
9. Após login ou cadastro válido, o sistema emite JWT.

Critérios de aceite:

- Telefone inválido gera mensagem de erro.
- OTP inválido, expirado ou reutilizado gera erro.
- Usuário já cadastrado é autenticado após OTP válido.
- Usuário novo é direcionado para completar cadastro após OTP válido.
- Login ou cadastro válido retorna token de autenticação.

---

## RF-03 — Completar Cadastro de Usuário Comum

O sistema deve permitir que um usuário novo complete o cadastro como usuário comum após validar o OTP.

Dados mínimos:

- Nome.
- Telefone validado.
- Perfil de usuário comum.

Critérios de aceite:

- O telefone validado pelo OTP deve ser reaproveitado no cadastro.
- O cadastro não deve exigir nova validação de telefone na mesma sessão.
- Após cadastro válido, o usuário é autenticado e redirecionado conforme perfil.

---

## RF-04 — Completar Cadastro de Catador/Coletor

O sistema deve permitir que um usuário novo complete o cadastro como catador/coletor após validar o OTP.

Dados previstos:

- Nome.
- Telefone validado.
- Região de atuação.
- Materiais coletados.
- Disponibilidade.
- Dados opcionais de identificação ou validação.

Critérios de aceite:

- O telefone validado pelo OTP deve ser reaproveitado no cadastro.
- Dados específicos de atuação podem ser obrigatórios.
- O perfil de catador/coletor pode ficar pendente de aprovação administrativa antes de ser exibido publicamente.

---

## RF-05 — Geração de OTP

O sistema deve gerar um código OTP numérico para validação de autenticação.

Regras:

- OTP deve conter 6 dígitos.
- OTP deve ter tempo de expiração padrão de 5 minutos.
- Novo OTP invalida o anterior do mesmo telefone.
- O OTP deve ser armazenado preferencialmente em formato hash.

---

## RF-06 — Validação de OTP

O sistema deve validar se:

- O código corresponde ao último OTP gerado.
- O OTP não está expirado.
- O OTP ainda não foi utilizado.
- O telefone corresponde ao OTP informado.
- O limite de tentativas não foi excedido.

Caso inválido, o sistema deve retornar erro apropriado.

---

## RF-07 — Emissão de Token JWT

Após validação do OTP e conclusão das regras de cadastro/login, o sistema deve:

- Gerar um JWT.
- Retornar o token ao frontend.
- Permitir acesso às rotas protegidas.
- Incluir no token informações mínimas como `userId`, `role`, `phone`, `issuedAt` e `expiresAt`.

---

## RF-08 — Pontos de Coleta

O sistema deve permitir consulta e gestão de pontos de coleta de recicláveis, óleo de cozinha usado, pilhas e baterias.

Critérios de aceite:

- Usuários podem consultar pontos de coleta.
- Pontos podem possuir endereço, localização e materiais aceitos.
- Administradores podem cadastrar, editar ou desativar pontos de coleta.

---

## RF-09 — Agendamento de Coleta

O sistema deve permitir o agendamento de coleta de materiais recicláveis.

Critérios de aceite:

- Usuário comum pode solicitar coleta.
- Catador/coletor pode aceitar, recusar ou concluir solicitações.
- O sistema deve controlar status do agendamento.

---

## RF-10 — Relatórios e Dashboards

O sistema deve disponibilizar relatórios e dashboards para análise de impacto e eficácia da plataforma.

Critérios de aceite:

- O sistema deve registrar dados úteis para análise de coletas.
- O sistema deve permitir visualizar indicadores de uso, impacto e status de agendamentos.
- O painel administrativo deve exibir graficos de coletas por status, materiais mais coletados e bairros com maior demanda.
- O administrador deve poder exportar coletas filtradas em CSV.

---

## RF-12 — Gestão Administrativa de Materiais e Pontos

O sistema deve permitir que o administrador gerencie materiais aceitos e pontos fixos de recebimento.

Critérios de aceite:

- Administrador pode criar, editar, ativar e desativar materiais.
- Administrador pode criar, editar, ativar e desativar pontos de recebimento.
- Pontos de recebimento devem registrar nome, endereço, materiais aceitos, horário e status.

---

## RF-11 — Login Administrativo

O sistema deve permitir que administradores acessem o painel desktop por e-mail e senha.

Critérios de aceite:

- A rota `/admin/login` deve exibir o formulário administrativo.
- Credenciais válidas devem retornar JWT com `role = ADMIN`.
- Credenciais inválidas devem exibir erro sem revelar se o e-mail existe.
- Após autenticação válida, o administrador deve ser redirecionado para `/admin/dashboard`.
- Usuários comuns e coletores não devem acessar as rotas administrativas.

---

# 5. Regras de Negócio

## RN-01 — Identificação por Telefone

O telefone será utilizado como identificador principal do usuário.

Regra:

- O telefone deve ser único no cadastro de usuários.
- Um mesmo telefone não deve criar múltiplas contas independentes.
- A mudança de perfil deve ser tratada como atualização do usuário ou solicitação administrativa, não como nova conta separada.

---

## RN-02 — Expiração de OTP

O OTP deve expirar após 5 minutos, salvo configuração diferente por ambiente.

---

## RN-03 — Substituição de OTP

Sempre que um novo OTP for solicitado:

- O anterior deve ser invalidado automaticamente.

---

## RN-04 — Reutilização de OTP

Um OTP validado com sucesso não pode ser reutilizado.

---

## RN-05 — Redirecionamento por Perfil

Após login ou cadastro:

- Usuário comum deve ser redirecionado para a área principal do aplicativo.
- Catador/coletor deve ser redirecionado para sua área de atuação.
- Administrador deve ser redirecionado para área administrativa, quando disponível.
- Administrador autenticado deve ser redirecionado para `/admin/dashboard`.

---

## RN-06 — Aprovação de Catador/Coletor

O cadastro de catador/coletor pode exigir aprovação administrativa antes de ficar visível publicamente ou receber solicitações.

Regras:

- Coletor com `status = PENDING_APPROVAL` pode autenticar, mas não pode acessar solicitações, agenda, aceite, conclusão ou dashboard de impacto.
- Coletor com `status = ACTIVE` pode atuar normalmente.
- Coletor com `status = BLOCKED` não deve acessar o sistema operacional de coleta.
- Administrador pode aprovar, bloquear e reativar coletores.

---

# 6. Requisitos Não Funcionais

## RNF-01 — Plataforma

A aplicação deve ser PWA mobile-first.

Critérios:

- Interface otimizada para dispositivos móveis.
- Possibilidade de instalação como PWA.
- Experiência responsiva em telas maiores quando necessário.

---

## RNF-02 — Segurança

- JWT deve ser assinado.
- OTP não pode ser reutilizado.
- OTP não deve ser exposto em ambiente de produção.
- OTP deve ter limite de tentativas.
- Deve haver intervalo mínimo para reenvio de OTP.
- Dados sensíveis não devem ser retornados em respostas da API.
- Senhas administrativas devem ser armazenadas como hash BCrypt.

---

## RNF-03 — Performance

- Respostas da API devem ser rápidas.
- Frontend deve apresentar feedback visual de loading, erro e sucesso.
- A aplicação PWA deve carregar de forma eficiente em dispositivos móveis.

---

## RNF-04 — Usabilidade

- Mensagens de erro claras.
- Validação imediata de telefone inválido.
- Fluxo intuitivo de login/cadastro.
- Telas educativas devem ser fáceis de acessar e ler.

---

## RNF-05 — Persistência

- O banco de dados definido para o projeto é PostgreSQL.
- O backend deve acessar o banco por ORM com Spring Data JPA/Hibernate.
- O ambiente local pode ser executado via Docker Compose.

---

# 7. Definition of Done

Uma funcionalidade é considerada concluída quando:

- Backend implementado.
- Endpoint testado via Postman, Swagger ou ferramenta equivalente.
- Frontend integrado ao backend quando aplicável.
- Regras de negócio aplicadas.
- Tratamento de erros implementado.
- Documentação atualizada.
- Build local ou containerizado validado.

---

# 8. Fora do Escopo Inicial

- Integração com SMS real.
- Sistema avançado de ranking.
- Monitoramento avançado de performance.
- Gateway de pagamento ou remuneração de catadores/coletadores.

---

# 9. Atualizacao Funcional - Agendamentos e Impacto

## Agendamentos

O fluxo atual de agendamentos contempla:

- Criacao de solicitacao pelo usuario comum.
- Historico de solicitacoes do usuario comum.
- Detalhe da coleta com endereco, materiais, observacoes, disponibilidade, solicitante, coletor e linha do tempo.
- Cancelamento pelo usuario comum enquanto a solicitacao ainda estiver `REQUESTED`.
- Listagem de solicitacoes abertas para coletores.
- Aceite de solicitacao por coletor.
- Agenda do coletor com coletas aceitas e concluidas.
- Conclusao de coleta pelo coletor responsavel.

Status utilizados:

- `REQUESTED`: solicitacao aberta, aguardando coletor.
- `ACCEPTED`: solicitacao aceita por um coletor.
- `COMPLETED`: coleta concluida.
- `CANCELED`: solicitacao cancelada antes do aceite.

## Dashboard de Impacto

O dashboard inicial de impacto contempla:

- Total de solicitacoes.
- Total de coletas concluidas.
- Taxa de conclusao.
- Distribuicao por status.
- Materiais mais coletados.
- Bairros com maior demanda.
- Coletores mais ativos.

Regra de visibilidade:

- Usuario comum nao deve visualizar graficos operacionais.
- Coletor visualiza indicadores relacionados apenas as coletas sob sua responsabilidade.
- Administrador, em evolucao futura, visualiza indicadores gerais da plataforma.
- Ranking permanece reservado para gamificacao e engajamento dos moradores.
