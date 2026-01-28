# Especificação Técnica - MVP1

## Sistema CREDMED - Adiantamento de Plantões Médicos

**Data:** 15 de Janeiro de 2026  
**Versão:** MVP1 (2 portais)  
**Status:** Em Planejamento

---

## 📋 Sumário Executivo

Este documento especifica a arquitetura técnica, modelos de dados, APIs e stack tecnológica para o MVP1 do sistema CREDMED - uma plataforma fintech-healthcare para adiantamento de valores de plantões médicos.

**Escopo MVP1:**

- ✅ Portal do Médico
- ✅ Portal do Administrador
- ❌ Portal da Empresa (versão futura)

---

## 🏗️ 1. Arquitetura do Sistema

### 1.1 Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Web)                          │
├──────────────────────┬──────────────────────────────────────┤
│  Portal do Médico    │    Portal do Administrador           │
│  - Login/Cadastro    │    - Dashboard                       │
│  - Dashboard         │    - Triagem                         │
│  - Nova Solicitação  │    - Aprovações                      │
│  - Histórico         │    - Pagamentos                      │
│  - Perfil            │    - Relatórios                      │
└──────────────────────┴──────────────────────────────────────┘
                            ↕ HTTPS / REST API
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND API (Node.js)                   │
├─────────────────────────────────────────────────────────────┤
│  Camada de Autenticação (JWT)                               │
│  ├── Middleware de autenticação                             │
│  ├── Controle de permissões (RBAC)                          │
│  └── Refresh tokens                                         │
├─────────────────────────────────────────────────────────────┤
│  Camada de Negócio (Controllers + Services)                 │
│  ├── AuthService          ├── RequestService                │
│  ├── DoctorService        ├── ApprovalService               │
│  ├── ShiftService         ├── PaymentService                │
│  └── DocumentService      └── NotificationService           │
├─────────────────────────────────────────────────────────────┤
│  Camada de Dados (Repositories)                             │
│  └── SQLite ORM (Sequelize)                                 │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   BANCO DE DADOS                             │
│                   SQLite 3                                   │
│              (arquivo: credmed.sqlite)                       │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  STORAGE DE ARQUIVOS                         │
│              (AWS S3 / Azure Blob / Local)                   │
│           - Comprovantes de plantões                         │
│           - Documentos de identificação                      │
│           - Contratos assinados                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Padrões Arquiteturais

**Backend:**

- **Arquitetura em Camadas** (Layered Architecture)
  - Controllers: Recebem requisições HTTP
  - Services: Lógica de negócio
  - Repositories: Acesso a dados
  - Models: Entidades do domínio

**Frontend:**

- **SPA (Single Page Application)** com navegação client-side
- **Componentização** modular
- **State Management** local (sem Redux no MVP1)

**Segurança:**

- **JWT** para autenticação stateless
- **RBAC** (Role-Based Access Control)
- **HTTPS** obrigatório em produção
- **Bcrypt** para hash de senhas

---

## 💾 2. Modelo de Dados

### 2.1 Diagrama Entidade-Relacionamento

```
┌─────────────────┐         ┌──────────────────┐
│     USERS       │         │    COMPANIES     │
├─────────────────┤         ├──────────────────┤
│ id (PK)         │         │ id (PK)          │
│ email           │         │ name             │
│ password_hash   │         │ cnpj             │
│ role            │    ┌────│ contact_name     │
│ status          │    │    │ contact_phone    │
│ created_at      │    │    │ contact_email    │
│ updated_at      │    │    │ status           │
└─────────────────┘    │    │ cashback_rate    │
         │             │    │ created_at       │
         │             │    └──────────────────┘
         │             │              │
         │             │              │
         ▼             │              │
┌─────────────────┐   │              │
│    DOCTORS      │   │              │
├─────────────────┤   │              │
│ id (PK)         │   │              │
│ user_id (FK)────┘   │              │
│ cpf             │   │              │
│ crm             │   │              │
│ crm_state       │   │              │
│ full_name       │   │              │
│ phone           │   │              │
│ birth_date      │   │              │
│ pix_key         │   │              │
│ pix_key_type    │   │              │
│ bank_name       │   │              │
│ bank_account    │   │              │
│ status          │   │              │
│ created_at      │   │              │
│ updated_at      │   │              │
└─────────────────┘   │              │
         │            │              │
         │            │              │
         │            │              │
         ▼            │              │
┌─────────────────┐   │              │
│  ADV_REQUESTS   │   │              │
├─────────────────┤   │              │
│ id (PK)         │   │              │
│ doctor_id (FK)──┘   │              │
│ company_id (FK)─────┘              │
│ total_amount    │                  │
│ fee_rate        │                  │
│ net_amount      │                  │
│ status          │                  │
│ created_at      │                  │
│ updated_at      │                  │
│ approved_at     │                  │
│ approved_by     │                  │
│ paid_at         │                  │
│ paid_by         │                  │
│ notes           │                  │
└─────────────────┘                  │
         │                           │
         │                           │
         │                           │
         ▼                           │
┌─────────────────┐                  │
│     SHIFTS      │                  │
├─────────────────┤                  │
│ id (PK)         │                  │
│ request_id (FK)─┘                  │
│ company_id (FK)────────────────────┘
│ shift_date      │
│ start_time      │
│ end_time        │
│ hours           │
│ location        │
│ amount          │
│ status          │
│ created_at      │
│ updated_at      │
└─────────────────┘
         │
         │
         ▼
┌─────────────────┐
│   DOCUMENTS     │
├─────────────────┤
│ id (PK)         │
│ request_id (FK)─┘
│ shift_id (FK)   │
│ document_type   │
│ file_name       │
│ file_path       │
│ file_size       │
│ mime_type       │
│ uploaded_by     │
│ uploaded_at     │
└─────────────────┘
         │
         │
         ▼
┌─────────────────┐
│   CONTRACTS     │
├─────────────────┤
│ id (PK)         │
│ request_id (FK)─┘
│ contract_number │
│ contract_text   │
│ signed_at       │
│ signature_ip    │
│ file_path       │
│ created_at      │
└─────────────────┘

┌─────────────────┐
│ STATUS_HISTORY  │
├─────────────────┤
│ id (PK)         │
│ request_id (FK) │
│ old_status      │
│ new_status      │
│ changed_by      │
│ changed_at      │
│ notes           │
└─────────────────┘

┌─────────────────┐
│   AUDIT_LOGS    │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ action          │
│ entity_type     │
│ entity_id       │
│ ip_address      │
│ user_agent      │
│ created_at      │
└─────────────────┘
```

