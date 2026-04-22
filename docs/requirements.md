# Documento de Requisitos
## Projeto: Coletaqui
## Versão: 1.0
## Data: [10/02/2026]

---

# 1. Visão Geral

O Coletaqui é uma aplicação mobile-only que tem como objetivo incentivar e facilitar a reciclagem, conectando usuários (clientes) a fornecedores/coletadores e promovendo educação ambiental, organização de coletas e recompensas.

O sistema possui autenticação baseada em OTP (One-Time Password) via telefone e diferenciação de acesso por perfil (Cliente e Fornecedor).

---

# 2. Atores do Sistema

## 2.1 Cliente
Usuário que:
- Realiza cadastro e login via telefone + OTP
- Acessa o Dashboard Cliente
- Utiliza as funcionalidades do aplicativo (mapa, solicitações, ranking, etc.)

## 2.2 Fornecedor
Usuário que:
- Realiza cadastro e login via telefone + OTP
- Acessa o Dashboard Fornecedor
- Gerencia solicitações e atividades relacionadas à coleta

## 2.3 Administrador (futuro)
- Gerencia usuários
- Gerencia pontos de coleta
- Acompanha relatórios
- Configura parâmetros do sistema

---

# 3. Escopo do MVP

O MVP (Produto Mínimo Viável) deverá contemplar:

1. Cadastro de Cliente via telefone + OTP
2. Login de Cliente via telefone + OTP
3. Cadastro de Fornecedor via telefone + OTP
4. Login de Fornecedor via telefone + OTP
5. Geração e validação de JWT após autenticação
6. Redirecionamento para dashboard correto conforme perfil

Funcionalidades como mapa, agendamento e ranking serão implementadas após a conclusão do MVP de autenticação.

---

# 4. Requisitos Funcionais

## RF-01 — Seleção de Perfil

O sistema deve permitir que o usuário selecione se deseja acessar como Cliente ou Fornecedor.

Critérios de aceite:
- A tela inicial apresenta as opções Cliente e Fornecedor.
- A escolha define o fluxo de login/cadastro.
- O dashboard exibido depende do perfil selecionado.

---

## RF-02 — Cadastro de Cliente via Telefone + OTP

O sistema deve permitir o cadastro de Cliente utilizando telefone e validação via OTP.

Fluxo:
1. Usuário insere número de telefone.
2. Sistema valida o formato do telefone.
3. Sistema gera e envia OTP.
4. Usuário insere OTP.
5. Sistema valida OTP.
6. Usuário preenche dados cadastrais.
7. Cadastro concluído e redirecionamento para Dashboard Cliente.

Critérios de aceite:
- Telefone inválido gera mensagem de erro.
- OTP inválido ou expirado gera erro.
- Após cadastro válido, o usuário é autenticado.

---

## RF-03 — Login de Cliente via Telefone + OTP

O sistema deve permitir login de Cliente utilizando telefone e OTP.

Fluxo:
1. Usuário insere telefone.
2. Sistema verifica se o usuário está cadastrado.
3. Sistema gera e envia OTP.
4. Usuário insere OTP.
5. Sistema valida OTP.
6. Login validado e redirecionamento para Dashboard Cliente.

Critérios de aceite:
- Usuário não cadastrado gera erro.
- OTP inválido ou expirado gera erro.
- Login válido retorna token de autenticação.

---

## RF-04 — Cadastro de Fornecedor via Telefone + OTP

O sistema deve permitir o cadastro de Fornecedor via telefone e OTP.

Fluxo semelhante ao cadastro de Cliente, com redirecionamento final para Dashboard Fornecedor.

Critérios de aceite:
- Mesmas validações do fluxo de Cliente.
- Dados cadastrais específicos podem ser exigidos para fornecedor.

---

## RF-05 — Login de Fornecedor via Telefone + OTP

O sistema deve permitir login de Fornecedor via telefone e OTP.

Critérios de aceite:
- Verificação de existência do usuário.
- Validação de OTP.
- Redirecionamento para Dashboard Fornecedor.

---

## RF-06 — Geração de OTP

O sistema deve gerar um código OTP numérico para validação de autenticação.

Regras:
- OTP deve conter 6 dígitos.
- OTP deve ter tempo de expiração (exemplo: 5 minutos).
- Novo OTP invalida o anterior do mesmo telefone.

---

## RF-07 — Validação de OTP

O sistema deve validar se:
- O código corresponde ao último OTP gerado.
- O OTP não está expirado.
- O telefone corresponde ao OTP informado.

Caso inválido, o sistema deve retornar erro apropriado.

---

## RF-08 — Emissão de Token JWT

Após validação do OTP, o sistema deve:

- Gerar um JWT
- Retornar o token ao frontend
- Permitir acesso às rotas protegidas

---

# 5. Regras de Negócio

## RN-01 — Identificação por Telefone

O telefone será utilizado como identificador principal do usuário.

Decisão pendente:
- Telefone único global
ou
- Telefone único por perfil (Cliente e Fornecedor)

---

## RN-02 — Expiração de OTP

O OTP deve expirar após um período definido (exemplo: 5 minutos).

---

## RN-03 — Substituição de OTP

Sempre que um novo OTP for solicitado:
- O anterior deve ser invalidado automaticamente.

---

## RN-04 — Redirecionamento por Perfil

Após login ou cadastro:
- Cliente deve ser redirecionado ao Dashboard Cliente.
- Fornecedor deve ser redirecionado ao Dashboard Fornecedor.

---

# 6. Requisitos Não Funcionais

## RNF-01 — Plataforma

A aplicação é mobile-only.
A interface deve ser projetada exclusivamente para dispositivos móveis.

---

## RNF-02 — Segurança

- JWT deve ser assinado.
- OTP não pode ser reutilizado.
- OTP não deve ser exposto em ambiente de produção.

---

## RNF-03 — Performance

- Respostas da API devem ser rápidas.
- Frontend deve apresentar feedback visual (loading, erro, sucesso).

---

## RNF-04 — Usabilidade

- Mensagens de erro claras.
- Validação imediata de telefone inválido.
- Fluxo intuitivo.

---

# 7. Definition of Done

Uma funcionalidade é considerada concluída quando:

- Backend implementado.
- Endpoint testado via Postman ou Swagger.
- Frontend integrado ao backend.
- Regras de negócio aplicadas.
- Tratamento de erros implementado.
- Documentação atualizada.

---

# 8. Fora do Escopo Inicial

- Integração com SMS real.
- Painel administrativo completo.
- Sistema avançado de ranking.
- Monitoramento avançado de performance.