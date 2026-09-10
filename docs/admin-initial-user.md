# Admin inicial

O painel administrativo do Coletaqui é acessado por e-mail e senha em:

```text
http://localhost:4200/admin/login
```

Diferente de moradores e coletores, o administrador não usa OTP via SMS. Por isso, o sistema precisa ter pelo menos um usuário com:

- `role = ADMIN`;
- `status = ACTIVE`;
- `profile_complete = true`;
- `email` preenchido;
- `password_hash` salvo em BCrypt.

## Criação automática pelo backend

O backend possui um seed seguro para criar o primeiro admin quando a aplicação inicia.

Para usar, informe as variáveis abaixo no ambiente do backend:

```text
APP_ADMIN_EMAIL=admin@seudominio.com
APP_ADMIN_PASSWORD=uma-senha-forte
APP_ADMIN_NAME=Administrador Coletaqui
APP_ADMIN_PHONE=00000000000
```

Regras importantes:

- se `APP_ADMIN_EMAIL` e `APP_ADMIN_PASSWORD` não forem informados, nenhum admin é criado automaticamente;
- as duas variáveis devem ser informadas juntas;
- a senha precisa ter pelo menos 8 caracteres;
- a senha é gravada no banco como BCrypt em `password_hash`;
- se o admin com o mesmo e-mail já existir e já tiver senha, o seed não sobrescreve a senha;
- após o primeiro acesso, a senha pode ser alterada em `Admin > Minha conta`.

## Docker Compose

No ambiente local, as variáveis podem ser passadas antes de subir os containers:

```powershell
$env:APP_ADMIN_EMAIL="admin@seudominio.com"
$env:APP_ADMIN_PASSWORD="uma-senha-forte"
$env:APP_ADMIN_NAME="Administrador Coletaqui"
$env:APP_ADMIN_PHONE="00000000000"
docker compose up --build
```

Ou podem ser adicionadas ao ambiente do serviço `backend` no `docker-compose.yml` durante testes locais.

## Admin já existente

Se já existe um usuário admin no banco, não é necessário recriar.

Use o login atual em `/admin/login`. Para alterar a senha, entre no painel e acesse:

```text
Admin > Minha conta
```

## Produção

Em produção:

- não use senha simples ou padrão;
- mantenha `APP_ADMIN_PASSWORD` fora do repositório;
- remova a variável de senha após criar o admin, se a plataforma de hospedagem permitir;
- mantenha pelo menos um segundo admin de confiança antes de bloquear ou remover o primeiro.
