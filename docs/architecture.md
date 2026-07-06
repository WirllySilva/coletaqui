# Arquitetura

## Projeto: Coletaqui
## Versão: 2.0
## Data: 01/07/2026

---

## 1. Visão Geral

O Coletaqui é uma aplicação PWA mobile-first voltada à educação ambiental, mapeamento de pontos de coleta, agendamento de coletas e análise de impacto da reciclagem.

Objetivos principais:

1. Mapear pontos de coleta de recicláveis, óleo de cozinha usado, pilhas e baterias.
2. Permitir o agendamento de coleta de materiais recicláveis.
3. Disponibilizar relatórios e dashboards para análise de impacto e eficácia da plataforma.

A arquitetura é composta por:

- Frontend: Angular PWA.
- Backend: Java com Spring Boot, API REST.
- Banco de dados: PostgreSQL.
- ORM: Spring Data JPA/Hibernate.
- Autenticação: OTP por telefone + JWT para usuário comum/coletor, e e-mail + senha para administrador.
- Containerização: Docker e Docker Compose.

A comunicação entre frontend e backend será feita por HTTP/HTTPS utilizando JSON.

---

## 2. Estrutura do Repositório

```text
coletaqui/
  backend/
    Dockerfile
  frontend/
    Dockerfile
    nginx.conf
  docs/
  docker-compose.yml
  README.md
  LICENSE
```

Diretórios principais:

- `backend/`: API Java/Spring Boot.
- `frontend/`: frontend atual em Angular PWA.
- `docs/`: documentação técnica, requisitos, arquitetura, banco e diagramas.
- `docker-compose.yml`: orquestra frontend, backend e banco PostgreSQL.

---

## 3. Arquitetura do Frontend

### 3.1 Tecnologia

O frontend atual é uma aplicação Angular PWA, com foco em dispositivos móveis.

Principais tecnologias:

- Angular.
- Angular Router.
- Angular Service Worker.
- Bootstrap.
- Bootstrap Icons.
- TypeScript.

### 3.2 Objetivos do Frontend

- Oferecer experiência mobile-first.
- Funcionar como PWA instalável.
- Permitir navegação simples entre telas educativas, mapa, catadores, ranking e perfil.
- Consumir a API REST do backend.
- Separar telas, componentes reutilizáveis e modelos de dados.

### 3.3 Estrutura do Frontend Angular

```text
frontend/
  public/
    manifest.webmanifest
    icons/
  src/
    assets/
    app/
      components/
        footer/
        header/
        map-preview/
        recycling-tips/
      models/
      pages/
        home/
        how-to-separate/
        paper/
        plastic/
        glass/
        metal/
        organic/
        battery/
        info-banner/
        auth/
        collectors/
        ranking/
        user-data/
      app.routes.ts
      app.config.ts
      app.ts
    styles.css
```

Descrição:

- `components/`: componentes reutilizáveis, como header, footer, preview do mapa e carrossel de dicas.
- `pages/`: páginas acessadas por rota.
- `models/`: tipos TypeScript usados pela aplicação.
- `app.routes.ts`: definição das rotas do Angular.
- `app.config.ts`: configuração global da aplicação, incluindo roteamento e service worker.
- `public/manifest.webmanifest`: manifesto PWA.

### 3.4 Rotas Frontend

Rotas públicas iniciais:

- `/`
- `/welcome`
- `/loginselectionpage`
- `/account-typechoice`
- `/commonuserloginpage`
- `/collectorloginpage`
- `/commonuser-register`
- `/collector-register`
- `/recovercommonuserpassword`
- `/recovercollectorpassword`

Rotas funcionais/educativas:

- `/home`
- `/howtoseparate`
- `/infobanner`
- `/paper`
- `/plastic`
- `/glass`
- `/metal`
- `/organic`
- `/battery`
- `/collectors`
- `/ranking`
- `/plantatree`
- `/userdata`

Quando a autenticação estiver integrada, rotas como `/home`, `/collectors`, `/ranking`, `/userdata`, agendamentos e dashboards deverão ser protegidas por autenticação JWT.

### 3.5 Integração com a API

Recomenda-se criar uma camada de serviços no Angular:

```text
src/app/services/
  api.service.ts
  auth.service.ts
  collection-point.service.ts
  schedule.service.ts
  report.service.ts
```

Variável de ambiente sugerida:

```text
API_URL=http://localhost:8080
```