### 2.2 Descrição das Entidades

#### **USERS** (Usuários do Sistema)

Tabela centralizada de autenticação para todos os tipos de usuários.

| Campo         | Tipo         | Restrições       | Descrição                       |
| ------------- | ------------ | ---------------- | ------------------------------- |
| id            | UUID         | PK, NOT NULL     | Identificador único             |
| email         | VARCHAR(255) | UNIQUE, NOT NULL | Email de login                  |
| password_hash | VARCHAR(255) | NOT NULL         | Senha criptografada (bcrypt)    |
| role          | ENUM         | NOT NULL         | 'doctor', 'admin'               |
| status        | ENUM         | NOT NULL         | 'active', 'inactive', 'blocked' |
| created_at    | TIMESTAMP    | NOT NULL         | Data de criação                 |
| updated_at    | TIMESTAMP    | NOT NULL         | Data de atualização             |

**Índices:**

- `idx_users_email` (email)
- `idx_users_role` (role)

---

#### **DOCTORS** (Médicos)

Perfil completo do médico.

| Campo                | Tipo         | Restrições           | Descrição                            |
| -------------------- | ------------ | -------------------- | ------------------------------------ |
| id                   | UUID         | PK, NOT NULL         | Identificador único                  |
| user_id              | UUID         | FK, UNIQUE, NOT NULL | Referência a USERS                   |
| cpf                  | VARCHAR(11)  | UNIQUE, NOT NULL     | CPF (apenas números)                 |
| crm                  | VARCHAR(20)  | NOT NULL             | Número do CRM                        |
| crm_state            | CHAR(2)      | NOT NULL             | UF do CRM (ex: SP, RJ)               |
| full_name            | VARCHAR(255) | NOT NULL             | Nome completo                        |
| phone                | VARCHAR(20)  | NOT NULL             | Telefone/WhatsApp                    |
| birth_date           | DATE         | NULL                 | Data de nascimento                   |
| pix_key              | VARCHAR(255) | NOT NULL             | Chave PIX                            |
| pix_key_type         | ENUM         | NOT NULL             | 'cpf', 'email', 'phone', 'random'    |
| bank_name            | VARCHAR(100) | NULL                 | Nome do banco                        |
| bank_account         | VARCHAR(50)  | NULL                 | Conta bancária                       |
| id_document_photo    | VARCHAR(500) | NULL                 | Path da foto do documento (RG/CNH)   |
| selfie_with_document | VARCHAR(500) | NULL                 | Path da selfie segurando documento   |
| kyc_verified         | BOOLEAN      | DEFAULT FALSE        | Documentos de identidade verificados |
| kyc_verified_at      | TIMESTAMP    | NULL                 | Data da verificação KYC              |
| kyc_verified_by      | UUID         | FK (USERS), NULL     | Admin que verificou                  |
| status               | ENUM         | NOT NULL             | 'pending', 'approved', 'blocked'     |
| created_at           | TIMESTAMP    | NOT NULL             | Data de criação                      |
| updated_at           | TIMESTAMP    | NOT NULL             | Data de atualização                  |

**Índices:**

- `idx_doctors_cpf` (cpf)
- `idx_doctors_crm` (crm, crm_state)
- `idx_doctors_user_id` (user_id)

---

#### **COMPANIES** (Empresas de Escalas Médicas)

Empresas parceiras que empregam os médicos.

| Campo         | Tipo         | Restrições       | Descrição             |
| ------------- | ------------ | ---------------- | --------------------- |
| id            | UUID         | PK, NOT NULL     | Identificador único   |
| name          | VARCHAR(255) | NOT NULL         | Nome da empresa       |
| cnpj          | VARCHAR(14)  | UNIQUE, NOT NULL | CNPJ (apenas números) |
| contact_name  | VARCHAR(255) | NOT NULL         | Nome do contato       |
| contact_phone | VARCHAR(20)  | NOT NULL         | Telefone              |
| contact_email | VARCHAR(255) | NOT NULL         | Email                 |
| status        | ENUM         | NOT NULL         | 'active', 'inactive'  |
| cashback_rate | DECIMAL(5,2) | DEFAULT 0        | Taxa de cashback (%)  |
| created_at    | TIMESTAMP    | NOT NULL         | Data de criação       |
| updated_at    | TIMESTAMP    | NOT NULL         | Data de atualização   |

**Índices:**

- `idx_companies_cnpj` (cnpj)
- `idx_companies_status` (status)

---

#### **ADV_REQUESTS** (Solicitações de Adiantamento)

Solicitação completa de adiantamento feita pelo médico.

| Campo          | Tipo          | Restrições       | Descrição                             |
| -------------- | ------------- | ---------------- | ------------------------------------- |
| id             | UUID          | PK, NOT NULL     | Identificador único                   |
| doctor_id      | UUID          | FK, NOT NULL     | Referência a DOCTORS                  |
| company_id     | UUID          | FK, NOT NULL     | Referência a COMPANIES                |
| total_amount   | DECIMAL(10,2) | NOT NULL         | Valor total bruto                     |
| fee_rate       | DECIMAL(5,2)  | NOT NULL         | Taxa acordada (%)                     |
| net_amount     | DECIMAL(10,2) | NOT NULL         | Valor líquido a receber               |
| status         | ENUM          | NOT NULL         | Ver estados abaixo                    |
| created_at     | TIMESTAMP     | NOT NULL         | Data da solicitação                   |
| updated_at     | TIMESTAMP     | NOT NULL         | Última atualização                    |
| approved_at    | TIMESTAMP     | NULL             | Data de aprovação                     |
| approved_by    | UUID          | FK (USERS)       | Admin que aprovou                     |
| paid_at        | TIMESTAMP     | NULL             | Data do pagamento                     |
| paid_by        | UUID          | FK (USERS)       | Admin que pagou                       |
| notes          | TEXT          | NULL             | Observações                           |

