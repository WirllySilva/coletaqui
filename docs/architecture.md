# Arquitetura
## Projeto: Coletaqui
## Versão: 1.0
## Data: [10/02/2026]

---

# 1. Visão Geral da Arquitetura

O Coletaqui é uma aplicação mobile-only composta por dois componentes principais:

- Frontend: React + Vite
- Backend: Spring Boot (API REST)
- Banco de Dados: MySQL

A comunicação entre frontend e backend ocorre via HTTP utilizando JSON.

O backend seguirá arquitetura em camadas (Controller → Service → Repository → Entity) e o frontend será estruturado por páginas e componentes reutilizáveis.

---

# 2. Estrutura do Repositório (Monorepo)
```bash
coletaqui/
backend/
frontend/
docs/
README.md
LICENSE
```
---

# 3. Arquitetura do Frontend (React + Vite)

## 3.1 Objetivos

- Interface exclusivamente mobile
- Separação clara entre páginas, componentes e estilos
- Camada centralizada de comunicação com a API
- Código organizado e escalável

## 3.2 Estrutura do Frontend
```bash
frontend/
public/
src/
assets/
components/
pages/
services/
styles/
components/
pages/
Global.css
utils/
App.jsx
main.jsx
```
Descrição:

- `pages/`: telas principais (Login, Cadastro, Dashboard, etc.)
- `components/`: componentes reutilizáveis (Header, Footer, Map, etc.)
- `services/`: camada responsável por chamadas à API
- `styles/`: arquivos CSS organizados por páginas e componentes
- `utils/`: funções auxiliares
- `App.jsx`: definição de rotas
- `main.jsx`: ponto de entrada da aplicação

## 3.3 Rotas

Rotas públicas:
- `/`
- `/login`
- `/cadastro`
- `/otp`

Rotas protegidas:
- `/dashboard-cliente`
- `/dashboard-fornecedor`

Rotas protegidas exigem JWT válido armazenado no frontend.

## 3.4 Integração com API

Recomenda-se criar:

- `apiClient.js` → instância central do Axios
- `authService.js` → funções de autenticação (request OTP, verify OTP)
- outros serviços conforme módulos futuros

Variável de ambiente:

`VITE_API_URL`=http://localhost:8080

---

# 4. Arquitetura do Backend (Spring Boot)

## 4.1 Objetivos

- Separação clara de responsabilidades
- Organização por módulos de domínio
- Segurança via OTP + JWT
- Fácil manutenção e expansão

## 4.2 Estrutura do Backend

```bash
backend/
src/
main/
java/
br/
com/
coletaqui/
ColetaquiApplication.java
```
```pgsql
config/
  CorsConfig.java
  OpenApiConfig.java

auth/
  controller/
  service/
  dto/
  entity/
  repository/

user/
  controller/
  service/
  dto/
  entity/
  repository/

common/
  exceptions/
  security/
    JwtService.java
    JwtAuthenticationFilter.java
```

Módulos futuros:
- collectionpoint/
- schedule/
- rewards/

## 4.3 Responsabilidades por Camada

Controller:
- Define endpoints
- Valida requisições
- Retorna respostas HTTP

Service:
- Implementa regras de negócio
- Orquestra operações

Repository:
- Comunicação com banco de dados via JPA

Entity:
- Representação das tabelas do banco

DTO:
- Objetos de entrada e saída da API

---

# 5. Arquitetura de Autenticação (OTP + JWT)

## 5.1 Fluxo Geral

1. Usuário escolhe perfil (CLIENT ou SUPPLIER)
2. Usuário informa telefone
3. Backend valida formato
4. Backend gera OTP e armazena com expiração
5. Usuário informa código OTP
6. Backend valida OTP
7. Backend gera JWT
8. Frontend armazena token
9. Usuário acessa dashboard protegido

## 5.2 Regras do OTP

- Código numérico de 6 dígitos
- Expiração padrão de 5 minutos
- Novo OTP invalida o anterior
- OTP não pode ser reutilizado

## 5.3 Regras do JWT

O token deve conter:
- userId
- role (CLIENT ou SUPPLIER)

O token deve ser enviado no header:
`Authorization`: Bearer <token>

---

# 6. Modelo de Dados Inicial (MVP)

## 6.1 Entidade User

Finalidade: representar usuários do sistema.

Campos mínimos:

- id (UUID)
- phone (String)
- role (Enum: CLIENT, SUPPLIER)
- name (String, opcional no início)
- createdAt
- updatedAt

Restrição:
- unique(phone, role)

---

## 6.2 Entidade OtpCode

Finalidade: armazenar códigos OTP gerados.

Campos mínimos:

- id (UUID)
- phone (String)
- role (Enum)
- code (String - 6 dígitos)
- expiresAt (DateTime)
- usedAt (DateTime, opcional)
- createdAt

Regras:
- Apenas o último OTP ativo é válido
- Novo OTP invalida o anterior

---

# 7. Endpoints do MVP

## 7.1 Health Check

GET /health

Resposta:
```json
{ "status": "ok" }
```

---

## 7.2 Autenticação

### POST /auth/request-otp

Request:
- phone
- role

Response:
- message
- expiresInSeconds
- otp (apenas ambiente de desenvolvimento)

---

### POST /auth/verify-otp

Request:
- phone
- role
- code

Response:
- token (JWT)
- user (id, phone, role, name)

---

### POST /auth/complete-profile (opcional)

Requer JWT

Permite preencher dados após autenticação inicial.

---

# 8. Ambiente e Configuração

## 8.1 Desenvolvimento

Frontend:
- http://localhost:5173

Backend:
- http://localhost:8080

Backend deve permitir CORS para o frontend.

---

## 8.2 Produção

Opção 1:
- Frontend e backend hospedados separadamente.

Opção 2:
- Build do frontend servido pelo Spring Boot.

---

# 9. Logs e Monitoramento (MVP)

- Log de geração de OTP
- Log de validação de OTP
- Log de erros de autenticação
- Log de requisições importantes

---

# 10. Segurança

- JWT assinado com segredo armazenado em variável de ambiente
- OTP não exposto em produção
- Uso obrigatório de HTTPS em produção
- Validação de formato de telefone

---

# 11. Evoluções Futuras

- Pontos de coleta com mapa
- Agendamento de coleta
- Sistema de recompensas
- Ranking de usuários
- Painel administrativo