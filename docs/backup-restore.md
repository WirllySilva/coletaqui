# Backup e restore

Este documento explica como salvar e restaurar os dados do Coletaqui.

O backup é importante porque o banco guarda dados reais da comunidade:

- usuários;
- coletores;
- administradores;
- pontos de coleta;
- solicitações de coleta;
- entregas em pontos;
- ranking;
- registros de árvores plantadas;
- termos e aceites LGPD.

## O que precisa ser salvo

### Banco PostgreSQL

É o item principal. Guarda quase todos os dados do sistema.

### Uploads

Em desenvolvimento, fotos de plantio usam o volume Docker:

```text
backend_uploads
```

Em produção, se as fotos forem enviadas para Supabase Storage, o backup dos arquivos deve seguir a estratégia do Supabase. O banco continuará guardando os registros e links.

## Pasta local de backups

Crie uma pasta local chamada `backups` na raiz do projeto:

```powershell
mkdir backups
```

Essa pasta está no `.gitignore` e não deve ser enviada para o GitHub.

## Backup local do banco com Docker

Com os containers rodando, execute:

```powershell
docker compose exec -T db pg_dump -U coletaqui -d coletaqui -Fc -f /tmp/coletaqui.dump
docker compose cp db:/tmp/coletaqui.dump ./backups/coletaqui.dump
docker compose exec -T db rm /tmp/coletaqui.dump
```

Para organizar melhor, renomeie o arquivo com data:

```text
backups/coletaqui-2026-07-09.dump
```

O formato `.dump` é o formato customizado do PostgreSQL e deve ser restaurado com `pg_restore`.

## Restore local do banco com Docker

Atenção: restore pode sobrescrever dados existentes.

Antes de restaurar, confirme que o arquivo está em `backups`.

Exemplo:

```text
backups/coletaqui-2026-07-09.dump
```

Copie o arquivo para o container:

```powershell
docker compose cp ./backups/coletaqui-2026-07-09.dump db:/tmp/coletaqui.dump
```

Restaure:

```powershell
docker compose exec -T db pg_restore -U coletaqui -d coletaqui --clean --if-exists /tmp/coletaqui.dump
```

Remova o arquivo temporário do container:

```powershell
docker compose exec -T db rm /tmp/coletaqui.dump
```

Depois do restore, reinicie backend e frontend:

```powershell
docker compose restart backend frontend
```

## Backup dos uploads locais

Se estiver usando o volume local `backend_uploads`, gere um arquivo `.tar.gz`:

```powershell
docker run --rm -v coletaqui_backend_uploads:/data -v ${PWD}/backups:/backup alpine tar czf /backup/coletaqui-uploads.tar.gz -C /data .
```

## Restore dos uploads locais

Atenção: este comando restaura os arquivos dentro do volume `backend_uploads`.

```powershell
docker run --rm -v coletaqui_backend_uploads:/data -v ${PWD}/backups:/backup alpine sh -c "rm -rf /data/* && tar xzf /backup/coletaqui-uploads.tar.gz -C /data"
```

Depois:

```powershell
docker compose restart backend
```

## Frequência recomendada

Para desenvolvimento:

- backup manual antes de mudanças grandes;
- backup antes de testar restore, migrations ou alterações no modelo do banco.

Para produção:

- backup diário do banco;
- guardar pelo menos os últimos 7 backups diários;
- guardar 1 backup semanal por pelo menos 1 mês;
- testar restore periodicamente em um ambiente separado.

## Cuidados com LGPD

Backups podem conter dados pessoais, como:

- nome;
- telefone;
- endereço;
- histórico de coletas;
- registros de entrega;
- dados administrativos.

Boas práticas:

- não enviar backups para o GitHub;
- não compartilhar backup por WhatsApp ou e-mail comum;
- armazenar backups em local seguro;
- proteger backups com senha ou criptografia quando possível;
- remover backups antigos que não são mais necessários;
- limitar acesso apenas a pessoas autorizadas.

## Antes de fazer deploy

Antes de colocar o sistema em produção:

1. definir onde os backups serão armazenados;
2. definir quem pode acessar os backups;
3. testar um restore em ambiente separado;
4. registrar a rotina no plano de operação do projeto;
5. configurar backup automático se a hospedagem oferecer esse recurso.

## Checklist rápido

Backup:

```powershell
mkdir backups
docker compose exec -T db pg_dump -U coletaqui -d coletaqui -Fc -f /tmp/coletaqui.dump
docker compose cp db:/tmp/coletaqui.dump ./backups/coletaqui.dump
docker compose exec -T db rm /tmp/coletaqui.dump
```

Restore:

```powershell
docker compose cp ./backups/coletaqui.dump db:/tmp/coletaqui.dump
docker compose exec -T db pg_restore -U coletaqui -d coletaqui --clean --if-exists /tmp/coletaqui.dump
docker compose exec -T db rm /tmp/coletaqui.dump
docker compose restart backend frontend
```