**Status possíveis:**

- `draft` - Rascunho (não enviada)
- `pending` - Aguardando triagem
- `in_review` - Em análise
- `approved` - Aprovada (aguardando pagamento)
- `paid` - Paga
- `rejected` - Rejeitada
- `cancelled` - Cancelada

**Índices:**

- `idx_requests_doctor` (doctor_id)
- `idx_requests_company` (company_id)
- `idx_requests_status` (status)
- `idx_requests_created` (created_at DESC)

---

#### **SHIFTS** (Plantões)

Cada plantão individual registrado na solicitação.

| Campo      | Tipo          | Restrições   | Descrição                          |
| ---------- | ------------- | ------------ | ---------------------------------- |
| id         | UUID          | PK, NOT NULL | Identificador único                |
| request_id | UUID          | FK, NOT NULL | Referência a ADV_REQUESTS          |
| company_id | UUID          | FK, NOT NULL | Empresa do plantão                 |
| shift_date | DATE          | NOT NULL     | Data do plantão                    |
| start_time | TIME          | NOT NULL     | Horário de início                  |
| end_time   | TIME          | NOT NULL     | Horário de término                 |
| hours      | DECIMAL(4,2)  | NOT NULL     | Total de horas                     |
| location   | VARCHAR(255)  | NOT NULL     | Hospital/Local                     |
| amount     | DECIMAL(10,2) | NOT NULL     | Valor do plantão                   |
| status     | ENUM          | NOT NULL     | 'pending', 'validated', 'rejected' |
| created_at | TIMESTAMP     | NOT NULL     | Data de criação                    |
| updated_at | TIMESTAMP     | NOT NULL     | Data de atualização                |

**Índices:**

- `idx_shifts_request` (request_id)
- `idx_shifts_date` (shift_date)
- `idx_shifts_company` (company_id)

---

#### **DOCUMENTS** (Documentos/Comprovantes)

Arquivos anexados às solicitações.

| Campo         | Tipo         | Restrições   | Descrição                 |
| ------------- | ------------ | ------------ | ------------------------- |
| id            | UUID         | PK, NOT NULL | Identificador único       |
| request_id    | UUID         | FK, NULL     | Referência a ADV_REQUESTS |
| shift_id      | UUID         | FK, NULL     | Referência a SHIFTS       |
| document_type | ENUM         | NOT NULL     | Ver tipos abaixo          |
| file_name     | VARCHAR(255) | NOT NULL     | Nome original             |
| file_path     | VARCHAR(500) | NOT NULL     | Path no storage           |
| file_size     | INTEGER      | NOT NULL     | Tamanho em bytes          |
| mime_type     | VARCHAR(100) | NOT NULL     | Tipo MIME                 |
| uploaded_by   | UUID         | FK (USERS)   | Quem fez upload           |
| uploaded_at   | TIMESTAMP    | NOT NULL     | Data do upload            |

**Tipos de documento:**

- `shift_proof` - Comprovante de plantão
- `id_document` - Documento de identificação (RG/CNH)
- `selfie_with_document` - Selfie segurando documento (KYC)
- `crm_document` - CRM
- `bank_proof` - Comprovante bancário
- `contract` - Contrato assinado
- `other` - Outros

**Índices:**

- `idx_documents_request` (request_id)
- `idx_documents_shift` (shift_id)

---

#### **CONTRACTS** (Contratos)

Contratos gerados e assinados digitalmente.

| Campo           | Tipo         | Restrições           | Descrição                 |
| --------------- | ------------ | -------------------- | ------------------------- |
| id              | UUID         | PK, NOT NULL         | Identificador único       |
| request_id      | UUID         | FK, UNIQUE, NOT NULL | Referência a ADV_REQUESTS |
| contract_number | VARCHAR(30)  | UNIQUE, NOT NULL     | Número do contrato        |
| contract_text   | TEXT         | NOT NULL             | Texto completo (HTML)     |
| signed_at       | TIMESTAMP    | NULL                 | Data da assinatura        |
| signature_ip    | VARCHAR(45)  | NULL                 | IP da assinatura          |
| file_path       | VARCHAR(500) | NULL                 | PDF gerado                |
| created_at      | TIMESTAMP    | NOT NULL             | Data de criação           |

**Índices:**

- `idx_contracts_request` (request_id)

---

#### **STATUS_HISTORY** (Histórico de Status)

Rastreamento de todas as mudanças de status.

| Campo      | Tipo        | Restrições   | Descrição                 |
| ---------- | ----------- | ------------ | ------------------------- |
| id         | UUID        | PK, NOT NULL | Identificador único       |
| request_id | UUID        | FK, NOT NULL | Referência a ADV_REQUESTS |
| old_status | VARCHAR(50) | NULL         | Status anterior           |
| new_status | VARCHAR(50) | NOT NULL     | Novo status               |
| changed_by | UUID        | FK (USERS)   | Quem mudou                |
| changed_at | TIMESTAMP   | NOT NULL     | Data da mudança           |
| notes      | TEXT        | NULL         | Observações               |

**Índices:**

- `idx_status_history_request` (request_id, changed_at DESC)

---

#### **AUDIT_LOGS** (Logs de Auditoria)

Registro de todas as ações importantes no sistema.

| Campo       | Tipo         | Restrições   | Descrição           |
| ----------- | ------------ | ------------ | ------------------- |
| id          | UUID         | PK, NOT NULL | Identificador único |
| user_id     | UUID         | FK, NULL     | Referência a USERS  |
| action      | VARCHAR(100) | NOT NULL     | Tipo de ação        |
| entity_type | VARCHAR(50)  | NOT NULL     | Tipo de entidade    |
| entity_id   | UUID         | NULL         | ID da entidade      |
| ip_address  | VARCHAR(45)  | NULL         | IP do usuário       |
| user_agent  | TEXT         | NULL         | User agent          |
| created_at  | TIMESTAMP    | NOT NULL     | Data da ação        |

