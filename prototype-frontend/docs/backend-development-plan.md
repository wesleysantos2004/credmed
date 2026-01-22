# Plano de Desenvolvimento Backend - Integração com Protótipo

**Data:** 15 de Janeiro de 2026  
**Objetivo:** Guia para desenvolvimento do backend que integra com o protótipo frontend existente

---

## 🎯 Estratégia de Desenvolvimento

### **Abordagem: Backend-For-Frontend (BFF) Compatível**

Desenvolver backend que **mantém compatibilidade** com o protótipo, facilitando integração:

1. ✅ **Mesma estrutura de dados JSON**
2. ✅ **Mesmos status e workflows**
3. ✅ **Endpoints que espelham funções do storage.js**
4. ✅ **Adicionar funcionalidades novas** (KYC, validações, etc.)

---

## 📋 Mapeamento: storage.js → Backend API

### **1. Gestão de Solicitações**

| Função storage.js                 | Endpoint Backend                 | Método | Autenticação |
| --------------------------------- | -------------------------------- | ------ | ------------ |
| `getSolicitacoes()`               | `/api/v1/requests`               | GET    | JWT          |
| `getSolicitacao(id)`              | `/api/v1/requests/:id`           | GET    | JWT          |
| `getSolicitacoesMedico(medicoId)` | `/api/v1/requests?doctor_id=:id` | GET    | JWT (doctor) |
| `criarSolicitacao(dados)`         | `/api/v1/requests`               | POST   | JWT (doctor) |
| `saveSolicitacoes(solicitacoes)`  | N/A (interno)                    | -      | -            |

### **2. Workflow - Triagem (Admin)**

| Função storage.js                | Endpoint Backend                       | Método |
| -------------------------------- | -------------------------------------- | ------ |
| `aprovarDiretamente(id, obs)`    | `/api/v1/requests/:id/approve-direct`  | PUT    |
| `encaminharParaEmpresa(id, obs)` | `/api/v1/requests/:id/forward-company` | PUT    |
| `solicitarInformacoes(id, obs)`  | `/api/v1/requests/:id/request-info`    | PUT    |
| `rejeitarSolicitacao(id, obs)`   | `/api/v1/requests/:id/reject`          | PUT    |

### **3. Workflow - Validação Empresa** ⚠️ (MVP1: Remover)

| Função storage.js            | Endpoint Backend | Status MVP1        |
| ---------------------------- | ---------------- | ------------------ |
| `validarPlantoesEmpresa()`   | N/A              | ❌ Não implementar |
| `rejeitarValidacaoEmpresa()` | N/A              | ❌ Não implementar |

**Nota:** No MVP1, validação será 100% manual pelo admin.

### **4. Workflow - Aprovação Final (Admin)**

| Função storage.js                | Endpoint Backend                    | Método         |
| -------------------------------- | ----------------------------------- | -------------- |
| `aprovarValidado(id, obs)`       | `/api/v1/requests/:id/approve`      | PUT            |
| `devolverParaEmpresa(id, obs)`   | N/A                                 | ❌ Não no MVP1 |
| `solicitarInformacoesValidado()` | `/api/v1/requests/:id/request-info` | PUT            |
| `rejeitarValidado(id, obs)`      | `/api/v1/requests/:id/reject`       | PUT            |

### **5. Pagamento**

| Função storage.js               | Endpoint Backend           | Método |
| ------------------------------- | -------------------------- | ------ |
| `registrarPagamento(id, dados)` | `/api/v1/requests/:id/pay` | PUT    |

### **6. Filtros e Consultas**

| Função storage.js                  | Endpoint Backend                  | Query Params |
| ---------------------------------- | --------------------------------- | ------------ |
| `getSolicitacoesPorStatus(status)` | `/api/v1/requests?status=:status` | `?status=`   |
| `getStatusLabel(status)`           | N/A (frontend)                    | -            |

---

## 🆕 Funcionalidades Novas (Não no Protótipo)

### **1. Sistema de KYC** (Conforme Especificação)

| Funcionalidade   | Endpoint                            | Método | Descrição               |
| ---------------- | ----------------------------------- | ------ | ----------------------- |
| Cadastro básico  | `/api/v1/auth/register`             | POST   | Etapa 1 - dados básicos |
| Upload KYC       | `/api/v1/auth/upload-kyc-documents` | POST   | Etapa 2 - fotos         |
| Listar pendentes | `/api/v1/doctors/pending-kyc`       | GET    | Admin vê pendentes      |
| Aprovar KYC      | `/api/v1/doctors/:id/verify-kyc`    | POST   | Admin aprova/rejeita    |