Em ambiente containerizado, o frontend Angular é compilado e servido por Nginx. O Nginx também pode atuar como proxy para chamadas iniciadas por `/api/`, encaminhando essas requisições para o serviço `backend` na rede interna do Docker.

---

## 4. Arquitetura do Backend

### 4.1 Tecnologia

O backend será uma API REST em Java com Spring Boot.

Principais tecnologias:

- Java 17.
- Spring Boot.
- Spring Web MVC.
- Spring Security.
- Spring Validation.
- Spring Data JPA.
- Hibernate.
- PostgreSQL.
- Lombok.
- springdoc-openapi para documentação Swagger/OpenAPI.

O backend utiliza o driver PostgreSQL em tempo de execução e recebe a configuração do banco por variáveis de ambiente.

### 4.2 Documentação da API

A API deverá ser documentada com Swagger/OpenAPI usando a biblioteca `springdoc-openapi`.

Objetivos:

- Gerar documentação interativa das rotas REST.
- Facilitar testes manuais durante o desenvolvimento.
- Exibir contratos de request e response.
- Documentar status HTTP, parâmetros, exemplos e autenticação.
- Apoiar a apresentação técnica do projeto.

URLs esperadas em ambiente local:

```text
Swagger UI: http://localhost:8080/swagger-ui/index.html
OpenAPI JSON: http://localhost:8080/v3/api-docs
```

Quando a autenticação JWT estiver implementada, o Swagger UI deverá permitir informar o token pelo botão `Authorize`, usando o padrão:

```text
Authorization: Bearer <token>
```

### 4.3 Objetivos do Backend

- Expor API REST para o PWA.
- Gerenciar usuários, perfis e autenticação.
- Gerenciar pontos de coleta.
- Gerenciar agendamentos de coleta.
- Registrar dados para relatórios e dashboards.
- Aplicar regras de segurança, validação e auditoria.

### 4.4 Estrutura Recomendada

```text
backend/
  src/main/java/br/com/coletaqui/backend/
    ColetaquiBackendApplication.java
    config/
    common/
      exception/
      security/
      dto/
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
    collectionpoint/
      controller/
      service/
      dto/
      entity/
      repository/
    schedule/
      controller/
      service/
      dto/
      entity/
      repository/
    report/
      controller/
      service/
      dto/
      projection/
```

### 4.5 Camadas

Controller:

- Recebe requisições HTTP.
- Valida entrada via DTOs.
- Retorna respostas padronizadas.

Service:

- Implementa regras de negócio.
- Orquestra transações.
- Coordena repositories e integrações externas.

Repository:

- Acessa o banco de dados via Spring Data JPA.
- Encapsula consultas SQL/JPQL.

Entity:

- Representa tabelas do banco.
- Define relacionamentos.

DTO:

- Define objetos de entrada e saída da API.
- Evita expor entidades diretamente ao frontend.

### 4.6 Containerização do Backend

O backend possui um `Dockerfile` próprio com build em múltiplos estágios:

1. Imagem com JDK para compilar a aplicação via Maven Wrapper.
2. Imagem com JRE para executar o arquivo `.jar` final.

O serviço `backend` no Docker Compose depende do serviço `db` e se conecta ao PostgreSQL usando:

```text
DATABASE_URL=jdbc:postgresql://db:5432/coletaqui
DATABASE_USERNAME=coletaqui
DATABASE_PASSWORD=coletaqui
```

---

### 4.7 Containerização do Frontend

O frontend possui um `Dockerfile` próprio com build em múltiplos estágios:

1. Imagem Node.js para instalar dependências e gerar o build Angular.
2. Imagem Nginx para servir os arquivos estáticos gerados em `dist/`.

No ambiente Docker, o serviço `frontend` é exposto em:

```text
http://localhost:4200
```

Internamente, o Nginx escuta na porta `80`.

---

## 5. Banco de Dados

### 5.1 Tecnologia

O banco definido para o projeto é PostgreSQL.

O acesso aos dados será feito via ORM:

- Spring Data JPA.
- Hibernate.

### 5.2 Por que PostgreSQL

- Banco relacional robusto.
- Bom suporte a dados geográficos no futuro com PostGIS.
- Adequado para consultas de relatórios e dashboards.
- Boa integração com Spring Boot e JPA.

### 5.3 Entidades Principais

Entidades previstas:

- `User`
- `OtpCode`
- `CollectionPoint`
- `MaterialType`
- `Schedule`
- `CollectionRecord`
- `ImpactMetric`

### 5.4 Entidade User