**Índices:**

- `idx_audit_user` (user_id, created_at DESC)
- `idx_audit_entity` (entity_type, entity_id)

---

## 🔌 3. APIs Principais

### 3.1 Convenções da API

**Base URL:** `/api/v1`

**Autenticação:** Bearer Token (JWT)

```
Authorization: Bearer <token>
```

**Formatos:**

- Request: `application/json` ou `multipart/form-data` (upload)
- Response: `application/json`

**Códigos HTTP:**

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity (validação)
- `500` - Internal Server Error

**Estrutura de Resposta Padrão:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso"
}
```

**Estrutura de Erro:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      {
        "field": "email",
        "message": "Email inválido"
      }
    ]
  }
}
```

---

### 3.2 Endpoints - Autenticação

#### **POST /api/v1/auth/register**

Cadastro de novo médico (Etapa 1 - Dados básicos).

**Request:**

```json
{
  "email": "joao.silva@email.com",
  "password": "Senha@123",
  "cpf": "12345678901",
  "crm": "123456",
  "crm_state": "SP",
  "full_name": "Dr. João Silva",
  "phone": "11999998888"
}
```

**Response 201:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "joao.silva@email.com",
      "role": "doctor"
    },
    "token": "jwt-token",
    "refresh_token": "refresh-token"
  },
  "message": "Cadastro realizado com sucesso"
}
```

---

#### **POST /api/v1/auth/upload-kyc-documents**

Upload de documentos de identidade (Etapa 2 do cadastro).

**Headers:**

- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**

```
id_document_photo: [binary file] (JPG/PNG, max 5MB)
selfie_with_document: [binary file] (JPG/PNG, max 5MB)
```

**Validações:**

- Formatos aceitos: JPG, JPEG, PNG
- Tamanho máximo: 5MB por arquivo
- Ambos os arquivos são obrigatórios
- Detecção básica de face (opcional, futuro)

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id_document_uploaded": true,
    "selfie_uploaded": true,
    "kyc_status": "pending_review",
    "message": "Documentos enviados com sucesso. Aguarde aprovação do administrador."
  }
}
```

**Response 400 (erro de validação):**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE",
    "message": "Formato de arquivo inválido",
    "details": [
      {
        "field": "id_document_photo",
        "message": "Apenas arquivos JPG ou PNG são aceitos"
      }
    ]
  }
}
```

---

#### **POST /api/v1/auth/login**

Login no sistema.

**Request:**

```json
{
  "email": "joao.silva@email.com",
  "password": "Senha@123"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "joao.silva@email.com",
      "role": "doctor",
      "doctor_id": "uuid",
      "full_name": "Dr. João Silva"
    },
    "token": "jwt-token",
    "refresh_token": "refresh-token"
  }
}
```

---

#### **POST /api/v1/auth/refresh**

Renovar token de acesso.

**Request:**

```json
{
  "refresh_token": "refresh-token"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "token": "new-jwt-token"
  }
}
```

---

#### **POST /api/v1/auth/logout**

Logout (invalidar tokens).

**Headers:** `Authorization: Bearer <token>`

**Response 200:**

```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

---

### 3.3 Endpoints - Médicos

#### **GET /api/v1/doctors/profile**

Obter perfil do médico logado.

**Headers:** `Authorization: Bearer <token>`

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "cpf": "123.456.789-01",
    "crm": "123456",
    "crm_state": "SP",
    "full_name": "Dr. João Silva",
    "phone": "11999998888",
    "email": "joao.silva@email.com",
    "pix_key": "12345678901",
    "pix_key_type": "cpf",
    "status": "approved"
  }
}
```

---

#### **POST /api/v1/doctors/:id/verify-kyc**

Aprovar ou rejeitar documentos KYC (Admin only).

**Headers:** `Authorization: Bearer <token>`  
**Role Required:** `admin`

**Request:**

```json
{
  "approved": true,
  "notes": "Documentos verificados e aprovados"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "doctor_id": "uuid",
    "kyc_verified": true,
    "status": "approved",
    "verified_at": "2026-01-15T14:30:00Z"
  },
  "message": "Médico aprovado com sucesso"
}
```

**Request (rejeição):**

```json
{
  "approved": false,
  "notes": "Documento ilegível. Por favor, envie foto mais nítida."
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "doctor_id": "uuid",
    "status": "rejected",
    "rejection_reason": "Documento ilegível. Por favor, envie foto mais nítida."
  },
  "message": "Cadastro rejeitado. Médico será notificado."
}
```

---

#### **GET /api/v1/doctors/pending-kyc**

Listar médicos aguardando aprovação de documentos (Admin only).

**Headers:** `Authorization: Bearer <token>`  
**Role Required:** `admin`

**Query Parameters:**

- `page` (default: 1)
- `limit` (default: 20)

**Response 200:**

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
        "email": "joao.silva@email.com",
        "phone": "11999998888",
        "id_document_photo": "/uploads/kyc/uuid-document.jpg",
        "selfie_with_document": "/uploads/kyc/uuid-selfie.jpg",
        "kyc_verified": false,
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

#### **PUT /api/v1/doctors/profile**

Atualizar perfil.

**Headers:** `Authorization: Bearer <token>`

**Request:**

```json
{
  "phone": "11988887777",
  "pix_key": "joao.silva@email.com",
  "pix_key_type": "email",
  "bank_name": "Banco do Brasil",
  "bank_account": "12345-6"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Perfil atualizado com sucesso"
}
```

---

### 3.4 Endpoints - Empresas (Admin)

#### **GET /api/v1/companies**

Listar empresas cadastradas.

**Headers:** `Authorization: Bearer <token>`  
**Role Required:** `admin`

**Query Parameters:**

- `page` (default: 1)
- `limit` (default: 20)
- `status` (optional: 'active', 'inactive')

**Response 200:**

```json
{
  "success": true,
  "data": {
    "companies": [
      {
        "id": "uuid",
        "name": "Plantões SP",
        "cnpj": "12.345.678/0001-00",
        "contact_name": "Maria Santos",
        "contact_phone": "11988889999",
        "status": "active",
        "cashback_rate": 2.5
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "pages": 1
    }
  }
}
```

---

#### **POST /api/v1/companies**

Cadastrar nova empresa.

**Headers:** `Authorization: Bearer <token>`  
**Role Required:** `admin`

**Request:**

```json
{
  "name": "Plantões SP",
  "cnpj": "12345678000100",
  "contact_name": "Maria Santos",
  "contact_phone": "11988889999",
  "contact_email": "contato@plantoessp.com.br",
  "cashback_rate": 2.5
}
```

**Response 201:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Empresa cadastrada com sucesso"
}
```

---

### 3.5 Endpoints - Solicitações de Adiantamento

#### **POST /api/v1/requests**

Criar nova solicitação.

**Headers:** `Authorization: Bearer <token>`  
**Role Required:** `doctor`

**Request:**

```json
{
  "company_id": "uuid",
  "fee_rate": 3.5,
  "shifts": [
    {
      "shift_date": "2026-01-20",
      "start_time": "08:00",
      "end_time": "20:00",
      "hours": 12,
      "location": "Hospital São Lucas",
      "amount": 2500.0
    },
    {
      "shift_date": "2026-01-22",
      "start_time": "08:00",
      "end_time": "14:00",
      "hours": 6,
      "location": "Hospital Santa Maria",
      "amount": 1200.0
    }
  ]
}
```

**Response 201:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "total_amount": 3700.00,
    "fee_rate": 3.5,
    "net_amount": 3570.50,
    "status": "draft",
    "shifts": [ ... ]
  },
  "message": "Solicitação criada com sucesso"
}
```

---

#### **GET /api/v1/requests**

Listar solicitações.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `page` (default: 1)
- `limit` (default: 20)
- `status` (optional)
- `doctor_id` (optional, apenas admin)
- `company_id` (optional)
- `date_from` (optional)
- `date_to` (optional)

**Response 200:**

```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "uuid",
        "doctor_name": "Dr. João Silva",
        "company_name": "Plantões SP",
        "total_amount": 3700.00,
        "fee_rate": 3.5,
        "net_amount": 3570.50,
        "status": "pending",
        "shifts_count": 2,
        "created_at": "2026-01-15T10:30:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

