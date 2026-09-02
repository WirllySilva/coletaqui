# Deploy e Operação

Projeto: Coletaqui Araçoiaba  
Data: 2026-07-08

## Ambiente Local com Docker

Subir tudo:

```bash
docker compose up --build
```

Serviços:

```text
frontend -> http://localhost:4200
backend  -> http://localhost:8080
db       -> localhost:5432
```

Swagger:

```text
http://localhost:8080/swagger-ui/index.html
```

Parar:

```bash
docker compose down
```

Remover banco local:

```bash
docker compose down -v
```

## Serviços Docker

### db

PostgreSQL com volume persistente:

```text
postgres_data:/var/lib/postgresql/data
```

Credenciais locais padrão:

```text
POSTGRES_DB=coletaqui
POSTGRES_USER=coletaqui
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-coletaqui}
```

### backend

API Java/Spring Boot.

Conecta ao banco interno por:

```text
DATABASE_URL=jdbc:postgresql://db:5432/coletaqui
```

### frontend

Angular compilado e servido por Nginx.

O Nginx encaminha:

- `/api` para o backend;
- `/uploads` para o backend.

## Uploads de Fotos

Em desenvolvimento, fotos temporárias de plantio usam volume Docker:

```text
backend_uploads:/app/uploads
```

Variáveis:

```text
UPLOAD_LOCAL_DIR=/app/uploads/tree-plantings
UPLOAD_PUBLIC_BASE_URL=/uploads/tree-plantings
```

Em produção, recomenda-se storage externo.

## Supabase Storage Opcional

Para usar Supabase Storage:

```text
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=chave-service-role
SUPABASE_TREE_BUCKET=tree-plantings
```

Observações:

- usar bucket próprio para evidências de plantio;
- manter service key fora do repositório;
- remover fotos após validação/rejeição, como já previsto no backend.

## Variáveis Importantes

```text
DATABASE_URL
DATABASE_USERNAME
DATABASE_PASSWORD
JWT_SECRET
JWT_EXPIRATION_MINUTES
OTP_EXPIRATION_MINUTES
OTP_MAX_ATTEMPTS
OTP_EXPOSE_DEV_CODE
TWILIO_VERIFY_ENABLED
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_VERIFY_SERVICE_SID
TWILIO_VERIFY_LOCALE
JPA_DDL_AUTO
APP_ADMIN_EMAIL
APP_ADMIN_PASSWORD
APP_ADMIN_NAME
APP_ADMIN_PHONE
UPLOAD_LOCAL_DIR
UPLOAD_PUBLIC_BASE_URL
SUPABASE_URL
SUPABASE_SERVICE_KEY
SUPABASE_TREE_BUCKET
VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
VAPID_SUBJECT
```

Use `.env.example` como modelo para criar um `.env` local ou configurar variáveis no serviço de hospedagem. O `.env` real não deve ser enviado para o GitHub.

## Admin Inicial

O backend pode criar o primeiro administrador automaticamente quando iniciar, desde que as variáveis abaixo sejam informadas:

```text
APP_ADMIN_EMAIL
APP_ADMIN_PASSWORD
APP_ADMIN_NAME
APP_ADMIN_PHONE
```

Por segurança, o sistema não cria admin com senha padrão. Se `APP_ADMIN_EMAIL` e `APP_ADMIN_PASSWORD` não forem informados, nenhum novo admin é criado.

Detalhes do processo estão em [Admin inicial](admin-initial-user.md).

## Backup e Restore

Antes de usar o sistema com dados reais, defina uma rotina de backup do PostgreSQL.

O procedimento local com Docker e as recomendações para produção estão em [Backup e restore](backup-restore.md).

Pontos importantes:

- nunca versionar backups no GitHub;
- testar restore em ambiente separado;
- proteger backups porque eles contêm dados pessoais;
- configurar backup automático na hospedagem quando possível.

## OTP via WhatsApp

Em produção, o envio real de OTP por WhatsApp deve ser ativado com Twilio Verify.

Guia completo: [OTP via WhatsApp com Twilio Verify](whatsapp-otp.md).

Variáveis principais:

```text
TWILIO_VERIFY_ENABLED=true
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_VERIFY_SERVICE_SID
OTP_EXPOSE_DEV_CODE=false
```

## PWA e Notificações Push

O frontend é servido por Nginx com o service worker real do Angular. Isso é necessário para instalação como PWA, cache controlado pelo Angular e notificações push.

Para limpar um service worker antigo em teste local, acesse uma vez:

```text
http://localhost:4200/?clear-sw=1
```

Depois recarregue normalmente sem esse parâmetro.

As notificações push precisam de:

```text
VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
VAPID_SUBJECT
```

Em produção, gere chaves VAPID próprias e mantenha a chave privada apenas nas variáveis do backend. O navegador só recebe a chave pública.

## Produção

Checklist mínimo:

- configurar HTTPS;
- trocar `JWT_SECRET`;
- gerar e configurar chaves VAPID definitivas;
- criar o admin inicial com senha forte;
- usar credenciais fortes no PostgreSQL;
- definir `OTP_EXPOSE_DEV_CODE=false`;
- configurar serviço real de envio WhatsApp;
- revisar Termos de Uso e Política de Privacidade;
- configurar backups do PostgreSQL;
- usar migrations com Flyway ou Liquibase;
- avaliar restrição de Swagger em produção;
- monitorar logs sem expor dados sensíveis.

## Acesso por Celular em Rede Local

Para testar no celular:

1. computador e celular na mesma rede;
2. liberar porta `4200` no firewall;
3. acessar `http://IP_DO_COMPUTADOR:4200`.

Limitação:

- GPS do navegador geralmente exige HTTPS. Em teste por IP local, o botão de localização pode não funcionar.

## Banco no DBeaver

Configuração local padrão:

```text
Host: 127.0.0.1
Porta: 5432
Database: coletaqui
Usuário: coletaqui
Senha: coletaqui
```

No Docker, o nome interno do serviço é `db`, mas ferramentas externas como DBeaver devem usar `127.0.0.1` ou `localhost`.