Representa usuários do sistema.

Campos sugeridos:

- `id`
- `phone`
- `name`
- `role`
- `status`
- `createdAt`
- `updatedAt`

Perfis iniciais:

- `COMMON_USER`
- `COLLECTOR`
- `ADMIN`

### 5.5 Entidade OtpCode

Representa códigos OTP emitidos para autenticação.

Campos sugeridos:

- `id`
- `phone`
- `codeHash`
- `purpose`
- `expiresAt`
- `usedAt`
- `attempts`
- `createdAt`

O código deve ser armazenado preferencialmente em formato hash, não em texto puro.

### 5.6 Entidade CollectionPoint

Representa pontos de coleta.

Campos sugeridos:

- `id`
- `name`
- `description`
- `address`
- `city`
- `state`
- `latitude`
- `longitude`
- `active`
- `createdAt`
- `updatedAt`

Materiais aceitos:

- recicláveis em geral;
- óleo de cozinha usado;
- pilhas;
- baterias;
- outros materiais definidos pelo sistema.

### 5.7 Entidade Schedule

Representa um agendamento de coleta.

Campos sugeridos:

- `id`
- `user`
- `collector`
- `materialType`
- `address`
- `scheduledDate`
- `status`
- `notes`
- `createdAt`
- `updatedAt`

Status sugeridos:

- `REQUESTED`
- `ACCEPTED`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELED`

---

## 6. Autenticação e Autorização

### 6.1 Decisão Arquitetural

O sistema deve utilizar autenticação por telefone com OTP, seguida da emissão de JWT.

Para simplificar a experiência, recomenda-se um fluxo unificado de entrada:

```text
Entrar ou criar conta
→ informar telefone
→ receber OTP
→ validar código
→ sistema verifica se o usuário já existe
→ se existir: login concluído
→ se não existir: completar cadastro
→ emitir JWT
```

Essa abordagem reduz fricção para usuários comuns e evita separar excessivamente os fluxos de login e cadastro.

### 6.2 Fluxo para Usuário Comum

1. Usuário informa telefone.
2. Backend valida o formato.
3. Backend gera OTP.
4. Usuário informa o código.
5. Backend valida OTP.
6. Se o telefone já existir, login é concluído.
7. Se não existir, o usuário completa cadastro.
8. Backend emite JWT.
9. Frontend armazena o token e libera acesso às rotas protegidas.

### 6.3 Fluxo para Catador/Coletor

O catador também pode usar OTP, mas o cadastro deve exigir dados adicionais:

- nome;
- telefone;
- região de atuação;
- materiais coletados;
- disponibilidade;
- dados opcionais de identificação ou validação.

O perfil de catador pode exigir aprovação administrativa antes de ficar visível publicamente.

### 6.4 Fluxo para Administrador

Para administrador, o sistema usa login separado por e-mail e senha.

Regras atuais:

- O admin acessa a tela `/admin/login`.
- A autenticação administrativa usa `POST /auth/admin/login`.
- A senha é armazenada como hash BCrypt em `users.password_hash`.
- O usuário administrativo permanece na tabela `users` com `role = ADMIN`.
- Depois do login, o admin é redirecionado para `/admin/dashboard`.
- Segundo fator pode ser adicionado no futuro.

### 6.5 Regras do OTP

- Código numérico de 6 dígitos.
- Expiração padrão: 5 minutos.
- Novo OTP invalida o anterior.
- OTP não pode ser reutilizado.
- Deve haver limite de tentativas.
- Deve haver tempo mínimo para reenvio.
- Em produção, o OTP nunca deve ser retornado na resposta da API.
- Em desenvolvimento, o OTP pode ser exibido/logado para facilitar testes.

### 6.6 Regras do JWT

O JWT deve conter:

- `userId`
- `role`
- `phone`
- `issuedAt`
- `expiresAt`

O token deve ser enviado pelo frontend no header:

```http
Authorization: Bearer <token>
```

---

## 7. Módulos Funcionais

### 7.1 Módulo de Pontos de Coleta

Responsável por:

- cadastrar pontos de coleta;
- listar pontos próximos;
- filtrar por tipo de material;
- exibir detalhes do ponto;
- manter localização geográfica.

Endpoints previstos:

- `GET /collection-points`
- `GET /collection-points/{id}`
- `POST /collection-points`
- `PUT /collection-points/{id}`
- `DELETE /collection-points/{id}`

### 7.2 Módulo de Agendamento

Responsável por:

- solicitar coleta;
- aceitar ou recusar solicitação;
- acompanhar status;
- registrar conclusão;
- cancelar agendamento.

Endpoints previstos:

- `POST /schedules`
- `GET /schedules`
- `GET /schedules/{id}`
- `PATCH /schedules/{id}/status`
- `DELETE /schedules/{id}`

### 7.3 Módulo de Relatórios e Dashboards

Responsável por:

- total de coletas realizadas;
- volume estimado por tipo de material;
- pontos de coleta mais usados;
- regiões com maior demanda;
- impacto ambiental estimado;
- taxa de conclusão/cancelamento de agendamentos.

Endpoints previstos:

- `GET /reports/impact`
- `GET /reports/collections`
- `GET /reports/schedules`
- `GET /reports/collection-points`

### 7.4 Módulo Educativo

Responsável por:

- dicas de reciclagem;
- guias por tipo de material;
- informações sobre coleta seletiva;
- conteúdo exibido no PWA.

No MVP, esse conteúdo pode permanecer estático no frontend.
No futuro, pode ser gerenciado via backend.

---

## 8. Endpoints Base do MVP

### 8.1 Health Check

```http
GET /health
```

Resposta:

```json
{
  "status": "ok"
}
```

### 8.2 Autenticação

Solicitar OTP:

```http
POST /auth/request-otp
```

Request:

```json
{
  "phone": "85999999999",
  "role": "COMMON_USER"
}
```

Validar OTP:

```http
POST /auth/verify-otp
```

Request:

```json
{
  "phone": "85999999999",
  "role": "COMMON_USER",
  "code": "123456"
}
```

Resposta esperada:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "phone": "85999999999",
    "role": "COMMON_USER",
    "name": "Nome do usuário",
    "profileComplete": true
  }
}
```

