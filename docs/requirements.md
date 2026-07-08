# Documento de Requisitos

Projeto: Coletaqui Araçoiaba  
Versão: 3.0  
Data: 2026-07-08

## 1. Visão Geral

O Coletaqui Araçoiaba é uma aplicação PWA para apoiar coleta seletiva, educação ambiental, pontos de entrega, agendamento de coletas, plantio de árvores, ranking comunitário e análise de impacto.

O sistema atende três perfis principais:

- morador;
- coletor/ponto de coleta;
- administrador.

## 2. Atores

### Usuário comum

- Acessa o app mobile-first.
- Faz login/cadastro por telefone e OTP.
- Consulta conteúdo educativo.
- Consulta pontos de coleta e coletores.
- Solicita coleta domiciliar.
- Registra entrega em ponto de coleta.
- Registra plantio de árvore.
- Consulta seu impacto e ranking.

### Coletor ou ponto de coleta

- Faz login/cadastro por telefone e OTP.
- Informa tipo de atendimento.
- Fica pendente até aprovação administrativa.
- Aceita e conclui coletas domiciliares.
- Confirma entregas em pontos de coleta.
- Consulta agenda e impacto próprio.

### Administrador

- Acessa painel desktop.
- Faz login por e-mail e senha.
- Gerencia usuários, coletores, materiais e pontos de coleta.
- Aprova, bloqueia e reativa coletores.
- Consulta dashboards e ranking.
- Valida ou rejeita árvores plantadas.

## 3. Requisitos Funcionais

### RF-01 - Login e Cadastro por OTP

O sistema deve permitir entrada de morador e coletor por telefone com OTP via WhatsApp.

Critérios:

- telefone deve aceitar DDD ou usar DDD padrão 81 quando informado sem DDD;
- OTP deve ter 6 dígitos;
- OTP deve expirar;
- OTP usado não pode ser reutilizado;
- após OTP válido, o sistema deve emitir JWT;
- se o perfil estiver incompleto, o usuário deve completar cadastro.

### RF-02 - Aceite de Termos e Privacidade

O sistema deve exigir aceite de Termos de Uso e Política de Privacidade ao completar cadastro.

Critérios:

- usuário deve marcar os dois checkboxes;
- sistema deve salvar data/hora do aceite;
- sistema deve salvar versão dos documentos aceitos;
- cadastro não deve concluir sem aceite.

### RF-03 - Cadastro de Usuário Comum

O sistema deve permitir completar cadastro de morador.

Dados mínimos:

- telefone validado;
- nome;
- aceite legal.

### RF-04 - Cadastro de Coletor

O sistema deve permitir completar cadastro de coletor.

Dados mínimos:

- telefone validado;
- nome ou empresa;
- região;
- tipo de atendimento;
- materiais coletados;
- disponibilidade;
- aceite legal.

Tipos de atendimento:

- coleta domiciliar;
- ponto de recebimento;
- coleta + recebimento.

### RF-05 - Aprovação de Coletor

O sistema deve manter novos coletores como pendentes até aprovação administrativa.

Critérios:

- coletor pendente não pode operar solicitações;
- admin pode aprovar;
- admin pode bloquear;
- admin pode reativar.

### RF-06 - Login Administrativo

O sistema deve permitir login administrativo por e-mail e senha.

Critérios:

- senha deve ser validada por BCrypt;
- credenciais inválidas não devem revelar se o e-mail existe;
- admin autenticado deve acessar `/admin/dashboard`;
- usuários comuns e coletores não devem acessar rotas administrativas.

### RF-07 - Pontos de Coleta

O sistema deve permitir gestão e consulta de pontos fixos de coleta.

Critérios:

- admin cadastra, edita, ativa e desativa pontos;
- ponto possui endereço, materiais, dias, horário, latitude/longitude e responsável;
- ponto aparece no mapa;
- morador pode selecionar ponto e registrar entrega;
- se o ponto aceitar apenas um material, o sistema não deve exigir escolha manual.

### RF-08 - Registro de Entrega em Ponto

O sistema deve permitir que morador registre entrega em ponto de coleta.

Critérios:

- entrega deve ficar vinculada ao morador;
- entrega deve ficar vinculada ao ponto;
- responsável pelo ponto/coletor deve confirmar;
- entrega confirmada deve aparecer no impacto do morador e nos indicadores administrativos.

