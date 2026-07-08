# API e Rotas

Projeto: Coletaqui Araçoiaba  
Data: 2026-07-08

## Documentação Interativa

```text
Swagger UI:  http://localhost:8080/swagger-ui/index.html
OpenAPI:     http://localhost:8080/v3/api-docs
```

Rotas protegidas usam:

```http
Authorization: Bearer <token>
```

## Autenticação

```http
POST /auth/common/request-otp
POST /auth/common/verify-otp
POST /auth/collector/request-otp
POST /auth/collector/verify-otp
POST /auth/complete-profile
POST /auth/admin/login
```

Observações:

- morador e coletor usam OTP por telefone;
- admin usa e-mail e senha;
- `complete-profile` exige aceite de termos e privacidade.

## Usuários e Admin

```http
GET  /admin/summary
GET  /admin/impact
GET  /admin/users
GET  /admin/collectors/pending
POST /admin/collectors/{collectorId}/approve
POST /admin/users/{targetUserId}/block
POST /admin/users/{targetUserId}/activate
GET  /admin/schedules
GET  /admin/ranking
```

## Materiais

```http
GET  /admin/materials
POST /admin/materials
PUT  /admin/materials/{materialId}
POST /admin/materials/{materialId}/toggle
```

## Pontos de Coleta

```http
GET  /collection-points
GET  /collection-points/{pointId}
GET  /admin/collection-points
POST /admin/collection-points
PUT  /admin/collection-points/{pointId}
POST /admin/collection-points/{pointId}/toggle
```

## Entregas em Ponto de Coleta

```http
POST /collection-point-deliveries
GET  /collection-point-deliveries/me
GET  /collection-point-deliveries/collector
POST /collection-point-deliveries/{deliveryId}/confirm
```

Uso:

- morador registra entrega em um ponto;
- responsável pelo ponto confirma;
- entrega confirmada entra no impacto.

## Entregas Avulsas Confirmadas pelo Coletor

```http
POST /drop-offs
GET  /drop-offs/collector
```

Uso:

- coletor/ponto registra entrega feita presencialmente por telefone do morador;
- quando o telefone existe, o registro é vinculado ao morador.

## Agendamentos de Coleta Domiciliar

```http
POST /schedules
GET  /schedules/me
GET  /schedules/open
GET  /schedules/collector
GET  /schedules/{scheduleId}
POST /schedules/{scheduleId}/accept
POST /schedules/{scheduleId}/complete
POST /schedules/{scheduleId}/cancel
GET  /schedules/impact
```

Status:

- `REQUESTED`
- `ACCEPTED`
- `COMPLETED`
- `CANCELED`

## Impacto do Usuário

```http
GET /user-impact/me
```

Consolida:

- coletas domiciliares concluídas;
- entregas confirmadas em pontos;
- árvores validadas.

## Plantio de Árvores

```http
POST /tree-plantings
GET  /tree-plantings/me
GET  /tree-plantings/community
GET  /admin/tree-plantings
POST /admin/tree-plantings/{plantingId}/validate
POST /admin/tree-plantings/{plantingId}/reject
```

`POST /tree-plantings` usa `multipart/form-data` com foto.

Rejeição administrativa:

```json
{
  "reason": "Foto não permite validar o plantio."
}
```

## Uploads

Fotos temporárias locais são servidas por:

```text
/uploads/tree-plantings/{arquivo}
```

No Docker, o Nginx encaminha `/uploads` para o backend.
