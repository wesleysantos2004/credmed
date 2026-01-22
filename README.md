# 🏥💰 CREDMED - Sistema de Adiantamento de Plantões Médicos

Sistema fintech-healthcare que permite médicos solicitarem adiantamento de valores de plantões realizados, com validação de empresas de escalas médicas e processamento rápido via PIX.

## 📊 Status do Projeto

- **Fase Atual:** Discovery & Prototipagem
- **Versão:** 0.1.0 (Protótipo)
- **Última Atualização:** Janeiro 2026

## 🎯 Visão Geral

O CREDMED resolve a dor de médicos que prestam serviços em empresas de escalas médicas e precisam de adiantamento dos valores antes da data de pagamento. O sistema oferece:

- ⚡ **Solicitação Self-Service** - Médico solicita sem intermediários
- 🔄 **Validação Automatizada** - Fluxo de aprovação com empresa + admin
- 💳 **Pagamento Imediato** - PIX após aprovação
- 📊 **Transparência Total** - Rastreamento de cada plantão individualmente
- 🤝 **Cashback para Empresas** - Incentivo para manter parceria

## 🏗️ Arquitetura do Sistema

### 3 Portais Distintos

1. **Portal do Médico** - Solicitar adiantamentos, acompanhar status
2. **Portal da Empresa** - Validar plantões, histórico, cashback
3. **Portal Admin** - Triagem, aprovação, pagamentos, relatórios

### Fluxos Principais

```
Médico Solicita → Admin Triagem → Empresa Valida → Admin Aprova → PIX Processado
```

## 📁 Estrutura do Projeto

```
PROJECT-BMAD-CREDMED/
├── docs/                                    # 📚 Documentação
│   ├── brainstorming-session-results.md    # Discovery completo
│   ├── bmm-workflow-status.yaml            # Status do workflow BMAD
│   └── sprint-artifacts/                   # Stories, epics (futuro)
├── prototype-frontend/                      # 🎨 Protótipos HTML
│   ├── index.html                          # Seletor de portais
│   ├── medico/                             # 6 páginas do médico
│   ├── empresa/                            # 6 páginas da empresa
│   ├── admin/                              # 7 páginas do admin
│   ├── assets/                             # CSS e JS
│   ├── README.md                           # Guia do protótipo
│   └── TESTE-FLUXO.md                      # Guia completo de testes
├── backend/                                 # 🔧 API (futuro)
└── BMAD-METHOD/                            # 🤖 Framework (após instalação)

```

## 🚀 Como Visualizar os Protótipos

### Opção 1: Abrir Direto no Navegador
```bash
# No explorador de arquivos, navegue até:
prototype-frontend/index.html
# Duplo clique para abrir
```

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
