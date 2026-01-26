export const CREATE_TABLES_SQL =
  /*sql*/
  `
-- =======================================================
-- CREDMED - Sistema de Adiantamento de Plantões Médicos
-- Script de Criação de Tabelas - SQLite
-- Data: 23 de Janeiro de 2026
-- =======================================================

-- 1. Tabela USERS - Autenticação centralizada
CREATE TABLE IF NOT EXISTS users (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL COLLATE NOCASE UNIQUE,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL CHECK (role IN ('doctor', 'admin')),
    "status" TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
) STRICT;

-- Índices para USERS
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- =======================================================

-- 2. Tabela COMPANIES - Empresas parceiras
CREATE TABLE IF NOT EXISTS companies (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL UNIQUE,
    "contact_name" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    "cashback_rate" REAL DEFAULT 0.00,
    "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
) STRICT;

-- Índices para COMPANIES
CREATE INDEX IF NOT EXISTS idx_companies_cnpj ON companies(cnpj);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);

-- =======================================================

-- 3. Tabela DOCTORS - Perfil completo dos médicos
CREATE TABLE IF NOT EXISTS doctors (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL UNIQUE,
    "cpf" TEXT NOT NULL UNIQUE,
    "crm" TEXT NOT NULL,
    "crm_state" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "birth_date" TEXT,
    "pix_key" TEXT NOT NULL,
    "pix_key_type" TEXT NOT NULL CHECK (pix_key_type IN ('cpf', 'email', 'phone', 'random')),
    "bank_name" TEXT,
    "bank_account" TEXT,
    "id_document_photo" TEXT,
    "selfie_with_document" TEXT,
    "kyc_verified" INTEGER DEFAULT 0,
    "kyc_verified_at" TEXT,
    "kyc_verified_by" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'blocked')),
    "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (kyc_verified_by) REFERENCES users(id)
) STRICT;

-- Índices para DOCTORS
CREATE INDEX IF NOT EXISTS idx_doctors_cpf ON doctors(cpf);
CREATE INDEX IF NOT EXISTS idx_doctors_crm ON doctors(crm, crm_state);
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);

-- =======================================================

-- 4. Tabela REQUESTS - Solicitações de adiantamento
CREATE TABLE IF NOT EXISTS requests (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "doctor_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "request_number" TEXT NOT NULL UNIQUE,
    "total_amount" REAL NOT NULL,
    "fee_rate" REAL NOT NULL,
    "net_amount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'in_review', 'approved', 'paid', 'rejected', 'cancelled')),
    "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_at" TEXT,
    "approved_by" INTEGER,
    "paid_at" TEXT,
    "paid_by" INTEGER,
    "notes" TEXT,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    FOREIGN KEY (paid_by) REFERENCES users(id)
) STRICT;

-- Índices para REQUESTS
CREATE INDEX IF NOT EXISTS idx_requests_doctor ON requests(doctor_id);
CREATE INDEX IF NOT EXISTS idx_requests_company ON requests(company_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_created ON requests(created_at DESC);

-- =======================================================

-- 5. Tabela SHIFTS - Plantões individuais
CREATE TABLE IF NOT EXISTS shifts (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "request_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "shift_date" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "hours" REAL NOT NULL,
    "location" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'rejected')),
    "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(id),
    FOREIGN KEY (company_id) REFERENCES companies(id)
) STRICT;

-- Índices para SHIFTS
CREATE INDEX IF NOT EXISTS idx_shifts_request ON shifts(request_id);
CREATE INDEX IF NOT EXISTS idx_shifts_date ON shifts(shift_date);
CREATE INDEX IF NOT EXISTS idx_shifts_company ON shifts(company_id);

-- =======================================================

-- 6. Tabela DOCUMENTS - Documentos/Comprovantes
CREATE TABLE IF NOT EXISTS documents (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "request_id" INTEGER,
    "shift_id" INTEGER,
    "document_type" TEXT NOT NULL CHECK (document_type IN ('shift_proof', 'id_document', 'selfie_with_document', 'crm_document', 'bank_proof', 'contract', 'other')),
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "uploaded_by" INTEGER,
    "uploaded_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(id),
    FOREIGN KEY (shift_id) REFERENCES shifts(id),
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
) STRICT;

-- Índices para DOCUMENTS
CREATE INDEX IF NOT EXISTS idx_documents_request ON documents(request_id);
CREATE INDEX IF NOT EXISTS idx_documents_shift ON documents(shift_id);

-- =======================================================

-- 7. Tabela CONTRACTS - Contratos gerados e assinados
CREATE TABLE IF NOT EXISTS contracts (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "request_id" INTEGER NOT NULL UNIQUE,
    "contract_number" TEXT NOT NULL UNIQUE,
    "contract_text" TEXT NOT NULL,
    "signed_at" TEXT,
    "signature_ip" TEXT,
    "file_path" TEXT,
    "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(id)
) STRICT;

-- Índices para CONTRACTS
CREATE INDEX IF NOT EXISTS idx_contracts_request ON contracts(request_id);

-- =======================================================

-- 8. Tabela STATUS_HISTORY - Histórico de mudanças de status
CREATE TABLE IF NOT EXISTS status_history (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "request_id" INTEGER NOT NULL,
    "old_status" TEXT,
    "new_status" TEXT NOT NULL,
    "changed_by" INTEGER,
    "changed_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    FOREIGN KEY (request_id) REFERENCES requests(id),
    FOREIGN KEY (changed_by) REFERENCES users(id)
) STRICT;

-- Índices para STATUS_HISTORY
CREATE INDEX IF NOT EXISTS idx_status_history_request ON status_history(request_id, changed_at DESC);

-- =======================================================

-- 9. Tabela AUDIT_LOGS - Logs de auditoria do sistema
CREATE TABLE IF NOT EXISTS audit_logs (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" INTEGER,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) STRICT;

-- Índices para AUDIT_LOGS
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);

-- =======================================================
-- TRIGGERS para UPDATE automático do campo updated_at
-- =======================================================

-- Trigger para USERS
CREATE TRIGGER IF NOT EXISTS update_users_updated_at 
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger para COMPANIES
CREATE TRIGGER IF NOT EXISTS update_companies_updated_at 
AFTER UPDATE ON companies
FOR EACH ROW
BEGIN
    UPDATE companies SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger para DOCTORS
CREATE TRIGGER IF NOT EXISTS update_doctors_updated_at 
AFTER UPDATE ON doctors
FOR EACH ROW
BEGIN
    UPDATE doctors SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger para REQUESTS
CREATE TRIGGER IF NOT EXISTS update_requests_updated_at 
AFTER UPDATE ON requests
FOR EACH ROW
BEGIN
    UPDATE requests SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger para SHIFTS
CREATE TRIGGER IF NOT EXISTS update_shifts_updated_at 
AFTER UPDATE ON shifts
FOR EACH ROW
BEGIN
    UPDATE shifts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- =======================================================
-- FIM DO SCRIPT
-- =======================================================
`;

export default CREATE_TABLES_SQL;
