# 🏥 CREDMED - Sistema de Adiantamento de Plantões Médicos

**Sistema fintech-healthcare** que permite médicos solicitarem adiantamento de valores de plantões realizados, com validação e processamento rápido via PIX.

## 🚀 Demo

**▶️ [Abrir Protótipo](index.html)** - Demonstração navegável dos 2 portais

### Portais Disponíveis:

- **👨‍⚕️ Portal Médico** - Solicitação de adiantamentos
- **👨‍💼 Portal Admin** - Triagem e aprovação

_Login padrão: qualquer email / senha: `123456`_

---

## 📋 Status do Projeto

### ✅ Concluído

- **Discovery Completo** (brainstorming + research + especificações)
- **Protótipos Funcionais** (2 portais navegáveis)
- **Documentação Técnica** (specs + user stories + dados)
- **Frontend Preparado** para integração com backend

### 🔄 Próximo

- **Desenvolvimento Backend** (Node.js + Express + SQLite)

---

## 📁 Estrutura

```
📦 CREDMED/
├── 🏠 index.html                    # Seletor de portais (DEMO)
├── 📚 docs/                         # Documentação técnica completa
│   ├── technical-specification-mvp1.md
│   ├── user-stories-mvp1.md
│   ├── brainstorming-session-results.md
│   └── research-market-technical.md
└── 🎨 prototype-frontend/           # Protótipos funcionais
    ├── medico/                      # Portal do Médico (6 páginas)
    ├── admin/                       # Portal Admin (7 páginas)
    ├── empresa/                     # Portal Empresa (6 páginas)*
    └── assets/                      # CSS + JS funcionais
        ├── css/custom.css
        └── js/
            ├── storage.js           # Dados + workflow
            ├── app.js               # Funcionalidades gerais
            └── api.js               # Preparado p/ backend
```

_\*Portal Empresa removido do MVP1_

---

## 🎯 MVP1 - Escopo

### **Portais Incluídos:**

- ✅ **Portal Médico** - Nova solicitação, acompanhamento, histórico
- ✅ **Portal Admin** - Triagem, aprovação, pagamentos, relatórios

### **Funcionalidades Core:**

- ✅ **Solicitação de Adiantamento** - Multi-step form com plantões
- ✅ **Workflow de Aprovação** - Triagem → Aprovação → Pagamento
- ✅ **Gestão de Plantões** - Individual com validação
- ✅ **Status Tracking** - Histórico completo de cada solicitação

### **Decisões de MVP1:**

- 🔄 **Validação Manual** - Admin valida plantões (sem portal empresa)
- 📱 **Web-Only** - Sem app mobile
- 💾 **SQLite** - Banco simples para MVP
- 🔐 **Autenticação Básica** - JWT simples

---

## 🛠️ Stack Planejada

### **Frontend** ✅

- HTML5 + Bootstrap 5 + Vanilla JS
- Sistema híbrido (funciona offline + preparado para API)

### **Backend** 🔄

- Node.js + Express + TypeScript
- SQLite + Sequelize ORM
- JWT para autenticação
- Multer para uploads

### **Deploy** 🔄

- Frontend: GitHub Pages ou Netlify
- Backend: Heroku ou Railway

---

## 📖 Documentação

### **Especificações Técnicas:**

- 📋 [User Stories MVP1](docs/user-stories-mvp1.md) - Épicos + estimativas
- 🏗️ [Especificação Técnica](docs/technical-specification-mvp1.md) - APIs + models
- 🎨 [Análise Frontend](docs/analysis-prototype-frontend.md) - Fluxos implementados

### **Discovery:**

- 💡 [Brainstorming Results](docs/brainstorming-session-results.md) - 35+ funcionalidades identificadas
- 📊 [Research Técnico](docs/research-market-technical.md) - Mercado + regulamentações
- 🎭 [Seed Data](docs/seed-data-personas.md) - Personas para testes

---

## 🚀 Como Executar

### **Protótipos (Atual):**

```bash
# Abrir index.html no browser
# ou usar servidor local:
npx serve .
# → http://localhost:3000
```

### **Backend (Futuro):**

```bash
# Será criado em /backend
npm init -y
npm install express sqlite3 sequelize
npm run dev
```

---

## 📈 Próximos Passos

1. **📦 Setup Backend** - Estrutura Node.js + Express
2. **🗄️ Banco de Dados** - Models + migrations SQLite
3. **🔌 APIs REST** - Endpoints conforme especificação
4. **🔗 Integração** - Conectar frontend ↔ backend
5. **🔐 Autenticação** - JWT + middleware
6. **📤 Deploy MVP** - Heroku + GitHub Pages

---

## 💻 Desenvolvimento