#### **GET /api/v1/requests/:id**

Obter detalhes de uma solicitação.

**Headers:** `Authorization: Bearer <token>`

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "doctor": {
      "id": "uuid",
      "full_name": "Dr. João Silva",
      "cpf": "123.456.789-01",
      "crm": "123456/SP",
      "pix_key": "12345678901"
    },
    "company": {
      "id": "uuid",
      "name": "Plantões SP",
      "cnpj": "12.345.678/0001-00"
    },
    "total_amount": 3700.00,
    "fee_rate": 3.5,
    "net_amount": 3570.50,
    "status": "pending",
    "shifts": [
      {
        "id": "uuid",
        "shift_date": "2026-01-20",
        "start_time": "08:00",
        "end_time": "20:00",
        "hours": 12,
        "location": "Hospital São Lucas",
        "amount": 2500.00,
        "status": "pending"
      }
    ],
    "documents": [ ... ],
    "status_history": [ ... ],
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-01-15T10:30:00Z"
  }
}
```

---

#### **PUT /api/v1/requests/:id/submit**

Enviar solicitação para análise.

**Headers:** `Authorization: Bearer <token>`  
**Role Required:** `doctor`

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "pending"
  },
  "message": "Solicitação enviada com sucesso"
}
```

---

#### **PUT /api/v1/requests/:id/approve**

Aprovar solicitação (Admin).

**Headers:** `Authorization: Bearer <token>`  
**Role Required:** `admin`

**Request:**

```json
{
  "notes": "Plantões validados com a empresa"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "approved",
    "approved_at": "2026-01-15T14:30:00Z"
  },
  "message": "Solicitação aprovada"
}
```

---

#### **PUT /api/v1/requests/:id/reject**

Rejeitar solicitação (Admin).

**Headers:** `Authorization: Bearer <token>`  
**Role Required:** `admin`

**Request:**

```json
{
  "notes": "Plantão não confirmado pela empresa"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "rejected"
  },
  "message": "Solicitação rejeitada"
}
```

---

#### **PUT /api/v1/requests/:id/pay**

Registrar pagamento (Admin).

**Headers:** `Authorization: Bearer <token>`  
**Role Required:** `admin`

**Request:**

```json
{
  "payment_proof": "file_id_or_path",
  "notes": "PIX enviado"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "paid",
    "paid_at": "2026-01-15T15:00:00Z"
  },
  "message": "Pagamento registrado"
}
```

---

### 3.6 Endpoints - Upload de Documentos

#### **POST /api/v1/documents/upload**

Upload de documento.

**Headers:**

- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**

```
file: [binary]
request_id: uuid
shift_id: uuid (optional)
document_type: shift_proof
```