### **2. Autenticação Real (JWT)**

| Funcionalidade | Endpoint               | Método |
| -------------- | ---------------------- | ------ |
| Login          | `/api/v1/auth/login`   | POST   |
| Refresh token  | `/api/v1/auth/refresh` | POST   |
| Logout         | `/api/v1/auth/logout`  | POST   |

### **3. Upload de Documentos Real**

| Funcionalidade    | Endpoint                           | Método |
| ----------------- | ---------------------------------- | ------ |
| Upload arquivo    | `/api/v1/documents/upload`         | POST   |
| Download arquivo  | `/api/v1/documents/:id/download`   | GET    |
| Listar documentos | `/api/v1/documents?request_id=:id` | GET    |

### **4. Gestão de Empresas** (Admin)

| Funcionalidade    | Endpoint                | Método |
| ----------------- | ----------------------- | ------ |
| Listar empresas   | `/api/v1/companies`     | GET    |
| Criar empresa     | `/api/v1/companies`     | POST   |
| Atualizar empresa | `/api/v1/companies/:id` | PUT    |

---

## 🔄 Ajustes nos Status (MVP1)

### **Status do Protótipo vs. MVP1**

| Status Protótipo                | Usar no MVP1? | Status Backend | Observação             |
| ------------------------------- | ------------- | -------------- | ---------------------- |
| `AGUARDANDO_TRIAGEM_ADMIN`      | ✅ Sim        | `pending`      | Nova solicitação       |
| `APROVADO_ADMIN`                | ✅ Sim        | `approved`     | Aprovada pelo admin    |
| `AGUARDANDO_VALIDACAO_EMPRESA`  | ❌ Não        | -              | Removido (sem empresa) |
| `VALIDADO_EMPRESA`              | ❌ Não        | -              | Removido               |
| `REJEITADO_EMPRESA`             | ❌ Não        | -              | Removido               |
| `AGUARDANDO_INFORMACOES_MEDICO` | ✅ Sim        | `pending_info` | Admin pediu mais info  |
| `REJEITADO_ADMIN`               | ✅ Sim        | `rejected`     | Rejeitada              |
| `PAGO`                          | ✅ Sim        | `paid`         | Paga                   |

### **Status Simplificados MVP1:**

```javascript
// Backend deve usar:
const STATUS = {
  DRAFT: "draft", // Rascunho (não enviada)
  PENDING: "pending", // Aguardando triagem
  IN_REVIEW: "in_review", // Em análise pelo admin
  APPROVED: "approved", // Aprovada (aguardando pagamento)
  PENDING_INFO: "pending_info", // Aguardando informações
  REJECTED: "rejected", // Rejeitada
  PAID: "paid", // Paga
};
```

---

## 📊 Estrutura de Resposta Padrão