**Metodologia:** BMAD Method (AI-Driven Development)  
**Tipo:** Fintech-Healthcare  
**Ambiente:** Greenfield

### **Status BMAD:**

- ✅ **Discovery** - Brainstorming + Research completos
- ✅ **Especificação** - Technical spec MVP1 finalizada
- 🔄 **Desenvolvimento** - Iniciando backend

---

**🎯 Projeto pronto para desenvolvimento backend e integração!**
├── backend/ # 🔧 API (futuro)
└── BMAD-METHOD/ # 🤖 Framework (após instalação)

````

## 🚀 Como Visualizar os Protótipos

### Opção 1: Abrir Direto no Navegador
```bash
# No explorador de arquivos, navegue até:
prototype-frontend/index.html
# Duplo clique para abrir
````

### Opção 2: Com Live Server (VS Code)

```bash
# 1. Instale a extensão "Live Server"
# 2. Clique com botão direito em index.html
# 3. Selecione "Open with Live Server"
```

## 🧪 Testando os Fluxos

Veja o guia completo de testes em [`prototype-frontend/TESTE-FLUXO.md`](prototype-frontend/TESTE-FLUXO.md)

**Fluxos Disponíveis:**

- ✅ Aprovação Direta pela Admin
- ✅ Validação pela Empresa → Aprovação Admin
- ✅ Ciclo de Revisão (devolução para empresa)
- ✅ Solicitação de Mais Informações
- ✅ Rejeição

## 📋 Próximos Passos (Roadmap)

### ✅ Concluído

- [x] Sessão de Brainstorming
- [x] Identificação de funcionalidades (35+ conceitos)
- [x] Protótipos HTML dos 3 portais (19 páginas)
- [x] Fluxos de navegação e testes

### 🔄 Em Andamento

- [ ] **Research** - Regulamentações, concorrentes, stack
- [ ] **Especificação Técnica** - Arquitetura, modelo de dados
- [ ] **Instalação BMAD-METHOD** - Framework de desenvolvimento

### 📅 Próximas Sprints

- [ ] Desenvolvimento Backend (API REST)
- [ ] Integração Frontend → Backend
- [ ] Autenticação e Autorização
- [ ] Assinatura Digital de Contratos
- [ ] Integração PIX
- [ ] Sistema de Notificações
- [ ] Dashboard com Analytics

## 🔒 Compliance e Regulamentações

**Identificado no Discovery:**

- 🏦 **LGPD** - Dados pessoais e médicos
- 💼 **Banco Central** - Operações financeiras
- 🔐 **KYC/AML** - Know Your Customer / Anti-Money Laundering
- 💳 **PCI-DSS** - Segurança de dados de pagamento (se aplicável)
- 📋 **CFM** - Validação de CRM dos médicos

**Status:** Aguardando research aprofundado

## 🛠️ Stack Tecnológica (Proposta)

### Frontend

- React ou Vue.js
- Bootstrap 5 (já usado nos protótipos)
- JavaScript ES6+

### Backend

- Node.js + Express ou Python + FastAPI
- PostgreSQL (banco de dados)
- JWT (autenticação)
- bcrypt (hash de senhas)

### Integrações

- **PIX API** - Pagamentos instantâneos
- **Assinatura Digital** - DocuSign, Clicksign, ou D4Sign
- **Email** - SendGrid
- **SMS** - Twilio (futuro)
- **Storage** - AWS S3 ou similar

## 🤖 BMAD Method

Este projeto segue o **BMAD-METHOD** (Breakthrough Method of Agile AI-Driven Development).

### Instalando BMAD-METHOD

```bash
cd PROJECT-BMAD-CREDMED
npx bmad-method install
```

**Agentes Disponíveis:**

- 📊 **Analyst** - Research, brainstorming, análise de mercado
- 📝 **PM** - Product Requirements Document (PRD)
- 🏗️ **Architect** - Especificações técnicas, arquitetura
- 🎯 **Scrum Master** - Criação de stories e epics
- 💻 **Dev** - Desenvolvimento de código
- 🧪 **QA** - Testes e qualidade

## 📞 Contatos e Informações

**Projeto:** Sistema de Adiantamento de Plantões Médicos (CREDMED)  
**Tipo:** Fintech-Healthcare  
**Ambiente:** Greenfield (novo projeto)  
**Metodologia:** BMAD Method (Agentic Agile Development)

---

## 📚 Documentação Adicional

- [Brainstorming Session Results](docs/brainstorming-session-results.md) - Discovery completo
- [Workflow Status](docs/bmm-workflow-status.yaml) - Status BMAD
- [Guia de Testes dos Protótipos](prototype-frontend/TESTE-FLUXO.md)
- [README dos Protótipos](prototype-frontend/README.md)

---

**Desenvolvido com 🤖 BMAD-METHOD**
# credmed