Completar cadastro:

```http
POST /auth/complete-profile
```

Requer JWT.

Login administrativo:

```http
POST /auth/admin/login
```

Request:

```json
{
  "email": "admin@coletaqui.local",
  "password": "admin123"
}
```

Resposta: mesmo formato de `AuthResponse`, com `role = ADMIN`.

---

## 9. Configuração de Ambientes

### 9.1 Desenvolvimento

Frontend Angular:

```text
http://localhost:4200
```

Backend:

```text
http://localhost:8080
```

Swagger/OpenAPI:

```text
http://localhost:8080/swagger-ui/index.html
http://localhost:8080/v3/api-docs
```

Banco:

```text
PostgreSQL local ou via Docker
```

### 9.2 Docker Compose

O ambiente containerizado é definido no arquivo `docker-compose.yml`.

Serviços:

- `frontend`: Angular PWA compilado e servido por Nginx.
- `backend`: API Java/Spring Boot.
- `db`: PostgreSQL com volume persistente.

Portas expostas:

```text
Frontend:   http://localhost:4200
Backend:    http://localhost:8080
PostgreSQL: localhost:5432
```

Comando principal:

```bash
docker compose up --build
```

### 9.3 Variáveis Backend

Variáveis sugeridas:

```text
DATABASE_URL=jdbc:postgresql://localhost:5432/coletaqui
DATABASE_USERNAME=coletaqui
DATABASE_PASSWORD=coletaqui
JWT_SECRET=alterar-em-producao
OTP_EXPIRATION_MINUTES=5
JPA_DDL_AUTO=update
APP_ADMIN_EMAIL=admin@coletaqui.local
APP_ADMIN_PASSWORD=admin123
APP_ADMIN_NAME=Administrador Coletaqui
APP_ADMIN_PHONE=00000000000
```

### 9.4 Produção

Recomendações:

- HTTPS obrigatório.
- Frontend hospedado como PWA e servido por Nginx ou plataforma equivalente.
- Backend exposto por API REST.
- PostgreSQL gerenciado ou containerizado conforme o ambiente.
- Secrets fora do repositório.

---

## 10. Segurança

Requisitos de segurança:

- JWT assinado com segredo forte.
- OTP armazenado em hash.
- OTP com expiração e limite de tentativas.
- Rate limit para solicitação de OTP.
- CORS restrito aos domínios permitidos.
- HTTPS em produção.
- Validação de entrada via DTOs.
- Não expor dados sensíveis nas respostas.
- Logs sem vazamento de OTP em produção.
- Swagger/OpenAPI em produção deve ser protegido, restrito ou desabilitado conforme o ambiente.

---

## 11. Logs, Auditoria e Observabilidade

