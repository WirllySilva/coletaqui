# OTP via SMS com Twilio Verify

O Coletaqui usa OTP para login/cadastro de moradores e coletores.

Em desenvolvimento, o código pode aparecer no retorno da API quando `OTP_EXPOSE_DEV_CODE=true`. Em produção, o código deve ser enviado por SMS e não deve aparecer no front.

## Escolha técnica

Para OTP via SMS, a integração recomendada é **Twilio Verify com canal `sms`**.

Motivos:

- é próprio para verificação por código;
- usa fluxo de OTP gerenciado pela Twilio;
- não depende de Meta Business, CNPJ, WhatsApp Sender ou templates aprovados;
- mantém o backend simples;
- permite voltar para WhatsApp depois, trocando `TWILIO_VERIFY_CHANNEL`.

## O que criar na Twilio

1. Criar ou manter uma conta Twilio.
2. Criar um **Verify Service**.
3. Obter:
   - `Account SID`;
   - `Auth Token`;
   - `Verify Service SID`.

Não é necessário configurar WhatsApp Sender para o envio de OTP por SMS.

## Variáveis de ambiente

Configure no backend:

```text
TWILIO_VERIFY_ENABLED=true
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_VERIFY_CHANNEL=sms
TWILIO_VERIFY_LOCALE=auto
OTP_CHANNEL=SMS
OTP_EXPOSE_DEV_CODE=false
```

Para desenvolvimento sem Twilio:

```text
TWILIO_VERIFY_ENABLED=false
OTP_EXPOSE_DEV_CODE=true
```

## Docker local

Coloque esses valores no `.env` local antes de subir os containers:

```text
TWILIO_VERIFY_ENABLED=true
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_VERIFY_CHANNEL=sms
TWILIO_VERIFY_LOCALE=auto
OTP_CHANNEL=SMS
OTP_EXPOSE_DEV_CODE=false
```

O `.env` está no `.gitignore` e não deve ser enviado para o GitHub.

## Como funciona no Coletaqui

1. Usuário informa telefone.
2. Backend normaliza para telefone brasileiro.
3. Backend inicia uma verificação na Twilio Verify usando `Channel=sms`.
4. Twilio gera e envia o código por SMS.
5. Usuário digita o código recebido.
6. Backend valida o código na Twilio Verify e emite JWT.

## Teste manual

Com o backend rodando:

1. Acesse `http://localhost:4200`.
2. Clique em `Entrar ou criar conta`.
3. Escolha morador ou coletor.
4. Informe um telefone válido.
5. Confirme se o SMS chegou.
6. Digite o código recebido.

## Checklist para produção

- `TWILIO_VERIFY_ENABLED=true`;
- `TWILIO_VERIFY_CHANNEL=sms`;
- `OTP_CHANNEL=SMS`;
- `OTP_EXPOSE_DEV_CODE=false`;
- `TWILIO_ACCOUNT_SID` configurado;
- `TWILIO_AUTH_TOKEN` configurado como segredo;
- `TWILIO_VERIFY_SERVICE_SID` configurado;
- testar com pelo menos um número real antes de divulgar para a comunidade;
- não registrar OTP, token ou senha em logs de produção.
