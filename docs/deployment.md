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
POSTGRES_PASSWORD=coletaqui
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
```

## Produção

Checklist mínimo:

- configurar HTTPS;
- trocar `JWT_SECRET`;
- trocar senha admin padrão;
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
