# OTP via WhatsApp com Twilio Verify

O Coletaqui usa OTP para login/cadastro de moradores e coletores.

Em desenvolvimento, o código pode aparecer no retorno da API quando `OTP_EXPOSE_DEV_CODE=true`. Em produção, o código deve ser enviado por WhatsApp e não deve aparecer no front.

## Escolha técnica

Para OTP via WhatsApp, a integração recomendada é **Twilio Verify com canal `whatsapp`**.

Motivos:

- é próprio para verificação por código;
- usa fluxo de OTP;
- permite canal WhatsApp;
- reduz necessidade de criar manualmente templates de mensagem para cada envio;
- mantém o backend simples.

## O que criar na Twilio

1. Criar uma conta na Twilio.
2. Criar um **Verify Service**.
3. Configurar WhatsApp no Verify.
4. Obter:
   - `Account SID`;
   - `Auth Token`;
   - `Verify Service SID`.

Observação importante:

A Twilio informa que, para WhatsApp OTP, é necessário usar um WhatsApp Sender próprio associado à marca/negócio. Então, para produção, será preciso concluir a configuração do remetente WhatsApp na Twilio.

## Variáveis de ambiente

Configure no backend:

```text
TWILIO_VERIFY_ENABLED=true
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_VERIFY_LOCALE=pt-BR
OTP_EXPOSE_DEV_CODE=false
```

Para desenvolvimento sem Twilio:

```text
TWILIO_VERIFY_ENABLED=false
OTP_EXPOSE_DEV_CODE=true
```

## Docker local

No PowerShell, antes de subir os containers:

```powershell
$env:TWILIO_VERIFY_ENABLED="true"
$env:TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$env:TWILIO_AUTH_TOKEN="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$env:TWILIO_VERIFY_SERVICE_SID="VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$env:TWILIO_VERIFY_LOCALE="pt-BR"
$env:OTP_EXPOSE_DEV_CODE="false"
docker compose up --build
```

Ou coloque esses valores em um `.env` local. O `.env` está no `.gitignore` e não deve ser enviado para o GitHub.

## Como funciona no Coletaqui

1. Usuário informa telefone.
2. Backend normaliza para telefone brasileiro.
3. Backend gera um OTP de 6 dígitos.
4. Backend salva apenas o hash do OTP no banco.
5. Backend envia o mesmo código pela Twilio Verify usando `Channel=whatsapp`.
6. Usuário digita o código recebido.
7. Backend valida o código localmente e emite JWT.

## Teste manual

Com o backend rodando:

1. Acesse `http://localhost:4200`.
2. Clique em `Entrar ou criar conta`.
3. Escolha morador ou coletor.
4. Informe um telefone válido.
5. Confirme se a mensagem chegou no WhatsApp.
6. Digite o código recebido.

## Checklist para produção

- `TWILIO_VERIFY_ENABLED=true`;
- `OTP_EXPOSE_DEV_CODE=false`;
- `TWILIO_ACCOUNT_SID` configurado;
- `TWILIO_AUTH_TOKEN` configurado como segredo;
- `TWILIO_VERIFY_SERVICE_SID` configurado;
- WhatsApp Sender aprovado/configurado na Twilio;
- testar com pelo menos um número real antes de divulgar para a comunidade;
- não registrar OTP, token ou senha em logs de produção.
