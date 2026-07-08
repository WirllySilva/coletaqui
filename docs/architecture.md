# Arquitetura

Projeto: Coletaqui Araçoiaba  
Versão: 3.0  
Data: 2026-07-08

## Visão Geral

O Coletaqui Araçoiaba é uma aplicação PWA voltada à educação ambiental, mapeamento de pontos de coleta, agendamento de coleta domiciliar, confirmação de entregas, ranking comunitário, plantio de árvores e análise de impacto.

A experiência principal de morador e coletor é mobile-first. A experiência administrativa é pensada para navegador desktop.

## Componentes

```text
Usuário/Coletor/Admin
        |
        v
Frontend Angular PWA
        |
        | /api
        v
Backend Spring Boot
        |
        v
PostgreSQL
```

No Docker, o frontend é servido por Nginx. O Nginx também encaminha:

- `/api/*` para o backend;
- `/uploads/*` para arquivos temporários servidos pelo backend.

## Frontend

Tecnologias:

- Angular
- Angular Router
- Angular Service Worker
- Bootstrap
- Bootstrap Icons
- Leaflet/OpenStreetMap
- TypeScript

Organização principal:

```text
frontend/src/app/
  components/
    header/
    footer/
  pages/
    auth/
    home/
    collection-points/
    collection-point-delivery/
    collectors/
    collector-home/
    collector-drop-offs/
    plant-a-tree/
    plant-a-tree-register/
    user-impact/
    ranking/
    legal/
    admin/
  services/
  guards/
  app.routes.ts
```

Rotas importantes:

- `/`: tela inicial.
- `/commonuserloginpage`: entrada de morador por OTP.
- `/collectorloginpage`: entrada de coletor por OTP.
- `/home`: home do morador.
- `/collector-home`: home do coletor.
- `/collection-points`: mapa/listagem de pontos fixos.
- `/collection-points/:pointId/delivery`: registro de entrega em ponto.
- `/schedule-options`: escolha entre pontos, coletores e agendamento.
- `/user-impact`: impacto pessoal do morador.
- `/plantatree`: informações e mapa de árvores.
- `/plantatree/register`: registro de plantio.
- `/terms`: Termos de Uso.
- `/privacy`: Política de Privacidade.
- `/admin/login`: login administrativo.
- `/admin/dashboard`: painel administrativo.

## Backend

Tecnologias:

- Java 17
- Spring Boot
- Spring Web MVC
- Spring Security
- Spring Validation
- Spring Data JPA
- Hibernate
- PostgreSQL
- springdoc-openapi

Pacotes principais:

```text
backend/src/main/java/br/com/coletaqui/backend/
  admin/
  auth/
  collectionpoint/
  collectionpointdelivery/
  common/
  config/
  dropoff/
  material/
  schedule/
  tree/
  user/
  userimpact/
```

Responsabilidades:

- `auth`: OTP, login administrativo, JWT e completar cadastro.
- `user`: usuários, papéis, status e perfil.
- `material`: catálogo de materiais.
- `collectionpoint`: pontos fixos de coleta.
- `collectionpointdelivery`: entregas registradas em pontos fixos.
- `dropoff`: confirmação de entregas avulsas pelo coletor/ponto.
- `schedule`: agendamentos de coleta domiciliar.
- `tree`: registros de plantio de árvores e validação administrativa.
- `admin`: consultas e ações administrativas.
- `userimpact`: consolidação do impacto pessoal do morador.

## Autenticação

Morador e coletor:

1. Informa telefone.
2. Backend normaliza o número.
3. Backend gera OTP de 6 dígitos.
4. OTP é enviado pelo canal WhatsApp.
5. Usuário informa o código.
6. Backend valida OTP e emite JWT.
7. Se o perfil estiver incompleto, o usuário completa cadastro.
8. O aceite dos termos e da política de privacidade é obrigatório no cadastro.

Administrador:

1. Acessa `/admin/login`.
2. Informa e-mail e senha.
3. Backend valida `role = ADMIN`, status ativo e senha BCrypt.
4. Backend emite JWT.
5. Frontend libera rotas administrativas.

## Autorização

Papéis:

- `COMMON_USER`
- `COLLECTOR`
- `ADMIN`

Status:

- `ACTIVE`
- `PENDING_APPROVAL`
- `INACTIVE`
- `BLOCKED`

Regras principais:

- Coletor pendente não acessa solicitações, agenda ou impacto operacional.
- Coletor bloqueado não acessa operação.
- Admin acessa apenas rotas administrativas.
- Usuário comum acessa home, pontos, agendamentos, impacto, ranking e árvores.

## Fluxos Funcionais

### Pontos de Coleta

- Admin cadastra ponto fixo.
- Ponto pode ter materiais aceitos, endereço, latitude/longitude, dias e horários.
- Admin informa telefone do responsável.
- O sistema cria/vincula um usuário coletor responsável pelo ponto.
- Morador visualiza pontos no mapa.
- Morador registra entrega no ponto.
- Responsável pelo ponto confirma a entrega.

### Agendamento Domiciliar

- Morador solicita coleta domiciliar.
- Coletor ativo visualiza solicitações abertas.
- Coletor aceita solicitação.
- Coletor conclui coleta.
- O histórico aparece para morador e coletor.

### Impacto e Ranking

- Coletas domiciliares concluídas e entregas em pontos entram no impacto.
- Morador visualiza sua página de impacto.
- Ranking usa pontuação por participação e materiais.
- Admin visualiza ranking geral.

### Plante uma Árvore

- Morador acessa página educativa.
- Morador registra plantio com espécie, local, foto e GPS opcional.
- Admin valida ou rejeita.
- Ao rejeitar, admin informa motivo.
- Foto é removida após validação/rejeição.
- Árvores validadas aparecem no mapa de Araçoiaba.

## Uploads e Fotos

Fotos de plantio são evidências temporárias.

Em desenvolvimento:

- backend salva em volume local Docker;
- frontend acessa via `/uploads`.

Em produção:

- recomenda-se storage externo, como Supabase Storage ou S3 compatível;
- as credenciais devem ficar fora do repositório;
- a foto deve ser removida após validação/rejeição.

## API e Swagger

Swagger UI:

```text
http://localhost:8080/swagger-ui/index.html
```

OpenAPI:

```text
http://localhost:8080/v3/api-docs
```

Rotas protegidas usam:

```http
Authorization: Bearer <token>
```

## Banco de Dados

Banco: PostgreSQL  
ORM: Spring Data JPA/Hibernate

Em desenvolvimento, `JPA_DDL_AUTO=update` atualiza o schema. Para produção, recomenda-se Flyway ou Liquibase.

## Docker

Serviços:

- `db`: PostgreSQL.
- `backend`: API Spring Boot.
- `frontend`: Angular compilado servido por Nginx.

Comando:

```bash
docker compose up --build
```

## Segurança e LGPD

Medidas atuais:

- OTP armazenado como hash.
- OTP expira e tem limite de tentativas.
- JWT assinado.
- Senha admin com BCrypt.
- Perfis protegidos por guards no frontend e filtros no backend.
- Aceite de Termos de Uso e Política de Privacidade salvo no usuário.
- Fotos de plantio removidas após validação/rejeição.

Recomendações para produção:

- HTTPS obrigatório.
- Segredo JWT forte.
- Credenciais fora do repositório.
- Rate limit para OTP.
- Revisão jurídica dos termos.
- Migrations versionadas.
- Monitoramento e logs sem dados sensíveis.