### **Formato JSON (compatível com protótipo):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-gerado",
    "numero": "SOL-2026-00001",
    "medicoId": "uuid-medico",
    "medicoNome": "Dr. Fernando Silva",
    "empresaId": "uuid-empresa",
    "empresaNome": "MedPlus",
    "valorTotal": 5200.0,
    "taxa": 182.0,
    "taxaPercentual": 3.5,
    "valorLiquido": 5018.0,
    "status": "pending",
    "dataCriacao": "2026-01-15T10:30:00Z",
    "plantoes": [
      {
        "id": "uuid-plantao",
        "data": "2026-01-20",
        "horarioInicio": "19:00",
        "horarioFim": "07:00",
        "duracao": 12,
        "local": "Hospital São Lucas",
        "valor": 1800.0,
        "validado": false
      }
    ],
    "historico": [
      {
        "data": "2026-01-15T10:30:00Z",
        "acao": "CRIACAO",
        "usuario": "Dr. Fernando Silva",
        "papel": "MEDICO",
        "descricao": "Solicitação criada"
      }
    ],
    "dadosBancarios": {
      "chavePix": "fernando@email.com",
      "tipoChavePix": "EMAIL"
    },
    "observacoes": []
  }
}
```

---

## 🛠️ Ordem de Implementação Ajustada (MVP RÁPIDO)

### **⚡ FASE 1: Setup + Integração Imediata (3-4 dias)**

**Objetivo:** Frontend funcionando com backend real SEM autenticação

**Dia 1: Setup do Projeto**

- [ ] Criar estrutura do projeto Node.js + TypeScript
- [ ] Configurar ESLint, Prettier, tsconfig
- [ ] Setup SQLite + Sequelize
- [ ] Variáveis de ambiente (.env)
- [ ] Instalar dependências básicas
- [ ] CORS configurado para frontend local

**Dia 2: Modelos de Dados (Simplificados)**

- [ ] Model: Doctor (sem User por enquanto)
- [ ] Model: Company
- [ ] Model: AdvRequest
- [ ] Model: Shift
- [ ] Model: StatusHistory
- [ ] Migrations
- [ ] **Seed data com personas** (5 médicos, 3 empresas, 15 solicitações)

**Dia 3-4: APIs Básicas (SEM Auth)**

- [ ] GET `/api/v1/requests` - Listar todas solicitações
- [ ] GET `/api/v1/requests?doctor_id=:id` - Filtrar por médico
- [ ] GET `/api/v1/requests/:id` - Detalhes
- [ ] POST `/api/v1/requests` - Criar nova
- [ ] GET `/api/v1/doctors` - Listar médicos
- [ ] GET `/api/v1/companies` - Listar empresas
- [ ] **Testar com Postman**
- [ ] **Ajustar frontend para chamar APIs**

**Resultado Fase 1:** ✅ Frontend mostrando dados reais do SQLite

---

### **⚡ FASE 2: Workflow Admin (3-4 dias)**

**Objetivo:** Fluxo completo de triagem e aprovação funcionando

**Dia 5-6: Ações de Triagem**

- [ ] PUT `/api/v1/requests/:id/approve-direct` - Aprovar direto
- [ ] PUT `/api/v1/requests/:id/request-info` - Solicitar info
- [ ] PUT `/api/v1/requests/:id/reject` - Rejeitar
- [ ] PUT `/api/v1/requests/:id/set-in-review` - Marcar em análise
- [ ] Validações de transição de status
- [ ] Registro no histórico (status_history)

**Dia 7-8: Aprovação e Pagamento**

- [ ] PUT `/api/v1/requests/:id/approve` - Aprovar final
- [ ] PUT `/api/v1/requests/:id/pay` - Registrar pagamento
- [ ] Calcular valores (taxa, líquido, cashback)
- [ ] **Testar fluxo completo no frontend**

**Resultado Fase 2:** ✅ Fluxo admin completo funcionando

---

### **⚡ FASE 3: Dashboard e Upload (2-3 dias)**

**Dia 9-10: Dashboards**

- [ ] GET `/api/v1/dashboard/doctor/:id` - Métricas do médico
- [ ] GET `/api/v1/dashboard/admin` - Métricas gerais
- [ ] Agregações e contadores

**Dia 11: Upload de Documentos (Básico)**

- [ ] POST `/api/v1/documents/upload` - Upload arquivo
- [ ] Multer configurado
- [ ] Storage em `/uploads/`
- [ ] Associar com solicitações

**Resultado Fase 3:** ✅ Sistema funcional completo (sem auth)

---

### **⚡ FASE 4: Autenticação e KYC (DEPOIS - 1-2 semanas)**

**A implementar posteriormente:**

- [ ] Sistema de autenticação JWT
- [ ] Cadastro de médicos
- [ ] Upload KYC (foto documento + selfie)
- [ ] Aprovação de cadastros pelo admin
- [ ] Proteção de rotas com middleware
- [ ] Refresh tokens

---

### **Sprint 2: KYC e Médicos (1-2 semanas)**

**Dia 8-10: Sistema KYC**

- [ ] POST `/api/v1/auth/upload-kyc-documents`
- [ ] Multer config para imagens
- [ ] Validação de formato/tamanho
- [ ] Storage em `/uploads/kyc/`
- [ ] GET `/api/v1/doctors/pending-kyc` (admin)
- [ ] POST `/api/v1/doctors/:id/verify-kyc` (admin)

**Dia 11-12: Gestão de Médicos**

- [ ] GET `/api/v1/doctors/profile`
- [ ] PUT `/api/v1/doctors/profile`
- [ ] Validações (CPF, CRM)

---

### **Sprint 3: Solicitações (2 semanas)**

**Dia 13-15: CRUD Básico**

- [ ] POST `/api/v1/requests` (criar solicitação)
- [ ] GET `/api/v1/requests` (listar com filtros)
- [ ] GET `/api/v1/requests/:id` (detalhes)
- [ ] Geração de número sequencial
- [ ] Cálculos (taxa, líquido)

**Dia 16-18: Upload de Documentos**

- [ ] POST `/api/v1/documents/upload`
- [ ] GET `/api/v1/documents/:id/download`
- [ ] Associar com solicitações
- [ ] Validações de arquivo

**Dia 19-20: Histórico e Auditoria**

- [ ] Sistema de log de ações
- [ ] Tabela status_history
- [ ] Tabela audit_logs
- [ ] Rastreamento de mudanças

---

### **Sprint 4: Workflow Admin (1-2 semanas)**

**Dia 21-23: Triagem**

- [ ] PUT `/api/v1/requests/:id/approve-direct`
- [ ] PUT `/api/v1/requests/:id/request-info`
- [ ] PUT `/api/v1/requests/:id/reject`
- [ ] Validações de transição de status
- [ ] Notificações (mock)

**Dia 24-26: Aprovação e Pagamento**

- [ ] PUT `/api/v1/requests/:id/approve`
- [ ] PUT `/api/v1/requests/:id/pay`
- [ ] Registro de dados de pagamento
- [ ] Comprovantes

---

### **Sprint 5: Empresas e Dashboards (1 semana)**

**Dia 27-28: Gestão de Empresas**

- [ ] GET `/api/v1/companies`
- [ ] POST `/api/v1/companies`
- [ ] PUT `/api/v1/companies/:id`

**Dia 29-30: Dashboards**

- [ ] GET `/api/v1/dashboard/doctor`
- [ ] GET `/api/v1/dashboard/admin`
- [ ] Agregações e métricas

---

### **Sprint 6: Integração Frontend (1 semana)**

**Dia 31-33: Ajustes no Frontend**

- [ ] Substituir `AppStorage.*` por `fetch()`
- [ ] Adicionar axios
- [ ] Tratamento de erros
- [ ] Loaders/spinners

**Dia 34-35: Testes Integrados**

- [ ] Fluxo completo: Cadastro → Solicitação → Aprovação → Pagamento
- [ ] Correção de bugs
- [ ] Ajustes finais

---

## 🔐 Segurança e Validações

### **Backend DEVE implementar:**

1. **Validações Joi:**

```javascript
// Exemplo: Validar criação de solicitação
const createRequestSchema = Joi.object({
  company_id: Joi.string().uuid().required(),
  fee_rate: Joi.number().min(0).max(10).required(),
  shifts: Joi.array()
    .min(1)
    .items(
      Joi.object({
        shift_date: Joi.date().required(),
        start_time: Joi.string()
          .pattern(/^\d{2}:\d{2}$/)
          .required(),
        end_time: Joi.string()
          .pattern(/^\d{2}:\d{2}$/)
          .required(),
        hours: Joi.number().min(1).max(24).required(),
        location: Joi.string().max(255).required(),
        amount: Joi.number().min(0).required(),
      })
    )
    .required(),
});
```

2. **Middleware de Autorização:**

```javascript
// Verificar role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
};