**Response 201:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "file_name": "comprovante-plantao.pdf",
    "file_size": 245678,
    "document_type": "shift_proof",
    "uploaded_at": "2026-01-15T11:00:00Z"
  },
  "message": "Documento enviado com sucesso"
}
```

---

#### **GET /api/v1/documents/:id/download**

Download de documento.

**Headers:** `Authorization: Bearer <token>`

**Response:** Binary file

---

### 3.7 Endpoints - Dashboard e Estatísticas

#### **GET /api/v1/dashboard/doctor**

Dashboard do médico.

**Headers:** `Authorization: Bearer <token>`  
**Role Required:** `doctor`

**Response 200:**

```json
{
  "success": true,
  "data": {
    "total_requested": 25600.00,
    "total_received": 18400.00,
    "pending_requests": 2,
    "approved_requests": 8,
    "recent_requests": [ ... ]
  }
}
```

---

#### **GET /api/v1/dashboard/admin**

Dashboard do administrador.

**Headers:** `Authorization: Bearer <token>`  
**Role Required:** `admin`

**Response 200:**

```json
{
  "success": true,
  "data": {
    "pending_triagem": 12,
    "pending_approval": 8,
    "pending_payment": 5,
    "total_paid_month": 156700.00,
    "total_doctors": 45,
    "total_companies": 8,
    "recent_activities": [ ... ]
  }
}
```

---

## 🛠️ 4. Stack Tecnológica

### 4.1 Backend

| Tecnologia     | Versão       | Justificativa                                       |
| -------------- | ------------ | --------------------------------------------------- |
| **Node.js**    | 20 LTS       | Runtime JavaScript moderno e performático           |
| **Express.js** | 4.18+        | Framework web minimalista e flexível                |
| **TypeScript** | 5.3+         | Tipagem estática, melhor manutenibilidade           |
| **SQLite**     | 3.45+        | Banco relacional leve, sem servidor, ideal para MVP |
| **Sequelize**  | 6.35+        | ORM maduro com suporte TypeScript e SQLite          |
| **sqlite3**    | 5.1+         | Driver nativo SQLite para Node.js                   |
| **JWT**        | jsonwebtoken | Autenticação stateless                              |
| **Bcrypt**     | 5.1+         | Hash de senhas seguro                               |
| **Multer**     | 1.4+         | Upload de arquivos                                  |
| **Joi**        | 17.11+       | Validação de schemas                                |
| **Winston**    | 3.11+        | Logging estruturado                                 |
| **Helmet**     | 7.1+         | Security headers HTTP                               |
| **Cors**       | 2.8+         | Cross-Origin Resource Sharing                       |
| **dotenv**     | 16.3+        | Gerenciamento de variáveis de ambiente              |

**Estrutura do Projeto Backend:**

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── jwt.ts
│   │   └── storage.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── doctorController.ts
│   │   ├── requestController.ts
│   │   ├── companyController.ts
│   │   └── documentController.ts
│   ├── middlewares/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   ├── validateRequest.ts
│   │   └── uploadFile.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Doctor.ts
│   │   ├── Company.ts
│   │   ├── AdvRequest.ts
│   │   ├── Shift.ts
│   │   ├── Document.ts
│   │   ├── Contract.ts
│   │   └── index.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── doctor.routes.ts
│   │   ├── request.routes.ts
│   │   ├── company.routes.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── doctorService.ts
│   │   ├── kycService.ts
│   │   ├── requestService.ts
│   │   ├── shiftService.ts
│   │   ├── documentService.ts
│   │   ├── contractService.ts
│   │   └── notificationService.ts
│   ├── validators/
│   │   ├── authValidator.ts
│   │   ├── doctorValidator.ts
│   │   ├── kycValidator.ts
│   │   └── requestValidator.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── responseFormatter.ts
│   │   └── dateHelpers.ts
│   ├── types/
│   │   └── express.d.ts
│   ├── app.ts
│   └── server.ts
├── uploads/ (local storage para MVP)
│   ├── kyc/ (documentos de identidade - acesso restrito)
│   ├── shifts/ (comprovantes de plantões)
│   ├── contracts/ (contratos assinados)
│   └── others/ (outros documentos)
├── database/ (SQLite database file)
│   └── credmed.sqlite
├── logs/
├── tests/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

**Vantagens do SQLite para MVP1:**

✅ **Zero Configuração** - Sem necessidade de servidor de banco de dados separado  
✅ **Portabilidade** - Um único arquivo, fácil de fazer backup e migrar  
✅ **Performance** - Extremamente rápido para aplicações de pequeno/médio porte  
✅ **Simplicidade** - Reduz complexidade de infraestrutura no MVP  
✅ **Custo Zero** - Não requer serviços managed ou VPS adicional  
✅ **Desenvolvimento Ágil** - Setup instantâneo, ideal para iteração rápida

**⚠️ Considerações para Produção:**

- SQLite suporta até ~100k requisições/dia tranquilamente
- Para escala maior, migração futura para PostgreSQL/MySQL é direta (usando Sequelize)
- Recomendado backup diário do arquivo .sqlite

---

### 4.2 Frontend

| Tecnologia               | Versão | Justificativa                               |
| ------------------------ | ------ | ------------------------------------------- |
| **HTML5**                | -      | Estrutura semântica                         |
| **CSS3**                 | -      | Estilização responsiva                      |
| **JavaScript (Vanilla)** | ES6+   | Simplicidade para MVP, sem framework pesado |
| **Bootstrap**            | 5.3+   | UI components prontos e responsivos         |
| **Font Awesome**         | 6.5+   | Ícones                                      |
| **Chart.js**             | 4.4+   | Gráficos no dashboard                       |
| **SweetAlert2**          | 11.10+ | Alerts e confirmações                       |
| **Axios**                | 1.6+   | Cliente HTTP                                |

**Estrutura do Projeto Frontend:**

```
frontend/
├── medico/
│   ├── login.html
│   ├── dashboard.html
│   ├── nova-solicitacao.html
│   ├── detalhes-solicitacao.html
│   ├── lista-solicitacoes.html
│   └── perfil.html
├── admin/
│   ├── login.html
│   ├── dashboard.html
│   ├── triagem.html
│   ├── aprovacoes.html
│   ├── aprovar.html
│   ├── pagamentos.html
│   └── relatorios.html
├── assets/
│   ├── css/
│   │   ├── bootstrap.min.css
│   │   ├── custom.css
│   │   └── login.css
│   ├── js/
│   │   ├── bootstrap.bundle.min.js
│   │   ├── axios.min.js
│   │   ├── sweetalert2.min.js
│   │   ├── chart.min.js
│   │   ├── app.js (funções globais)
│   │   ├── api.js (chamadas à API)
│   │   ├── auth.js (autenticação)
│   │   └── storage.js (localStorage)
│   ├── img/
│   └── fonts/
└── index.html (landing page)
```

---

### 4.3 Infraestrutura MVP1

Para o MVP1, infraestrutura simplificada:

| Componente          | Tecnologia                 | Ambiente                         |
| ------------------- | -------------------------- | -------------------------------- |
| **Servidor**        | VPS (DigitalOcean/AWS EC2) | Linux Ubuntu 22.04               |
| **Web Server**      | Nginx                      | Proxy reverso + servir estáticos |
| **Process Manager** | PM2                        | Gerenciamento Node.js            |
| **Banco de Dados**  | SQLite                     | Arquivo local (credmed.sqlite)   |
| **Storage**         | Sistema de arquivos local  | Migrar para S3 futuramente       |
| **SSL**             | Let's Encrypt              | HTTPS gratuito                   |
| **Monitoramento**   | PM2 logs + SQLite logs     | Básico para MVP                  |

---

### 4.4 Ferramentas de Desenvolvimento

| Ferramenta                | Uso                                                    |
| ------------------------- | ------------------------------------------------------ |
| **VS Code**               | IDE principal                                          |
| **DB Browser for SQLite** | Gerenciamento SQLite ou extensão VS Code SQLite Viewer |
| **Postman**               | Testes de API                                          |
| **Git**                   | Controle de versão                                     |
| **GitHub**                | Repositório remoto                                     |
| **Docker** (opcional)     | Containerização para dev                               |

---

## 🔒 5. Segurança

### 5.1 Autenticação e Autorização

**JWT (JSON Web Tokens):**

- Access Token: 1 hora de validade
- Refresh Token: 7 dias de validade
- Armazenamento: `httpOnly` cookies ou localStorage (frontend decide)

**RBAC (Role-Based Access Control):**

- Roles: `doctor`, `admin`
- Middleware de verificação em todas as rotas protegidas

**Senhas:**

- Bcrypt com salt rounds = 10
- Política de senhas:
  - Mínimo 8 caracteres
  - Pelo menos 1 maiúscula
  - Pelo menos 1 número
  - Pelo menos 1 caractere especial

---

### 5.2 Proteções

| Ameaça                   | Proteção                                                       |
| ------------------------ | -------------------------------------------------------------- |
| **SQL Injection**        | ORM (Sequelize) com prepared statements                        |
| **XSS**                  | Sanitização de inputs, CSP headers                             |
| **CSRF**                 | CSRF tokens em formulários                                     |
| **Brute Force**          | Rate limiting (express-rate-limit)                             |
| **File Upload**          | Validação de tipo MIME, tamanho máximo, scan de vírus (futuro) |
| **Dados Sensíveis**      | Criptografia em repouso (banco), HTTPS obrigatório             |
| **Fraude de Identidade** | KYC com foto do documento + selfie, validação manual           |

**Headers de Segurança (Helmet):**

```javascript
helmet.contentSecurityPolicy();
helmet.hsts();
helmet.noSniff();
helmet.frameguard();
helmet.xssFilter();
```

---

### 5.3 LGPD e Compliance

**Dados Pessoais Sensíveis:**

- CPF
- CRM
- Documentos de identificação (RG/CNH)
- **Imagens biométricas** (fotos do documento e selfie)
- Dados bancários
- Dados de saúde (plantões em hospitais)

**Medidas:**

- Criptografia de dados sensíveis
- **Armazenamento seguro de imagens KYC** com acesso restrito
- Logs de acesso a dados pessoais (audit_logs)
- Termo de consentimento no cadastro (incluindo uso de imagem)
- Direito ao esquecimento (soft delete + exclusão de imagens)
- Minimização de dados coletados
- **Retenção limitada**: Imagens KYC podem ser excluídas após aprovação (política a definir)

---

### 5.4 KYC (Know Your Customer) - Validação de Identidade

**Objetivo:** Prevenir fraudes, garantir identidade real dos médicos e cumprir requisitos de compliance financeiro.

**Processo de 2 Etapas:**

1. **Foto do Documento de Identidade (RG ou CNH)**

   - Documento deve estar visível e legível
   - Todas as informações críticas devem estar claras
   - Foto em boa resolução e iluminação

2. **Selfie Segurando o Documento**
   - Rosto do médico e documento devem estar na mesma foto
   - Documento próximo ao rosto
   - Prova de posse física do documento
   - Dificulta uso de documentos roubados/falsificados

**Validações Técnicas:**

```javascript
// Validações no upload
- Formato: JPG, JPEG, PNG
- Tamanho: Máximo 5MB por arquivo
- Dimensões mínimas: 800x600px
- Ambos os arquivos obrigatórios
```

**Validação Manual (Admin):**

```
Checklist de Aprovação:
☐ Nome no documento confere com cadastro
☐ CPF no documento confere com cadastro
☐ Foto do documento está legível
☐ Foto do rosto na selfie confere com documento
☐ CRM ativo no site oficial do conselho
☐ Sem sinais de manipulação nas imagens
```

**Segurança das Imagens:**

- Armazenamento em pasta `/uploads/kyc/` com permissões restritas
- Nomes de arquivo randomizados (UUID)
- Acesso via API apenas com autenticação
- Logs de todas as visualizações
- Opção de excluir após aprovação (LGPD)

**Melhorias Futuras (Pós-MVP):**

- Detecção automática de face (Face API)
- Validação de documento com OCR
- Liveness detection (prova de vida)
- Integração com bureaus de crédito

---

## 📊 6. Fluxos Principais

### 6.1 Fluxo de Solicitação de Adiantamento (Médico)

```
1. Médico faz login
2. Acessa "Nova Solicitação"
3. Seleciona empresa parceira
4. Define taxa de adiantamento
5. Adiciona plantões:
   - Data
   - Horário
   - Local
   - Valor
