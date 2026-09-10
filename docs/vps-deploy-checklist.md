# Checklist de Deploy em VPS

Este checklist descreve o caminho recomendado para publicar o Coletaqui em uma VPS usando Docker Compose, Caddy e HTTPS automático.

## 1. Comprar o domínio

Domínio recomendado:

```text
coletaquiaracoiaba.com.br
```

Depois da compra, guarde o acesso ao painel DNS. Ele será usado para apontar o domínio para a VPS.

## 2. Contratar a VPS

Configuração mínima recomendada:

```text
Sistema: Ubuntu 24.04 LTS
CPU: 1 vCPU
RAM: 2 GB
Disco: 25 GB ou mais
```

Ao criar a VPS, anote:

```text
IP público da VPS
Usuário SSH
Senha ou chave SSH
```

## 3. Apontar DNS

No painel do domínio, crie:

```text
Tipo: A
Nome: @
Valor: IP_DA_VPS

Tipo: A
Nome: www
Valor: IP_DA_VPS
```

Aguarde a propagação. Normalmente leva de alguns minutos a algumas horas.

## 4. Acessar a VPS

No seu computador:

```bash
ssh root@IP_DA_VPS
```

## 5. Instalar Docker na VPS

Na VPS:

```bash
apt update
apt upgrade -y
apt install -y ca-certificates curl git
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Teste:

```bash
docker --version
docker compose version
```

## 6. Clonar o projeto

Na VPS:

```bash
mkdir -p /opt/coletaqui
cd /opt
git clone https://github.com/WirllySilva/coletaqui.git coletaqui
cd /opt/coletaqui
```

Para atualizar no futuro:

```bash
cd /opt/coletaqui
git pull
```

## 7. Criar o .env de produção

Na VPS:

```bash
cp .env.example .env
nano .env
```

Para gerar chaves VAPID na VPS, rode:

```bash
docker run --rm node:22-alpine node -e "const crypto=require('crypto');const ecdh=crypto.createECDH('prime256v1');ecdh.generateKeys();const b64u=b=>b.toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');console.log('VAPID_PUBLIC_KEY='+b64u(ecdh.getPublicKey()));console.log('VAPID_PRIVATE_KEY='+b64u(ecdh.getPrivateKey()));"
```

Copie os dois valores gerados para o `.env`. A chave privada é segredo e não deve ir para o GitHub.

Preencha principalmente:

```text
CADDY_SITE_ADDRESS=coletaquiaracoiaba.com.br, www.coletaquiaracoiaba.com.br
POSTGRES_PASSWORD=senha-forte-do-banco
JWT_SECRET=chave-grande-e-aleatoria
JWT_EXPIRATION_MINUTES=5256000

TWILIO_VERIFY_ENABLED=true
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_VERIFY_SERVICE_SID=VA...
TWILIO_VERIFY_CHANNEL=sms
TWILIO_VERIFY_LOCALE=auto
OTP_CHANNEL=SMS
OTP_EXPOSE_DEV_CODE=false

APP_ADMIN_EMAIL=...
APP_ADMIN_PASSWORD=...
APP_ADMIN_NAME=Administrador Coletaqui
APP_ADMIN_PHONE=...

VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:...
```

Nunca envie o `.env` real para o GitHub.

## 8. Liberar firewall

Se a VPS usar UFW:

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status
```

## 9. Subir produção

Na VPS:

```bash
cd /opt/coletaqui
docker compose -f docker-compose.prod.yml up -d --build
```

Ver status:

```bash
docker compose -f docker-compose.prod.yml ps
```

Ver logs:

```bash
docker compose -f docker-compose.prod.yml logs -f
```

## 10. Testar

Abra:

```text
https://coletaquiaracoiaba.com.br
```

Teste:

- login por SMS;
- login do admin;
- cadastro de usuário comum;
- cadastro de coletor;
- upload de foto;
- instalação como PWA;
- ativação de notificações push.

## 11. Atualizar produção depois

Na VPS:

```bash
cd /opt/coletaqui
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

## 12. Backup mínimo

Antes de divulgar para a comunidade, defina backup do PostgreSQL.

Backup manual:

```bash
cd /opt/coletaqui
docker compose -f docker-compose.prod.yml exec -T db pg_dump -U coletaqui coletaqui > backup-coletaqui.sql
```

Guarde o backup fora da VPS.