### RF-09 - Agendamento de Coleta Domiciliar

O sistema deve permitir solicitar coleta domiciliar.

Critérios:

- morador informa endereço, materiais, período preferencial e observações;
- solicitação inicia como `REQUESTED`;
- morador pode cancelar enquanto estiver aberta;
- coletor ativo pode aceitar;
- coletor responsável pode concluir.

### RF-10 - Página de Impacto do Morador

O sistema deve consolidar ações ambientais do morador.

Critérios:

- deve exibir coletas domiciliares concluídas;
- deve exibir entregas confirmadas em pontos;
- deve exibir árvores validadas;
- deve apoiar ranking e gamificação.

### RF-11 - Ranking Comunitário

O sistema deve exibir ranking para engajar moradores.

Critérios:

- pontuação deve considerar coletas e entregas;
- materiais de maior impacto ambiental podem pontuar mais;
- ranking deve ser acessível ao morador;
- admin deve ter visão administrativa do ranking.

### RF-12 - Plante uma Árvore

O sistema deve permitir registrar e validar plantios.

Critérios:

- morador informa espécie, data, local, bairro e referência;
- morador envia foto de evidência;
- morador pode informar GPS opcional;
- admin valida ou rejeita;
- rejeição exige motivo;
- foto deve ser removida após validação ou rejeição;
- árvores validadas aparecem no mapa.

### RF-13 - Dashboard Administrativo

O sistema deve apresentar indicadores gerais no painel admin.

Critérios:

- total de usuários;
- total de coletores;
- total de pontos;
- total de solicitações;
- total de entregas;
- total de árvores;
- gráficos de status, materiais e bairros;
- ranking administrativo.

### RF-14 - Swagger/OpenAPI

O backend deve disponibilizar documentação interativa da API.

Critérios:

- Swagger UI disponível em `/swagger-ui/index.html`;
- OpenAPI JSON disponível em `/v3/api-docs`;
- rotas protegidas devem aceitar JWT no botão `Authorize`.

## 4. Regras de Negócio

### RN-01 - Cidade de Atuação

O projeto é voltado para Araçoiaba/PE. Cadastros e pontos devem manter cidade e UF coerentes com Araçoiaba/PE quando aplicável.

### RN-02 - Telefone Único

Telefone identifica a conta. Um telefone não deve criar múltiplas contas independentes.

### RN-03 - OTP

Novo OTP invalida OTP anterior do mesmo telefone. OTP expirado ou usado não pode autenticar.

### RN-04 - Coletor Pendente

Coletor pendente pode autenticar, mas não pode operar coletas ou confirmações até aprovação.

### RN-05 - Evidência de Plantio

Foto de plantio é evidência temporária. Deve ser removida após validação ou rejeição.

### RN-06 - Motivo de Rejeição

Quando admin rejeitar uma árvore, deve informar motivo. O motivo deve ficar disponível para admin e morador.

### RN-07 - Impacto

Somente coletas concluídas, entregas confirmadas e árvores validadas devem compor impacto consolidado.

## 5. Requisitos Não Funcionais

### RNF-01 - PWA

A aplicação deve ser PWA mobile-first para morador e coletor.

### RNF-02 - Responsividade

Telas de morador e coletor devem funcionar em celular, tablet e desktop. O painel admin prioriza desktop.

### RNF-03 - Segurança

- JWT assinado.
- Senha admin em BCrypt.
- OTP com hash, expiração e limite de tentativas.
- Dados sensíveis fora de logs.
- HTTPS em produção.

### RNF-04 - Privacidade

- Aceite legal deve ser registrado.
- Fotos temporárias devem ser removidas após validação.
- GPS deve ser opcional.
- Política de Privacidade deve ser acessível.

### RNF-05 - Banco

Banco relacional PostgreSQL com ORM JPA/Hibernate. Em produção, schema deve ser controlado por migrations.

### RNF-06 - Observabilidade

O sistema deve registrar eventos importantes em logs, sem expor OTP, senha, token ou dados sensíveis.

## 6. Fora do Escopo Imediato

- Integração definitiva com WhatsApp Business em produção.
- Pagamentos ou remuneração de coletores.
- PostGIS.
- Notificações push completas.
- Revisão jurídica final dos documentos legais.