6. Faz upload de comprovantes
7. Sistema calcula:
   - Total bruto
   - Taxa
   - Valor líquido
8. Médico revisa e submete
9. Sistema gera contrato
10. Médico assina digitalmente
11. Solicitação vai para status "pending"
12. Médico recebe notificação
```

---

### 6.2 Fluxo de Aprovação (Administrador)

```
1. Admin faz login
2. Vê dashboard com solicitações pendentes
3. Acessa "Triagem"
4. Seleciona solicitação para analisar
5. Verifica:
   - Dados do médico
   - Plantões registrados
   - Comprovantes anexados
6. Contata empresa parceira (offline/WhatsApp)
7. Empresa confirma plantões
8. Admin aprova solicitação
9. Solicitação vai para "approved"
10. Admin registra no sistema que PIX foi enviado
11. Solicitação vai para "paid"
12. Médico recebe notificação
```

---

### 6.3 Fluxo de Registro (Novo Médico) - KYC Aprimorado

```
ETAPA 1 - DADOS BÁSICOS:
1. Médico acessa página de cadastro
2. Preenche formulário:
   - Email
   - Senha (com requisitos de segurança)
   - CPF
   - CRM + UF
   - Nome completo
   - Telefone/WhatsApp
3. Sistema valida dados em tempo real:
   - Email único
   - CPF válido e único
   - CRM no formato correto
   - Senha forte