// Verificar ownership
const requireOwnership = (req, res, next) => {
  const requestId = req.params.id;
  const request = await getRequest(requestId);
  if (request.doctor_id !== req.user.doctor_id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
};
```

3. **Rate Limiting:**

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo de 100 requisições
});

app.use("/api/", limiter);
```

---

## 📦 Dependências NPM Necessárias

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "sequelize": "^6.35.0",
    "sqlite3": "^5.1.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "joi": "^17.11.0",
    "multer": "^1.4.5-lts.1",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.0",
    "winston": "^3.11.0",
    "express-rate-limit": "^7.1.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/multer": "^1.4.11",
    "ts-node-dev": "^2.0.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0"
  }
}
```

---

## 🧪 Testes Recomendados

### **Testes Unitários** (Jest)

- Validações Joi
- Funções de cálculo (taxa, líquido)
- Transições de status

### **Testes de Integração**

- Fluxos completos de API
- Autenticação e autorização
- Upload de arquivos

### **Testes E2E** (Cypress - futuro)

- Fluxo completo frontend → backend

---

## 📝 Checklist de Compatibilidade

Antes de integrar frontend com backend, verificar:

- [ ] Backend retorna mesma estrutura JSON do protótipo
- [ ] Status mapeados corretamente
- [ ] Campos com nomes idênticos (camelCase)
- [ ] Datas no formato ISO 8601
- [ ] Moeda em número decimal (não string)
- [ ] Arrays de plantões com mesma estrutura
- [ ] Histórico com mesmo formato
- [ ] Erros retornam `{ success: false, error: {...} }`

---

## ✅ Conclusão

**Estratégia clara:**

1. ✅ Replicar lógica do storage.js em APIs
2. ✅ Manter compatibilidade de dados
3. ✅ Adicionar KYC e validações
4. ✅ Integração incremental

**Resultado esperado:**

- Backend robusto e seguro
- Integração suave com frontend
- MVP1 funcional em 5-6 semanas

---

**Documento criado por:** GitHub Copilot  
**Data:** 15 de Janeiro de 2026  
**Status:** Pronto para desenvolvimento
