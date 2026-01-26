# User Stories - MVP1 CREDMED

**Projeto:** Sistema de Adiantamento de Plantões Médicos  
**Versão:** MVP1 (2 portais)  
**Data:** 15 de Janeiro de 2026

---

## 📋 Índice de Épicos

1. [Setup Inicial](#épico-1---setup-inicial)
2. [Autenticação](#épico-2---autenticação)
3. [KYC e Gestão de Médicos](#épico-3---kyc-e-gestão-de-médicos)
4. [Gestão de Empresas](#épico-4---gestão-de-empresas)
5. [Solicitações de Adiantamento](#épico-5---solicitações-de-adiantamento)
6. [Workflow de Aprovação](#épico-6---workflow-de-aprovação)
7. [Frontend Integration](#épico-7---frontend-integration)
8. [Testes e Deploy](#épico-8---testes-e-deploy)

---

## Épico 1 - Setup Inicial

### 🎯 Objetivo

Estabelecer a infraestrutura base do projeto com todas as configurações necessárias para desenvolvimento.

---

### US-001: Estrutura do Projeto Backend

**Como** desenvolvedor  
**Eu quero** criar a estrutura completa do projeto backend  
**Para que** eu possa desenvolver as funcionalidades de forma organizada

**Prioridade:** Alta  
**Estimativa:** 2 horas

**Critérios de Aceite:**

- [ ] Pasta `backend/` criada com estrutura de pastas (src, config, controllers, models, routes, services, middlewares, utils, types)
- [ ] Pasta `uploads/` criada com subpastas (kyc, shifts, contracts, others)
- [ ] Pasta `database/` criada
- [ ] Arquivo `.gitignore` configurado (node_modules, .env, uploads, database, logs)
- [ ] Arquivo `README.md` com instruções de setup

**Tarefas Técnicas:**

```bash
mkdir -p backend/src/{config,controllers,middlewares,models,routes,services,validators,utils,types}
mkdir -p backend/uploads/{kyc,shifts,contracts,others}
mkdir -p backend/database
mkdir -p backend/logs
mkdir -p backend/tests
```

---

### US-002: Configuração TypeScript e Ferramentas

**Como** desenvolvedor  
**Eu quero** configurar TypeScript, ESLint e Prettier  
**Para que** o código tenha qualidade e consistência

**Prioridade:** Alta  
**Estimativa:** 1 hora

**Critérios de Aceite:**

- [ ] `package.json` criado com todas as dependências necessárias
- [ ] `tsconfig.json` configurado com strict mode
- [ ] `.eslintrc.json` configurado com regras TypeScript
- [ ] `.prettierrc` configurado
- [ ] Scripts npm funcionando: `dev`, `build`, `start`, `lint`, `format`

**Dependências:**

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "sequelize": "^6.35.0",
    "sqlite3": "^5.1.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "joi": "^17.11.0",
    "multer": "^1.4.0",
    "helmet": "^7.1.0",
    "cors": "^2.8.0",
    "dotenv": "^16.3.0",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/node": "^20.0.0",
    "@types/bcrypt": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/multer": "^1.4.0",
    "typescript": "^5.3.0",
    "ts-node-dev": "^2.0.0",
    "eslint": "^8.55.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0",
    "prettier": "^3.1.0"
  }
}
```

---

### US-003: Configuração do Banco SQLite

**Como** desenvolvedor  
**Eu quero** configurar o Sequelize com SQLite  
**Para que** eu possa persistir dados da aplicação

**Prioridade:** Alta  
**Estimativa:** 2 horas

**Critérios de Aceite:**

- [x] Arquivo `src/config/database.ts` criado
- [x] Conexão com SQLite estabelecida
- [ ] Logging configurado (desabilitado em produção)
- [ ] Pool de conexões configurado
- [ ] Script de teste de conexão funcionando
- [x] Arquivo `credmed.sqlite` criado automaticamente

**Configuração:**

```typescript
// src/config/database.ts
import { Sequelize } from "sequelize";
import path from "path";

const dbPath = path.resolve(__dirname, "../../database/credmed.sqlite");

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
```

---

### US-004: Modelos de Dados Iniciais

**Como** desenvolvedor  
**Eu quero** criar os modelos Sequelize  
**Para que** eu possa representar as entidades do sistema no banco de dados

**Prioridade:** Alta  
**Estimativa:** 4 horas

**Critérios de Aceite:**

- [ ] Model `User` criado com todos os campos e validações
- [ ] Model `Doctor` criado com relacionamento a User
- [ ] Model `Company` criado
- [ ] Model `AdvRequest` criado com relacionamentos
- [ ] Model `Shift` criado
- [ ] Model `Document` criado
- [ ] Model `Contract` criado
- [ ] Model `StatusHistory` criado
- [ ] Model `AuditLog` criado
- [ ] Arquivo `src/models/index.ts` exportando todos os models
- [ ] Migrations criadas para todos os models
- [ ] Sync do banco executado com sucesso

**Models a criar:**

1. User (autenticação)
2. Doctor (perfil médico)
3. Company (empresas parceiras)
4. AdvRequest (solicitações)
5. Shift (plantões)
6. Document (arquivos)
7. Contract (contratos)
8. StatusHistory (rastreamento)
9. AuditLog (auditoria)

---

### US-005: Variáveis de Ambiente

**Como** desenvolvedor  
**Eu quero** configurar variáveis de ambiente  
**Para que** dados sensíveis não sejam commitados no código

**Prioridade:** Alta  
**Estimativa:** 30 minutos

**Critérios de Aceite:**

- [ ] Arquivo `.env.example` criado com todas as variáveis
- [ ] Arquivo `.env` criado (não versionado)
- [ ] Dotenv configurado no entry point
- [ ] Validação de variáveis obrigatórias implementada
- [ ] README atualizado com instruções

**Variáveis necessárias:**

```bash
NODE_ENV=development
PORT=3000
DB_PATH=./database/credmed.sqlite
JWT_SECRET=
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=7d
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

---

## Épico 2 - Autenticação

### 🎯 Objetivo

Implementar sistema de autenticação JWT com registro, login e controle de sessão.

---

### US-006: Registro de Usuário (Dados Básicos)

**Como** médico  
**Eu quero** me cadastrar no sistema com meus dados básicos  
**Para que** eu possa criar minha conta e solicitar adiantamentos

**Prioridade:** Alta  
**Estimativa:** 3 horas

**Critérios de Aceite:**

- [ ] Endpoint `POST /api/v1/auth/register` implementado
- [ ] Validação de dados com Joi (email, senha, CPF, CRM, nome, telefone)
- [ ] Validação de email único
- [ ] Validação de CPF único e formato válido
- [ ] Hash de senha com bcrypt (10 rounds)
- [ ] Criação de registro em `users` e `doctors`
- [ ] Status inicial: `pending` (aguardando KYC)
- [ ] Retorno de token JWT temporário
- [ ] Response 201 com dados do usuário criado
- [ ] Tratamento de erros (email duplicado, CPF inválido, etc)

**Validações:**

```typescript
{
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/).required(),
  cpf: Joi.string().length(11).pattern(/^\d+$/).required(),
  crm: Joi.string().required(),
  crm_state: Joi.string().length(2).uppercase().required(),
  full_name: Joi.string().min(3).required(),
  phone: Joi.string().min(10).required()
}
```

---

### US-007: Login de Usuário

**Como** usuário cadastrado  
**Eu quero** fazer login no sistema  
**Para que** eu possa acessar minhas funcionalidades

**Prioridade:** Alta  
**Estimativa:** 2 horas

**Critérios de Aceite:**

- [ ] Endpoint `POST /api/v1/auth/login` implementado
- [ ] Validação de email e senha
- [ ] Comparação de senha com bcrypt
- [ ] Geração de access token (1h) e refresh token (7d)
- [ ] Retorno de dados do usuário (sem senha)
- [ ] Response 200 com tokens
- [ ] Response 401 para credenciais inválidas
- [ ] Response 403 para usuário bloqueado
- [ ] Log de auditoria criado

**Response esperado:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "medico@email.com",
      "role": "doctor",
      "doctor_id": "uuid",
      "full_name": "Dr. João Silva",
      "status": "approved"
    },
    "token": "jwt-access-token",
    "refresh_token": "jwt-refresh-token"
  }
}
```

---

### US-008: Renovação de Token

**Como** usuário autenticado  
**Eu quero** renovar meu token de acesso  
**Para que** eu possa continuar usando o sistema sem fazer login novamente

**Prioridade:** Média  
**Estimativa:** 1 hora

**Critérios de Aceite:**

- [ ] Endpoint `POST /api/v1/auth/refresh` implementado
- [ ] Validação do refresh token
- [ ] Verificação de expiração
- [ ] Geração de novo access token
- [ ] Response 200 com novo token
- [ ] Response 401 para refresh token inválido/expirado

---

### US-009: Logout de Usuário

**Como** usuário autenticado  
**Eu quero** fazer logout do sistema  
**Para que** minha sessão seja encerrada de forma segura

**Prioridade:** Média  
**Estimativa:** 1 hora

**Critérios de Aceite:**

- [ ] Endpoint `POST /api/v1/auth/logout` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Token adicionado à blacklist (Redis ou memória para MVP)
- [ ] Response 200 com mensagem de sucesso
- [ ] Log de auditoria criado

---

### US-010: Middleware de Autenticação

**Como** desenvolvedor  
**Eu quero** um middleware de autenticação JWT  
**Para que** eu possa proteger rotas que exigem login

**Prioridade:** Alta  
**Estimativa:** 2 horas

**Critérios de Aceite:**

- [ ] Middleware `auth.ts` criado
- [ ] Extração do token do header Authorization
- [ ] Validação do token JWT
- [ ] Decodificação do payload
- [ ] Injeção de `req.user` com dados do usuário
- [ ] Response 401 para token ausente
- [ ] Response 401 para token inválido/expirado
- [ ] Response 403 para usuário bloqueado
- [ ] Tratamento de erros JWT

---

### US-011: Middleware de Controle de Permissões (RBAC)

**Como** desenvolvedor  
**Eu quero** um middleware de controle de roles  
**Para que** eu possa restringir acesso por tipo de usuário

**Prioridade:** Alta  
**Estimativa:** 1 hora

**Critérios de Aceite:**

- [ ] Middleware `checkRole` criado
- [ ] Recebe array de roles permitidas
- [ ] Verifica role do usuário autenticado
- [ ] Response 403 para acesso negado
- [ ] Middleware aplicável em rotas específicas

**Exemplo de uso:**

```typescript
router.get("/admin/dashboard", auth, checkRole(["admin"]), dashboardController);
router.get("/doctor/profile", auth, checkRole(["doctor"]), profileController);
```

---

## Épico 3 - KYC e Gestão de Médicos

### 🎯 Objetivo

Implementar processo de validação de identidade (KYC) e gestão completa de médicos.

---

### US-012: Upload de Documentos KYC

**Como** médico recém-cadastrado  
**Eu quero** enviar foto do meu documento e uma selfie segurando o documento  
**Para que** minha identidade seja verificada e eu possa usar o sistema

**Prioridade:** Alta  
**Estimativa:** 4 horas

**Critérios de Aceite:**

- [ ] Endpoint `POST /api/v1/auth/upload-kyc-documents` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Configuração Multer para upload de imagens
- [ ] Validação de formato (JPG, JPEG, PNG)
- [ ] Validação de tamanho (máx 5MB por arquivo)
- [ ] Validação de dimensões mínimas (800x600px)
- [ ] Ambos os arquivos obrigatórios
- [ ] Nomes de arquivo randomizados (UUID)
- [ ] Armazenamento em `/uploads/kyc/`
- [ ] Atualização de campos `id_document_photo` e `selfie_with_document` em Doctor
- [ ] Response 200 com confirmação
- [ ] Response 400 para validações falhas
- [ ] Registro em DocumentService

**Validações:**

```typescript
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato inválido. Use JPG ou PNG."));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter,
});
```

---

### US-013: Listagem de Médicos Pendentes KYC (Admin)

**Como** administrador  
**Eu quero** visualizar lista de médicos aguardando aprovação de documentos  
**Para que** eu possa validar suas identidades

**Prioridade:** Alta  
**Estimativa:** 2 horas

**Critérios de Aceite:**

- [ ] Endpoint `GET /api/v1/doctors/pending-kyc` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Middleware RBAC para role `admin`
- [ ] Filtro: `kyc_verified = false AND status = 'pending'`
- [ ] Paginação implementada (page, limit)
- [ ] Retorno com dados do médico e URLs das fotos
- [ ] Ordenação por data de criação (mais antigos primeiro)
- [ ] Response 200 com lista

**Response esperado:**

```json
{
  "success": true,
  "data": {
    "doctors": [
      {
        "id": "uuid",
        "full_name": "Dr. João Silva",
        "cpf": "123.456.789-01",
        "crm": "123456/SP",
        "email": "joao@email.com",
        "phone": "11999998888",
        "id_document_photo": "/uploads/kyc/uuid-document.jpg",
        "selfie_with_document": "/uploads/kyc/uuid-selfie.jpg",
        "created_at": "2026-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

### US-014: Visualização de Documentos KYC (Admin)

**Como** administrador  
**Eu quero** visualizar as fotos dos documentos enviados pelo médico  
**Para que** eu possa verificar a autenticidade

**Prioridade:** Alta  
**Estimativa:** 2 horas

**Critérios de Aceite:**

- [ ] Endpoint `GET /api/v1/documents/kyc/:filename` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Middleware RBAC para role `admin`
- [ ] Validação de existência do arquivo
- [ ] Restrição de acesso apenas à pasta `/kyc/`
- [ ] Streaming do arquivo para o cliente
- [ ] Headers corretos (Content-Type, Cache-Control)
- [ ] Response 404 para arquivo não encontrado
- [ ] Response 403 para acesso negado
- [ ] Log de auditoria criado

---

### US-015: Aprovação/Rejeição de KYC (Admin)

**Como** administrador  
**Eu quero** aprovar ou rejeitar os documentos de um médico  
**Para que** ele possa (ou não) usar o sistema

**Prioridade:** Alta  
**Estimativa:** 3 horas

**Critérios de Aceite:**

- [ ] Endpoint `POST /api/v1/doctors/:id/verify-kyc` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Middleware RBAC para role `admin`
- [ ] Recebe campo `approved` (boolean) e `notes`
- [ ] **Se aprovado:**
  - [ ] Atualiza `kyc_verified = true`
  - [ ] Atualiza `status = 'approved'`
  - [ ] Registra `kyc_verified_at` e `kyc_verified_by`
  - [ ] Response 200 com sucesso
- [ ] **Se rejeitado:**
  - [ ] Mantém `kyc_verified = false`
  - [ ] Atualiza `status = 'rejected'`
  - [ ] Salva motivo em `notes`
  - [ ] Response 200 com mensagem
- [ ] Log de auditoria criado
- [ ] (Futuro) Envio de email ao médico

---

### US-016: Visualizar Perfil do Médico

**Como** médico  
**Eu quero** visualizar meu perfil completo  
**Para que** eu possa conferir meus dados cadastrais

**Prioridade:** Média  
**Estimativa:** 1 hora

**Critérios de Aceite:**

- [ ] Endpoint `GET /api/v1/doctors/profile` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Retorno de dados do médico logado (sem senha)
- [ ] Inclui dados de User e Doctor
- [ ] Response 200 com dados completos

---

### US-017: Atualizar Perfil do Médico

**Como** médico  
**Eu quero** atualizar meus dados cadastrais  
**Para que** eu possa manter minhas informações atualizadas

**Prioridade:** Média  
**Estimativa:** 2 horas

**Critérios de Aceite:**

- [ ] Endpoint `PUT /api/v1/doctors/profile` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Validação de campos editáveis (phone, pix_key, pix_key_type, bank_name, bank_account)
- [ ] Campos não editáveis: cpf, crm, crm_state, full_name
- [ ] Atualização no banco
- [ ] Response 200 com dados atualizados
- [ ] Log de auditoria criado

---

## Épico 4 - Gestão de Empresas

### 🎯 Objetivo

Permitir que administradores gerenciem empresas parceiras que empregam os médicos.

---

### US-018: Listar Empresas (Admin)

**Como** administrador  
**Eu quero** visualizar lista de empresas cadastradas  
**Para que** eu possa gerenciar as parcerias

**Prioridade:** Média  
**Estimativa:** 2 horas

**Critérios de Aceite:**

- [ ] Endpoint `GET /api/v1/companies` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Middleware RBAC para role `admin`
- [ ] Paginação implementada (page, limit)
- [ ] Filtro por status (query param: `status=active`)
- [ ] Ordenação por nome
- [ ] Response 200 com lista
- [ ] Inclui taxa de cashback

---

### US-019: Cadastrar Nova Empresa (Admin)

**Como** administrador  
**Eu quero** cadastrar uma nova empresa parceira  
**Para que** médicos possam criar solicitações para ela

**Prioridade:** Média  
**Estimativa:** 2 horas

**Critérios de Aceite:**

- [ ] Endpoint `POST /api/v1/companies` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Middleware RBAC para role `admin`
- [ ] Validação de CNPJ único e formato válido
- [ ] Validação de campos obrigatórios (name, cnpj, contact_name, contact_phone, contact_email)
- [ ] Taxa de cashback opcional (default: 0)
- [ ] Status inicial: `active`
- [ ] Response 201 com empresa criada
- [ ] Log de auditoria criado

---

### US-020: Editar Empresa (Admin)

**Como** administrador  
**Eu quero** editar dados de uma empresa  
**Para que** eu possa manter informações atualizadas

**Prioridade:** Baixa  
**Estimativa:** 1 hora

**Critérios de Aceite:**

- [ ] Endpoint `PUT /api/v1/companies/:id` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Middleware RBAC para role `admin`
- [ ] Validação de campos editáveis
- [ ] CNPJ não editável
- [ ] Atualização no banco
- [ ] Response 200 com dados atualizados
- [ ] Log de auditoria criado

---

### US-021: Desativar Empresa (Admin)

**Como** administrador  
**Eu quero** desativar uma empresa  
**Para que** ela não apareça mais nas opções de solicitação

**Prioridade:** Baixa  
**Estimativa:** 1 hora

**Critérios de Aceite:**

- [ ] Endpoint `DELETE /api/v1/companies/:id` implementado (soft delete)
- [ ] Middleware de autenticação aplicado
- [ ] Middleware RBAC para role `admin`
- [ ] Atualiza `status = 'inactive'`
- [ ] Não permite exclusão física
- [ ] Response 200 com confirmação
- [ ] Log de auditoria criado

---

## Épico 5 - Solicitações de Adiantamento

### 🎯 Objetivo

Permitir que médicos criem e gerenciem solicitações de adiantamento de plantões.

---

### US-022: Criar Nova Solicitação

**Como** médico  
**Eu quero** criar uma solicitação de adiantamento  
**Para que** eu possa receber o valor dos meus plantões antecipadamente

**Prioridade:** Alta  
**Estimativa:** 4 horas

**Critérios de Aceite:**

- [ ] Endpoint `POST /api/v1/requests` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Middleware RBAC para role `doctor`
- [ ] Validação de campos obrigatórios (company_id, fee_rate, shifts[])
- [ ] Validação de cada plantão (date, start_time, end_time, hours, location, amount)
- [ ] Cálculo automático de `total_amount` (soma dos shifts)
- [ ] Cálculo automático de `net_amount` (total - taxa)
- [ ] Geração de `request_number` sequencial (ex: ADV-2026-0001)
- [ ] Status inicial: `draft`
- [ ] Criação de registros em `adv_requests` e `shifts`
- [ ] Response 201 com solicitação criada
- [ ] Inclui array de plantões no retorno

**Cálculo da taxa:**

```typescript
const net_amount = total_amount - total_amount * (fee_rate / 100);
```

---

### US-023: Listar Solicitações

**Como** usuário autenticado  
**Eu quero** visualizar lista de solicitações  
**Para que** eu possa acompanhar o histórico

**Prioridade:** Alta  
**Estimativa:** 3 horas

**Critérios de Aceite:**

- [ ] Endpoint `GET /api/v1/requests` implementado
- [ ] Middleware de autenticação aplicado
- [ ] **Médico:** Lista apenas suas solicitações
- [ ] **Admin:** Lista todas as solicitações
- [ ] Paginação implementada
- [ ] Filtros: status, company_id, date_from, date_to
- [ ] Ordenação por data de criação (DESC)
- [ ] Inclui contagem de plantões
- [ ] Response 200 com lista

---

### US-024: Visualizar Detalhes de Solicitação

**Como** usuário autenticado  
**Eu quero** visualizar detalhes completos de uma solicitação  
**Para que** eu possa ver todos os plantões e documentos

**Prioridade:** Alta  
**Estimativa:** 2 horas

**Critérios de Aceite:**

- [ ] Endpoint `GET /api/v1/requests/:id` implementado
- [ ] Middleware de autenticação aplicado
- [ ] **Médico:** Acesso apenas às próprias solicitações
- [ ] **Admin:** Acesso a qualquer solicitação
- [ ] Inclui dados completos: doctor, company, shifts, documents, status_history
- [ ] Response 200 com dados completos
- [ ] Response 403 para acesso negado
- [ ] Response 404 para solicitação não encontrada

---

### US-025: Enviar Solicitação para Análise

**Como** médico  
**Eu quero** enviar minha solicitação para análise  
**Para que** o administrador possa aprovar e processar o pagamento

**Prioridade:** Alta  
**Estimativa:** 2 horas

**Critérios de Aceite:**

- [ ] Endpoint `PUT /api/v1/requests/:id/submit` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Middleware RBAC para role `doctor`
- [ ] Validação: solicitação deve estar em status `draft`
- [ ] Validação: pelo menos 1 plantão cadastrado
- [ ] Atualiza status para `pending`
- [ ] Cria registro em `status_history`
- [ ] Response 200 com confirmação
- [ ] (Futuro) Notificação ao admin

---

### US-026: Upload de Comprovantes

**Como** médico  
**Eu quero** fazer upload de comprovantes dos meus plantões  
**Para que** minha solicitação tenha as evidências necessárias

**Prioridade:** Alta  
**Estimativa:** 3 horas

**Critérios de Aceite:**

- [ ] Endpoint `POST /api/v1/documents/upload` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Configuração Multer para múltiplos tipos (PDF, JPG, PNG)
- [ ] Validação de tamanho (máx 10MB)
- [ ] Recebe: file, request_id, shift_id (opcional), document_type
- [ ] Armazenamento em pasta apropriada (/shifts/, /others/)
- [ ] Criação de registro em `documents`
- [ ] Response 201 com dados do documento
- [ ] Response 400 para validações falhas

---

### US-027: Download de Documentos

**Como** usuário autenticado  
**Eu quero** fazer download de documentos anexados  
**Para que** eu possa visualizar os comprovantes

**Prioridade:** Média  
**Estimativa:** 2 horas

**Critérios de Aceite:**

- [ ] Endpoint `GET /api/v1/documents/:id/download` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Validação de propriedade (médico vê só seus docs, admin vê todos)
- [ ] Streaming do arquivo
- [ ] Headers corretos (Content-Type, Content-Disposition)
- [ ] Response 404 para documento não encontrado
- [ ] Response 403 para acesso negado
- [ ] Log de auditoria criado

---

## Épico 6 - Workflow de Aprovação

### 🎯 Objetivo

Implementar fluxo de aprovação administrativa das solicitações até o pagamento.

---

### US-028: Colocar em Análise (Admin)

**Como** administrador  
**Eu quero** marcar uma solicitação como "em análise"  
**Para que** eu sinalize que estou trabalhando nela

**Prioridade:** Média  
**Estimativa:** 1 hora

**Critérios de Aceite:**

- [ ] Endpoint `PUT /api/v1/requests/:id/set-in-review` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Middleware RBAC para role `admin`
- [ ] Validação: status atual deve ser `pending`
- [ ] Atualiza status para `in_review`
- [ ] Cria registro em `status_history`
- [ ] Response 200 com confirmação

---

### US-029: Aprovar Solicitação (Admin)

**Como** administrador  
**Eu quero** aprovar uma solicitação validada  
**Para que** o médico saiba que receberá o pagamento

**Prioridade:** Alta  
**Estimativa:** 2 horas

**Critérios de Aceite:**

- [ ] Endpoint `PUT /api/v1/requests/:id/approve` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Middleware RBAC para role `admin`
- [ ] Validação: status deve ser `pending` ou `in_review`
- [ ] Atualiza status para `approved`
- [ ] Registra `approved_at` e `approved_by`
- [ ] Recebe campo opcional `notes`
- [ ] Cria registro em `status_history`
- [ ] Response 200 com confirmação
- [ ] (Futuro) Notificação ao médico

---

### US-030: Rejeitar Solicitação (Admin)

**Como** administrador  
**Eu quero** rejeitar uma solicitação  
**Para que** o médico saiba que não foi aprovada

**Prioridade:** Alta  
**Estimativa:** 2 horas

**Critérios de Aceite:**

- [ ] Endpoint `PUT /api/v1/requests/:id/reject` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Middleware RBAC para role `admin`
- [ ] Campo obrigatório: `notes` (motivo da rejeição)
- [ ] Atualiza status para `rejected`
- [ ] Cria registro em `status_history` com motivo
- [ ] Response 200 com confirmação
- [ ] (Futuro) Notificação ao médico

---

### US-031: Solicitar Informações Adicionais (Admin)

**Como** administrador  
**Eu quero** solicitar informações adicionais ao médico  
**Para que** eu possa esclarecer dúvidas antes de aprovar

**Prioridade:** Média  
**Estimativa:** 2 horas

**Critérios de Aceite:**

- [ ] Endpoint `PUT /api/v1/requests/:id/request-info` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Middleware RBAC para role `admin`
- [ ] Campo obrigatório: `notes` (informações solicitadas)
- [ ] Atualiza status para `pending_info`
- [ ] Cria registro em `status_history`
- [ ] Response 200 com confirmação
- [ ] (Futuro) Notificação ao médico

---

### US-032: Registrar Pagamento (Admin)

**Como** administrador  
**Eu quero** registrar que o pagamento foi realizado  
**Para que** a solicitação seja marcada como paga

**Prioridade:** Alta  
**Estimativa:** 2 horas

**Critérios de Aceite:**

- [ ] Endpoint `PUT /api/v1/requests/:id/pay` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Middleware RBAC para role `admin`
- [ ] Validação: status deve ser `approved`
- [ ] Atualiza status para `paid`
- [ ] Registra `paid_at` e `paid_by`
- [ ] Recebe campos opcionais: `payment_proof`, `notes`
- [ ] Cria registro em `status_history`
- [ ] Response 200 com confirmação
- [ ] (Futuro) Notificação ao médico

---

### US-033: Histórico de Status

**Como** usuário autenticado  
**Eu quero** visualizar o histórico completo de mudanças de status  
**Para que** eu possa rastrear todo o fluxo da solicitação

**Prioridade:** Baixa  
**Estimativa:** 1 hora

**Critérios de Aceite:**

- [ ] Endpoint `GET /api/v1/requests/:id/history` implementado
- [ ] Middleware de autenticação aplicado
- [ ] Validação de propriedade (médico vê só suas, admin vê todas)
- [ ] Ordenação por data (DESC)
- [ ] Inclui nome do usuário que fez a mudança
- [ ] Response 200 com histórico completo

---

## Épico 7 - Frontend Integration

### 🎯 Objetivo

Integrar o frontend existente (prototype-frontend) com as APIs do backend.

---

### US-034: Integração do Login

**Como** desenvolvedor  
**Eu quero** integrar as páginas de login com a API  
**Para que** usuários possam autenticar no sistema

**Prioridade:** Alta  
**Estimativa:** 3 horas

**Critérios de Aceite:**

- [ ] Arquivo `assets/js/api.js` criado com funções de chamada à API
- [ ] Arquivo `assets/js/auth.js` atualizado para usar API real
- [ ] Substituir localStorage de users por chamada `POST /api/v1/auth/login`
- [ ] Armazenar token JWT no localStorage
- [ ] Armazenar refresh token
- [ ] Redirecionar para dashboard após login bem-sucedido
- [ ] Exibir mensagens de erro amigáveis
- [ ] Implementar logout (limpar tokens)
- [ ] Atualizar `medico/login.html` e `admin/login.html`

---

### US-035: Integração do Cadastro

**Como** desenvolvedor  
**Eu quero** integrar a página de cadastro com a API  
**Para que** novos médicos possam se registrar

**Prioridade:** Alta  
**Estimativa:** 3 horas

**Critérios de Aceite:**

- [ ] Criar página `medico/cadastro.html`
- [ ] Formulário com campos: email, senha, CPF, CRM, UF, nome, telefone
- [ ] Validação client-side (senha forte, CPF, email)
- [ ] Chamada `POST /api/v1/auth/register`
- [ ] Redirecionar para upload de documentos KYC após sucesso
- [ ] Exibir mensagens de erro (email duplicado, etc)

---

### US-036: Integração do Upload KYC

**Como** desenvolvedor  
**Eu quero** criar interface para upload de documentos KYC  
**Para que** médicos possam enviar suas fotos

**Prioridade:** Alta  
**Estimativa:** 4 horas

**Critérios de Aceite:**

- [ ] Criar página `medico/upload-kyc.html`
- [ ] Instruções claras sobre cada foto
- [ ] Preview das imagens antes de enviar
- [ ] Upload via `POST /api/v1/auth/upload-kyc-documents`
- [ ] Barra de progresso durante upload
- [ ] Mensagem de confirmação após sucesso
- [ ] Redirecionar para página de "aguardando aprovação"

---

### US-037: Integração do Dashboard Médico

**Como** desenvolvedor  
**Eu quero** integrar o dashboard do médico com a API  
**Para que** ele veja dados reais de suas solicitações

**Prioridade:** Alta  
**Estimativa:** 4 horas

**Critérios de Aceite:**

- [ ] Atualizar `medico/dashboard.html`
- [ ] Substituir `getSolicitacoes()` por chamada `GET /api/v1/requests`
- [ ] Exibir cards com métricas (total solicitado, recebido, pendentes)
- [ ] Listar solicitações recentes
- [ ] Exibir status de cada solicitação com cores
- [ ] Links para detalhes de cada solicitação
- [ ] Botão "Nova Solicitação"

---

### US-038: Integração do Formulário de Nova Solicitação

**Como** desenvolvedor  
**Eu quero** integrar o formulário de nova solicitação com a API  
**Para que** médicos possam criar solicitações reais

**Prioridade:** Alta  
**Estimativa:** 5 horas

**Critérios de Aceite:**

- [ ] Atualizar `medico/nova-solicitacao.html`
- [ ] Carregar empresas via `GET /api/v1/companies`
- [ ] Formulário multi-step funcional
- [ ] Adicionar/remover plantões dinamicamente
- [ ] Cálculo em tempo real de valores (total bruto, taxa, líquido)
- [ ] Upload de comprovantes via `POST /api/v1/documents/upload`
- [ ] Criar solicitação via `POST /api/v1/requests`
- [ ] Enviar para análise via `PUT /api/v1/requests/:id/submit`
- [ ] Redirecionar para detalhes após criação

---

### US-039: Integração da Página de Detalhes

**Como** desenvolvedor  
**Eu quero** integrar a página de detalhes de solicitação com a API  
**Para que** usuários vejam informações completas

**Prioridade:** Alta  
**Estimativa:** 3 horas

**Critérios de Aceite:**

- [ ] Atualizar `medico/detalhes-solicitacao.html`
- [ ] Carregar dados via `GET /api/v1/requests/:id`
- [ ] Exibir dados do médico, empresa, valores
- [ ] Listar plantões em tabela
- [ ] Listar documentos com links para download
- [ ] Exibir histórico de status
- [ ] Badge colorido com status atual

---

### US-040: Integração do Dashboard Admin

**Como** desenvolvedor  
**Eu quero** integrar o dashboard do admin com a API  
**Para que** ele veja métricas e solicitações pendentes

**Prioridade:** Alta  
**Estimativa:** 4 horas

**Critérios de Aceite:**

- [ ] Atualizar `admin/dashboard.html`
- [ ] Carregar métricas via `GET /api/v1/dashboard/admin`
- [ ] Cards com: pendentes triagem, aprovação, pagamento, total pago no mês
- [ ] Gráficos com Chart.js
- [ ] Listar atividades recentes
- [ ] Links rápidos para triagem, aprovações, pagamentos

---

### US-041: Integração da Triagem (Admin)

**Como** desenvolvedor  
**Eu quero** integrar a página de triagem com a API  
**Para que** admins possam gerenciar solicitações pendentes

**Prioridade:** Alta  
**Estimativa:** 4 horas

**Critérios de Aceite:**

- [ ] Atualizar `admin/triagem.html`
- [ ] Carregar solicitações via `GET /api/v1/requests?status=pending`
- [ ] Tabela com dados principais
- [ ] Filtros por data, empresa, médico
- [ ] Botão "Analisar" leva para página de detalhes admin

---

### US-042: Integração da Aprovação (Admin)

**Como** desenvolvedor  
**Eu quero** integrar a página de aprovação com a API  
**Para que** admins possam aprovar/rejeitar solicitações

**Prioridade:** Alta  
**Estimativa:** 5 horas

**Critérios de Aceite:**

- [ ] Atualizar `admin/aprovar.html`
- [ ] Carregar solicitação via `GET /api/v1/requests/:id`
- [ ] Exibir todos os detalhes (médico, plantões, documentos)
- [ ] Botão "Aprovar" chama `PUT /api/v1/requests/:id/approve`
- [ ] Botão "Rejeitar" chama `PUT /api/v1/requests/:id/reject` (com modal para motivo)
- [ ] Botão "Solicitar Informações" chama `PUT /api/v1/requests/:id/request-info`
- [ ] Confirmação via SweetAlert2
- [ ] Redirecionar após ação

---

### US-043: Integração de Pagamentos (Admin)

**Como** desenvolvedor  
**Eu quero** integrar a página de pagamentos com a API  
**Para que** admins possam registrar pagamentos

**Prioridade:** Alta  
**Estimativa:** 3 horas

**Critérios de Aceite:**

- [ ] Atualizar `admin/pagamentos.html`
- [ ] Carregar solicitações via `GET /api/v1/requests?status=approved`
- [ ] Tabela com dados de pagamento (médico, valor líquido, chave PIX)
- [ ] Botão "Registrar Pagamento" chama `PUT /api/v1/requests/:id/pay`
- [ ] Modal para confirmar pagamento e adicionar notas
- [ ] Atualizar lista após pagamento

---

### US-044: Integração de Aprovação de KYC (Admin)

**Como** desenvolvedor  
**Eu quero** criar interface para aprovação de documentos KYC  
**Para que** admins possam validar identidades

**Prioridade:** Alta  
**Estimativa:** 4 horas

**Critérios de Aceite:**

- [ ] Criar página `admin/kyc-pendentes.html`
- [ ] Carregar médicos via `GET /api/v1/doctors/pending-kyc`
- [ ] Exibir lista com dados do médico
- [ ] Visualizar fotos lado a lado (documento + selfie)
- [ ] Botão "Aprovar" chama `POST /api/v1/doctors/:id/verify-kyc` com approved=true
- [ ] Botão "Rejeitar" chama `POST /api/v1/doctors/:id/verify-kyc` com approved=false (com modal para motivo)
- [ ] Confirmação via SweetAlert2
- [ ] Atualizar lista após ação

---

## Épico 8 - Testes e Deploy

### 🎯 Objetivo

Garantir qualidade do código e preparar para produção.

---

### US-045: Testes Unitários - Serviços

**Como** desenvolvedor  
**Eu quero** escrever testes unitários para os serviços  
**Para que** eu garanta que a lógica de negócio funciona corretamente

**Prioridade:** Média  
**Estimativa:** 8 horas

**Critérios de Aceite:**

- [ ] Framework de testes configurado (Jest)
- [ ] Testes para `authService`
- [ ] Testes para `doctorService`
- [ ] Testes para `requestService`
- [ ] Testes para `kycService`
- [ ] Cobertura mínima de 70%
- [ ] Mocks de banco de dados
- [ ] Script `npm test` funcional

---

### US-046: Testes de Integração - APIs

**Como** desenvolvedor  
**Eu quero** escrever testes de integração para os endpoints  
**Para que** eu garanta que as APIs funcionam end-to-end

**Prioridade:** Média  
**Estimativa:** 8 horas

**Critérios de Aceite:**

- [ ] Supertest configurado
- [ ] Testes para rotas de autenticação
- [ ] Testes para rotas de médicos
- [ ] Testes para rotas de empresas
- [ ] Testes para rotas de solicitações
- [ ] Testes para workflow de aprovação
- [ ] Banco de dados de teste (SQLite in-memory)
- [ ] Seed de dados de teste

---

### US-047: Documentação da API

**Como** desenvolvedor  
**Eu quero** documentar todas as APIs  
**Para que** outros desenvolvedores possam usar facilmente

**Prioridade:** Baixa  
**Estimativa:** 4 horas

**Critérios de Aceite:**

- [ ] Swagger/OpenAPI configurado
- [ ] Documentação de todos os endpoints
- [ ] Exemplos de request/response
- [ ] Schemas de validação documentados
- [ ] Interface Swagger UI acessível em `/api-docs`

---

### US-048: Configuração de Ambiente de Produção

**Como** DevOps  
**Eu quero** configurar o servidor de produção  
**Para que** a aplicação possa ser deployada

**Prioridade:** Alta  
**Estimativa:** 4 horas

**Critérios de Aceite:**

- [ ] VPS provisionado (DigitalOcean/AWS)
- [ ] Node.js 20 LTS instalado
- [ ] PM2 instalado e configurado
- [ ] Nginx instalado e configurado como proxy reverso
- [ ] Certbot instalado para SSL (Let's Encrypt)
- [ ] Firewall configurado (UFW)
- [ ] Variáveis de ambiente de produção configuradas

---

### US-049: Deploy Backend

**Como** DevOps  
**Eu quero** fazer deploy do backend  
**Para que** a API esteja disponível

**Prioridade:** Alta  
**Estimativa:** 3 horas

**Critérios de Aceite:**

- [ ] Código buildado (`npm run build`)
- [ ] Arquivos enviados ao servidor (via Git ou rsync)
- [ ] Dependências instaladas no servidor
- [ ] Migrations executadas
- [ ] Seed de dados (opcional)
- [ ] PM2 iniciado com aplicação
- [ ] Health check funcionando (`/api/v1/health`)
- [ ] Logs configurados

**Configuração Nginx:**

```nginx
server {
    listen 80;
    server_name api.credmed.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### US-050: Deploy Frontend

**Como** DevOps  
**Eu quero** fazer deploy do frontend  
**Para que** usuários possam acessar o sistema

**Prioridade:** Alta  
**Estimativa:** 2 horas

**Critérios de Aceite:**

- [ ] Arquivos HTML/CSS/JS otimizados
- [ ] API base URL configurada para produção
- [ ] Arquivos enviados ao servidor
- [ ] Nginx configurado para servir arquivos estáticos
- [ ] SSL configurado (HTTPS)
- [ ] Compressão gzip habilitada
- [ ] Cache headers configurados

**Configuração Nginx:**

```nginx
server {
    listen 443 ssl;
    server_name app.credmed.com.br;

    ssl_certificate /etc/letsencrypt/live/app.credmed.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.credmed.com.br/privkey.pem;

    root /var/www/credmed/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
    }
}
```

---

### US-051: Backup Automático do Banco

**Como** DevOps  
**Eu quero** configurar backup automático do banco SQLite  
**Para que** dados não sejam perdidos

**Prioridade:** Alta  
**Estimativa:** 2 horas

**Critérios de Aceite:**

- [ ] Script de backup criado
- [ ] Cron job configurado (diário às 2h da manhã)
- [ ] Backups armazenados com timestamp
- [ ] Retenção de 30 dias
- [ ] Backup testado (restore)
- [ ] (Opcional) Upload para S3/Google Drive

**Script de backup:**

```bash
#!/bin/bash
DATE=$(date +%Y-%m-%d-%H%M%S)
BACKUP_DIR="/var/backups/credmed"
DB_PATH="/var/www/credmed/backend/database/credmed.sqlite"

mkdir -p $BACKUP_DIR
cp $DB_PATH $BACKUP_DIR/credmed-$DATE.sqlite
find $BACKUP_DIR -type f -mtime +30 -delete
```

---

### US-052: Monitoramento e Logs

**Como** DevOps  
**Eu quero** configurar monitoramento e logs  
**Para que** eu possa identificar problemas rapidamente

**Prioridade:** Média  
**Estimativa:** 3 horas

**Critérios de Aceite:**

- [ ] Winston configurado para logs estruturados
- [ ] Logs salvos em arquivos rotativos
- [ ] PM2 logs acessíveis
- [ ] Monitoramento de CPU/Memória (PM2 dashboard)
- [ ] Alertas para erros críticos (email ou Slack)
- [ ] (Opcional) Integração com Sentry

---

## 📊 Resumo de Estimativas

| Épico                    | User Stories | Estimativa Total |
| ------------------------ | ------------ | ---------------- |
| 1. Setup Inicial         | 5            | ~10 horas        |
| 2. Autenticação          | 6            | ~11 horas        |
| 3. KYC e Gestão Médicos  | 6            | ~15 horas        |
| 4. Gestão de Empresas    | 4            | ~6 horas         |
| 5. Solicitações          | 6            | ~16 horas        |
| 6. Workflow de Aprovação | 6            | ~12 horas        |
| 7. Frontend Integration  | 11           | ~42 horas        |
| 8. Testes e Deploy       | 8            | ~34 horas        |
| **TOTAL**                | **52**       | **~146 horas**   |

**Estimativa de Sprints (40h/semana):**

- **Sprint 1** (Semana 1): Épicos 1 e 2 - Setup + Autenticação ✅
- **Sprint 2** (Semana 2): Épicos 3 e 4 - KYC + Empresas ✅
- **Sprint 3** (Semana 3): Épicos 5 e 6 - Solicitações + Workflow ✅
- **Sprint 4** (Semana 4): Épico 7 (Parte 1) - Frontend (US-034 a US-039) ✅
- **Sprint 5** (Semana 5): Épico 7 (Parte 2) - Frontend (US-040 a US-044) ✅
- **Sprint 6** (Semana 6): Épico 8 - Testes e Deploy ✅

**Prazo estimado:** ~6 semanas (1,5 mês) para MVP1 completo

---

## 🎯 Priorização

### Must Have (MVP1)

- ✅ US-001 a US-017 (Setup + Auth + KYC + Médicos)
- ✅ US-018, US-019 (Empresas básico)
- ✅ US-022 a US-027 (Solicitações)
- ✅ US-029, US-030, US-032 (Aprovar, Rejeitar, Pagar)
- ✅ US-034 a US-044 (Frontend integration)
- ✅ US-048 a US-051 (Deploy e Backup)

### Should Have (Pós-MVP1)

- US-020, US-021 (Editar/Desativar Empresa)
- US-028, US-031 (Em análise, Solicitar info)
- US-033 (Histórico de status)
- US-045, US-046 (Testes)
- US-047 (Documentação Swagger)
- US-052 (Monitoramento avançado)

### Could Have (Futuro)

- Notificações por email/SMS
- Integração com WhatsApp
- Sistema de cashback
- OCR para documentos
- Detecção de face (liveness)
- Dashboard com gráficos avançados
- Exportação de relatórios (PDF/Excel)

---

**Documento criado por:** GitHub Copilot  
**Data:** 15 de Janeiro de 2026  
**Próximo passo:** Iniciar desenvolvimento com US-001