4. Clica em "Criar Conta"
5. Conta criada com status "pending" (parcial)
6. Recebe token JWT temporário

ETAPA 2 - VALIDAÇÃO DE IDENTIDADE (KYC):
7. Sistema redireciona para upload de documentos
8. Médico vê instruções claras:
   a) "Tire uma foto do seu documento (RG ou CNH)"
      - Documento deve estar legível
      - Todas as informações visíveis
      - Boa iluminação

   b) "Tire uma selfie segurando o documento"
      - Rosto e documento devem estar visíveis
      - Documento próximo ao rosto
      - Foto nítida e bem iluminada

9. Médico faz upload das 2 fotos
10. Sistema valida:
    - Formato (JPG/PNG)
    - Tamanho (máx 5MB cada)
    - Ambas as fotos presentes

11. Upload concluído com sucesso
12. Status permanece "pending" (aguardando aprovação admin)
13. Médico recebe mensagem:
    "Cadastro realizado! Seus documentos estão em análise.
     Você receberá um email quando for aprovado."

ETAPA 3 - APROVAÇÃO ADMINISTRATIVA:
14. Admin acessa painel de aprovações
15. Visualiza dados do médico + fotos dos documentos
16. Verifica:
    - Dados cadastrais conferem com documento
    - Foto do documento está legível
    - Selfie confirma identidade
    - CRM está ativo (consulta manual no site do CRM)

17. Admin aprova ou rejeita:

    SE APROVADO:
    - Status muda para "approved"
    - kyc_verified = true
    - Médico recebe email de aprovação
    - Médico pode fazer login e usar o sistema

    SE REJEITADO:
    - Status muda para "rejected"
    - Médico recebe email com motivo
    - Pode tentar novo cadastro ou enviar novos documentos

18. Médico aprovado faz login completo
19. Pode acessar todas as funcionalidades do portal
```

**⚠️ Observações de Segurança:**

- Fotos são armazenadas criptografadas
- Acesso restrito apenas ao médico proprietário e admins
- Logs de auditoria registram todos os acessos
- Após aprovação, fotos podem ser anonimizadas (opcional)

---

## 🚀 7. Deployment e Ambiente

### 7.1 Variáveis de Ambiente

**.env Backend:**

```bash
# Server
NODE_ENV=production
PORT=3000

# Database (SQLite)
DB_PATH=./database/credmed.sqlite
DB_LOGGING=false

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Upload
UPLOAD_PATH=./uploads
KYC_PATH=./uploads/kyc
MAX_FILE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/jpg,image/png

# API
API_BASE_URL=https://api.credmed.com.br

# Email (futuro)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

---

### 7.2 Scripts NPM

**package.json:**

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "migrate": "sequelize-cli db:migrate",
    "migrate:undo": "sequelize-cli db:migrate:undo",
    "seed": "sequelize-cli db:seed:all",
    "test": "jest",
    "lint": "eslint . --ext .ts",
    "format": "prettier --write \"src/**/*.ts\""
  }
}
```

---

## 📝 8. Próximos Passos

### 8.1 Checklist de Desenvolvimento

**Fase 1 - Setup Inicial:**

- [ ] Criar estrutura do projeto backend
- [ ] Configurar TypeScript + ESLint + Prettier
- [ ] Configurar SQLite com Sequelize
- [ ] Setup do Sequelize
- [ ] Criar modelos iniciais
- [ ] Estrutura de pastas para upload (incluindo /kyc)

**Fase 2 - Autenticação:**

- [ ] Implementar registro de usuário (dados básicos)
- [ ] Implementar login
- [ ] JWT tokens (access + refresh)
- [ ] Middleware de autenticação
- [ ] RBAC middleware

**Fase 3 - KYC e Gestão de Médicos:**

- [ ] Endpoint de upload de documentos KYC
- [ ] Validação de imagens (formato, tamanho)
- [ ] Armazenamento seguro de fotos
- [ ] Painel admin: Listagem de médicos pendentes
- [ ] Painel admin: Visualização de documentos KYC
- [ ] Endpoint de aprovação/rejeição KYC
- [ ] Sistema de notificações por email
- [ ] CRUD de perfil do médico
- [ ] Validações completas

**Fase 4 - Gestão de Empresas:**

- [ ] CRUD de empresas (admin only)
- [ ] Listagem e busca

**Fase 5 - Solicitações:**

- [ ] Criar solicitação
- [ ] Listar solicitações
- [ ] Detalhes de solicitação
- [ ] Upload de comprovantes
- [ ] Submeter para análise

**Fase 6 - Workflow de Aprovação:**

- [ ] Triagem (admin)
- [ ] Aprovação/Rejeição
- [ ] Registro de pagamento
- [ ] Histórico de status

**Fase 7 - Frontend:**

- [ ] Integrar HTML existente com API
- [ ] Implementar autenticação no frontend
- [ ] Formulários e validações
- [ ] Upload de arquivos
- [ ] Dashboards

**Fase 8 - Testes e Deploy:**

- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Deploy no servidor
- [ ] Configurar Nginx
- [ ] SSL/HTTPS
- [ ] Backups automáticos

---

## 📚 9. Referências e Recursos

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [PostgreSQL Manual](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/)
- [OWASP Security Cheat Sheet](https://cheatsheetseries.owasp.org/)

---

## ✅ 10. Aprovação

Este documento deve ser revisado e aprovado antes de iniciar o desenvolvimento.

**Revisor:** Wesleysa  
**Data:** **_/_**/2026  
**Status:** ⏳ Aguardando Aprovação

---

**Documento gerado por:** GitHub Copilot  
**Última atualização:** 15 de Janeiro de 2026
