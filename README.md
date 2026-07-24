# Coletaqui Araçoiaba

PWA comunitário para apoiar educação ambiental, coleta seletiva, agendamento de coletas recicláveis, pontos de entrega, ranking de engajamento, plantio de árvores e análise de impacto ambiental em Araçoiaba/PE.

## Sobre

O Coletaqui faz parte de uma atividade extensionista e foi pensado para uso real na comunidade.

Objetivos principais:

1. Mapear pontos de coleta de recicláveis, óleo de cozinha usado, pilhas e baterias.
2. Permitir agendamento de coleta domiciliar de recicláveis.
3. Disponibilizar relatórios, ranking e dashboards para análise de impacto e eficácia da plataforma.

## Stack

Frontend:

- Angular
- Angular Router
- Angular Service Worker
- TypeScript
- Bootstrap e Bootstrap Icons
- Leaflet/OpenStreetMap
- PWA mobile-first para morador/coletor
- Painel administrativo responsivo com foco em desktop

Backend:

- Java 17
- Spring Boot
- Spring Web MVC
- Spring Security
- Spring Validation
- Spring Data JPA/Hibernate
- Swagger/OpenAPI com springdoc-openapi
- JWT

Banco e infraestrutura:

- PostgreSQL
- Docker e Docker Compose
- Nginx servindo o frontend Angular e proxy para `/api` e `/uploads`
- Upload local com volume Docker para desenvolvimento
- Suporte opcional a Supabase Storage para fotos de validação de plantio

## Estrutura

```text
coletaqui/
  backend/          API Java/Spring Boot
  frontend/         Angular PWA
  docs/             documentação técnica e funcional
  docker-compose.yml
  README.md
```

## Como Rodar com Docker

```bash
docker compose up --build
```

Serviços:

```text
Frontend:   http://localhost:4200
Backend:    http://localhost:8080
Swagger:    http://localhost:8080/swagger-ui/index.html
OpenAPI:    http://localhost:8080/v3/api-docs
PostgreSQL: localhost:5432
```

Painel administrativo:

```text
URL:   http://localhost:4200/admin/login
```

O admin inicial deve ser criado por variáveis de ambiente seguras. Veja o passo a passo em [Admin inicial](docs/admin-initial-user.md).

Parar containers:

```bash
docker compose down
```

Parar e remover dados locais do banco:

```bash
docker compose down -v
```

## Como Rodar sem Docker

Frontend:

```bash
cd frontend
npm install
npm start
```

Backend:

```bash
cd backend
mvnw.cmd spring-boot:run
```

O backend espera um PostgreSQL disponível com as variáveis configuradas.

## Variáveis de Ambiente

Principais variáveis do backend:

```text
DATABASE_URL=jdbc:postgresql://localhost:5432/coletaqui
DATABASE_USERNAME=coletaqui
DATABASE_PASSWORD=coletaqui
JWT_SECRET=alterar-em-producao
JWT_EXPIRATION_MINUTES=1440
OTP_EXPIRATION_MINUTES=5
OTP_MAX_ATTEMPTS=5
OTP_EXPOSE_DEV_CODE=true
TWILIO_VERIFY_ENABLED=false
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_VERIFY_SERVICE_SID=
TWILIO_VERIFY_LOCALE=pt-BR
JPA_DDL_AUTO=update
APP_ADMIN_EMAIL=admin@seudominio.com
APP_ADMIN_PASSWORD=defina-uma-senha-forte
APP_ADMIN_NAME=Administrador Coletaqui
APP_ADMIN_PHONE=00000000000
UPLOAD_LOCAL_DIR=uploads/tree-plantings
UPLOAD_PUBLIC_BASE_URL=/uploads/tree-plantings
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
SUPABASE_TREE_BUCKET=tree-plantings
```

Em produção:

- usar HTTPS;
- trocar `JWT_SECRET`;
- configurar o admin inicial com senha forte;
- desativar exposição de OTP de desenvolvimento;
- configurar Twilio Verify para OTP via WhatsApp;
- usar migrations em vez de depender de `ddl-auto=update`;
- definir rotina de backup e restore do banco;
- configurar armazenamento externo para fotos temporárias, se necessário.

## Funcionalidades Implementadas

Autenticação:

- Login/cadastro de usuário comum por telefone e OTP via WhatsApp.
- Login/cadastro de coletor por telefone e OTP via WhatsApp.
- Login administrativo por e-mail e senha.
- JWT para rotas protegidas.
- Aceite obrigatório de Termos de Uso e Política de Privacidade ao completar cadastro.

Usuário comum:

- Home mobile-first.
- Guias educativos de separação de materiais.
- Consulta de coletores.
- Consulta de pontos de coleta em mapa.
- Registro de entrega em ponto de coleta.
- Agendamento de coleta domiciliar.
- Histórico de solicitações.
- Página de impacto pessoal.
- Ranking comunitário.
- Página “Plante uma árvore” com mapa de árvores validadas.
- Registro de plantio com foto e localização GPS opcional.

Coletor/ponto de coleta:

- Home própria com paleta visual distinta.
- Cadastro com tipo de atendimento.
- Aprovação administrativa antes de operar.
- Visualização de solicitações abertas.
- Aceite e conclusão de coletas domiciliares.
- Confirmação de entregas em pontos de coleta.
- Dashboard de impacto do coletor.

Administrador:

- Painel desktop.
- Dashboard geral.
- Gestão de usuários e coletores.
- Aprovação, bloqueio e reativação de coletores.
- Gestão de materiais.
- Gestão de pontos de coleta.
- Ranking administrativo.
- Gestão de árvores plantadas com validação/rejeição e motivo da rejeição.
- Indicadores de coletas, entregas e árvores.

LGPD e privacidade:

- Páginas `/terms` e `/privacy`.
- Documentos em `docs/terms-of-use.md` e `docs/privacy-policy.md`.
- Registro de data e versão de aceite no usuário.
- Foto de plantio tratada como evidência temporária e removida após validação/rejeição.

## Documentação

Arquivos principais:

- [Arquitetura](docs/architecture.md)
- [Manual Geral e Fluxograma](docs/system-manual.md)
- [Requisitos](docs/requirements.md)
- [Banco de Dados](docs/database.md)
- [API e Rotas](docs/api-overview.md)
- [Deploy e Operação](docs/deployment.md)
- [Backup e Restore](docs/backup-restore.md)
- [OTP via WhatsApp](docs/whatsapp-otp.md)
- [Termos de Uso](docs/terms-of-use.md)
- [Política de Privacidade](docs/privacy-policy.md)

## Licença

Este projeto está sob a licença [Apache 2.0](./LICENSE).

## Desenvolvedor

Feito por **Wirlly Silva**.

[LinkedIn](https://linkedin.com/in/wirlly-pereira/) | [GitHub](https://github.com/WirllySilva)