Eventos importantes:

- solicitação de OTP;
- validação de OTP;
- falha de autenticação;
- criação de ponto de coleta;
- solicitação de agendamento;
- alteração de status de agendamento;
- conclusão de coleta;
- geração de relatórios.

No MVP, logs estruturados da aplicação são suficientes.
Em evolução futura, pode-se incluir métricas e rastreamento.

---

## 12. Evolução Planejada

Evoluções futuras:

- Integração com serviço real de SMS/WhatsApp para OTP.
- Mapa interativo com geolocalização.
- PostGIS para consultas geográficas avançadas.
- Painel administrativo.
- Dashboard de impacto ambiental.
- Ranking e recompensas.
- Notificações de status do agendamento.
- Gestão dinâmica de conteúdo educativo.

---

## 13. Decisões Arquiteturais Atuais

- Frontend principal será Angular PWA.
- Backend será Java/Spring Boot.
- Banco de dados será PostgreSQL.
- ORM será Spring Data JPA/Hibernate.
- Documentação da API será feita com Swagger/OpenAPI via springdoc-openapi.
- Autenticação de usuário comum e coletor será telefone + OTP + JWT.
- Autenticação administrativa será e-mail + senha + JWT.
- Fluxo recomendado de login/cadastro será unificado para reduzir fricção.
- Administrador deve ter autenticação mais forte que OTP simples.
- Conteúdo educativo pode iniciar estático no frontend e migrar para backend no futuro.

---

## 14. Atualizacao Arquitetural - Agendamentos e Indicadores

O modulo de agendamento atual expoe endpoints REST protegidos por JWT para usuario comum e coletor:

```http
POST /schedules
GET /schedules/me
GET /schedules/open
GET /schedules/collector
GET /schedules/{scheduleId}
POST /schedules/{scheduleId}/accept
POST /schedules/{scheduleId}/complete
POST /schedules/{scheduleId}/cancel
GET /schedules/impact
```

Regras principais:

- Usuario comum cria, consulta e cancela suas proprias solicitacoes.
- Coletor consulta solicitacoes abertas, aceita coletas e conclui apenas coletas sob sua responsabilidade quando estiver com `status = ACTIVE`.
- Coletor com `status = PENDING_APPROVAL` pode autenticar, mas deve permanecer em tela de cadastro em analise.
- Coletor com `status = BLOCKED` nao deve acessar as funcionalidades operacionais.
- O endpoint de detalhe valida permissao conforme perfil.
- O dashboard inicial de impacto usa dados de `schedules`, `schedule_materials`, `material_types` e `users`.

O frontend Angular possui telas para:

- Criar solicitacao de coleta.
- Consultar historico.
- Abrir detalhe da coleta.
- Cancelar solicitacao aberta.
- Listar solicitacoes abertas para coletor.
- Aceitar e concluir coletas.
- Visualizar indicadores do coletor em `/impact`.
- Manter `/ranking` como area de gamificacao para moradores.

---

## 15. Area Administrativa Desktop

O painel administrativo foi projetado para uso em navegador desktop, separado da experiencia mobile-first de usuario comum e coletor.

Rotas frontend:

```text
/admin/login
/admin/dashboard
/admin/collectors
/admin/users
/admin/schedules
```

Endpoints backend:

```http
GET /admin/summary
GET /admin/impact
GET /admin/users
GET /admin/collectors/pending
POST /admin/collectors/{collectorId}/approve
POST /admin/users/{targetUserId}/block
GET /admin/schedules
```

Permissoes:

- Apenas usuarios com role `ADMIN` devem acessar `/admin/dashboard` e demais rotas administrativas.
- Admin sem sessao deve ser redirecionado para `/admin/login`.
- Usuario comum e coletor nao devem acessar o painel administrativo.
- O painel administrativo usa layout desktop com menu lateral.
- Admin visualiza indicadores gerais da plataforma.
- Admin pode aprovar, bloquear e reativar coletores.
- Admin pode consultar usuarios e coletas.
- Admin pode filtrar coletas por status, material, bairro e coletor, alem de exportar CSV.
- Admin pode gerenciar materiais aceitos.
- Admin pode gerenciar pontos fixos de recebimento.
- Dashboard admin exibe graficos de coletas por status, materiais mais coletados e bairros com maior demanda.

Evolucao recomendada:

- Segundo fator para administradores.
- Exportacao CSV/PDF de relatorios.
- Gestao completa de pontos de recebimento e materiais.
