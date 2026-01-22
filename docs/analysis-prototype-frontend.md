# Análise do Protótipo Frontend Existente

**Data da Análise:** 15 de Janeiro de 2026  
**Analisado por:** GitHub Copilot  
**Objetivo:** Documentar o que já foi desenvolvido antes de iniciar o backend

---

## 📊 Sumário Executivo

O protótipo frontend já está **substancialmente desenvolvido** com:

- ✅ **3 portais completos** (Médico, Empresa, Admin)
- ✅ **Sistema de storage com localStorage** (simulação de backend)
- ✅ **Fluxos de trabalho implementados**
- ✅ **Interface responsiva** (Bootstrap 5)
- ✅ **Funcionalidades interativas** em JavaScript

**Estado:** Protótipo funcional pronto para integração com backend real.

---

## 🗂️ Estrutura de Arquivos

```
prototype-frontend/
├── index.html                  # Seletor de portais (página inicial)
├── README.md                   # Documentação do protótipo
├── DEBUG-STORAGE.md            # Guia de debug do localStorage
├── TESTE-FLUXO.md              # Guia de testes dos fluxos
│
├── assets/
│   ├── css/
│   │   └── custom.css          # Estilos customizados
│   └── js/
│       ├── app.js              # Funções utilitárias globais
│       └── storage.js          # Sistema de persistência (localStorage)
│
├── medico/                     # Portal do Médico
│   ├── login.html
│   ├── dashboard.html
│   ├── nova-solicitacao.html   # Formulário multi-step
│   ├── lista-solicitacoes.html
│   ├── detalhes-solicitacao.html
│   └── perfil.html
│
├── empresa/                    # Portal da Empresa (MedPlus)
│   ├── login.html
│   ├── dashboard.html
│   ├── validacoes.html         # Lista de validações
│   ├── validar.html            # Validar plantões individualmente
│   ├── cashback.html
│   └── historico.html
│
└── admin/                      # Portal Administrativo
    ├── login.html
    ├── dashboard.html
    ├── triagem.html            # Triagem inicial
    ├── aprovacoes.html         # Lista de aprovações
    ├── aprovar.html            # Aprovar/rejeitar solicitações
    ├── pagamentos.html
    └── relatorios.html
```

---

## 🎨 Design e UI/UX

### Stack Frontend

- **Bootstrap 5.3** - Framework CSS responsivo
- **Bootstrap Icons 1.11** - Iconografia
- **JavaScript Vanilla** - Sem frameworks (simplicidade)
- **Custom CSS** - Estilos específicos do sistema

### Características

- ✅ **Totalmente responsivo** (mobile-first)
- ✅ **Menu sidebar** com overlay para mobile
- ✅ **Cards e métricas** visuais
- ✅ **Formulários multi-step** (wizard)
- ✅ **Badges de status** coloridos
- ✅ **Tabelas responsivas**
- ✅ **Toasts e alertas**

---

## 💾 Sistema de Storage (storage.js)

### Funcionalidades Implementadas

O arquivo `storage.js` implementa um **sistema completo de persistência** usando localStorage que simula um backend:

#### **1. Gestão de Solicitações**

```javascript
// Métodos disponíveis:
-init() - // Inicializar dados de exemplo
  resetData() - // Reset para dados iniciais
  getSolicitacoes() - // Obter todas as solicitações
  getSolicitacao(id) - // Obter por ID
  getSolicitacoesMedico(medicoId) - // Filtrar por médico
  criarSolicitacao(dados) - // Criar nova solicitação
  saveSolicitacoes(solicitacoes); // Salvar alterações
```

#### **2. Workflow Completo de Status**

O sistema implementa os seguintes status:

```javascript
AGUARDANDO_TRIAGEM_ADMIN; // Nova solicitação
APROVADO_ADMIN; // Aprovada diretamente pelo admin
AGUARDANDO_VALIDACAO_EMPRESA; // Encaminhada para empresa
VALIDADO_EMPRESA; // Empresa validou plantões
REJEITADO_EMPRESA; // Empresa rejeitou
AGUARDANDO_INFORMACOES_MEDICO; // Admin solicitou mais info
REJEITADO_ADMIN; // Admin rejeitou
PAGO; // Pagamento concluído
```

#### **3. Ações Implementadas**

**Triagem (Admin):**

```javascript
aprovarDiretamente(id, observacoes); // Aprovação sem empresa
encaminharParaEmpresa(id, observacoes); // Enviar para validação
solicitarInformacoes(id, observacoes); // Pedir mais dados
rejeitarSolicitacao(id, observacoes); // Rejeitar
```

**Validação (Empresa):**

```javascript
validarPlantoesEmpresa(id, validacoes); // Validar plantões
rejeitarValidacaoEmpresa(id, observacoes); // Rejeitar validação
```

**Aprovação Final (Admin):**

```javascript
aprovarValidado(id, observacoes); // Aprovar após validação
devolverParaEmpresa(id, observacoes); // Devolver para revisão
solicitarInformacoesValidado(id, obs); // Pedir mais dados
rejeitarValidado(id, observacoes); // Rejeitar
```

**Pagamento (Admin):**

```javascript
registrarPagamento(id, dadosPagamento); // Registrar PIX
```

#### **4. Histórico e Auditoria**

Cada ação adiciona um registro no histórico:

```javascript
{
  data: "2025-12-25T14:30:00",
  acao: "CRIACAO",
  usuario: "Dr. Fernando Silva",
  papel: "MEDICO",
  descricao: "Solicitação criada"
}
```

#### **5. Dados Mockados**

Solicitação de exemplo com estrutura completa:

```javascript
{
  id: "SOL-2025-00042",
  numero: "SOL-2025-00042",
  medicoId: "medico1",
  medicoNome: "Dr. Fernando Silva",
  medicoCRM: "CRM-SP 123456",
  empresaId: "empresa1",
  empresaNome: "MedPlus",
  valorTotal: 5200.00,
  taxa: 182.00,
  taxaPercentual: 3.5,
  valorLiquido: 5018.00,
  cashback: 52.00,
  status: "AGUARDANDO_TRIAGEM_ADMIN",
  dataCriacao: "2025-12-25T14:30:00",
  plantoes: [ /* 3 plantões */ ],
  historico: [ /* ações */ ],
  dadosBancarios: { /* PIX */ },
  documentos: [ /* PDFs */ ],
  observacoes: []
}
```

---

## 🔄 Fluxos Implementados

### 1️⃣ **Fluxo do Médico**

#### **A. Nova Solicitação** (nova-solicitacao.html)

Formulário **multi-step (4 etapas):**

**Step 1 - Empresa e Taxa:**

- Seleção da empresa parceira
- Escolha da taxa de adiantamento (slider/input)
- Simulação de valores em tempo real

**Step 2 - Cadastro de Plantões:**

- Adicionar múltiplos plantões dinamicamente
- Campos: Data, horário início/fim, local, valor
- Lista com opção de editar/excluir

**Step 3 - Revisão:**

- Resumo completo da solicitação
- Cálculos: Valor bruto → Taxa → Valor líquido
- Upload de comprovantes (simulado)
- Termo de aceite

**Step 4 - Confirmação:**

- Geração de número da solicitação
- Mensagem de sucesso
- Botão para ver lista de solicitações

#### **B. Minhas Solicitações** (lista-solicitacoes.html)

- Lista filtrada por médico logado
- Badges de status coloridos
- Ações: Ver detalhes, Cancelar (se pendente)

#### **C. Detalhes da Solicitação** (detalhes-solicitacao.html)

- Informações completas
- Timeline do histórico
- Lista de plantões com validação
- Documentos anexados

#### **D. Dashboard** (dashboard.html)

- Cards com métricas:
  - Limite disponível
  - Solicitações pendentes
  - Total recebido
- Últimas solicitações
- Ações rápidas

---

### 2️⃣ **Fluxo da Empresa** (Portal MedPlus)

#### **A. Validações Pendentes** (validacoes.html)

- Lista de solicitações aguardando validação
- Filtros por status, data, médico
- Ação: Validar

#### **B. Validar Plantões** (validar.html)

- Detalhes da solicitação
- **Validação individual de cada plantão:**
  - Checkbox: Validar/Rejeitar
  - Observações por plantão
  - Total validado recalculado
- Opções finais:
  - ✅ Confirmar Validação
  - ❌ Rejeitar Solicitação Completa

#### **C. Dashboard Empresa** (dashboard.html)

- Métricas:
  - Cashback acumulado
  - Validações pendentes
  - Médicos ativos
- Histórico de validações

#### **D. Cashback** (cashback.html)

- Extrato de cashback acumulado
- Por solicitação validada
- Total disponível

---

### 3️⃣ **Fluxo do Admin** (Portal Charlene)

#### **A. Dashboard** (dashboard.html)

- Métricas principais:
  - Pendentes de aprovação
  - Aprovadas hoje
  - Total adiantado no mês
  - Receita líquida
  - Cashback pago
- Solicitações recentes
- Ações rápidas

#### **B. Triagem** (triagem.html)

**4 opções de ação:**

1. ✅ **Aprovar Diretamente** → Status: APROVADO_ADMIN
2. 📤 **Encaminhar para Empresa** → Status: AGUARDANDO_VALIDACAO_EMPRESA
3. ❓ **Solicitar Mais Informações** → Status: AGUARDANDO_INFORMACOES_MEDICO
4. ❌ **Rejeitar** → Status: REJEITADO_ADMIN

Formulário com:

- Detalhes da solicitação
- Lista de plantões
- Campo de observações
- Botões de ação

#### **C. Aprovações** (aprovacoes.html / aprovar.html)

Lista de solicitações **VALIDADO_EMPRESA**

**4 opções de ação:**

1. ✅ **Aprovar** → Status: APROVADO_ADMIN
2. 🔄 **Devolver para Empresa** → Status: AGUARDANDO_VALIDACAO_EMPRESA
3. ❓ **Solicitar Informações** → Status: AGUARDANDO_INFORMACOES_MEDICO
4. ❌ **Rejeitar** → Status: REJEITADO_ADMIN

#### **D. Pagamentos** (pagamentos.html)

- Lista de solicitações APROVADO_ADMIN
- Registrar pagamento PIX
- Campos:
  - Valor pago
  - Chave PIX usada
  - Comprovante
  - Data/hora
- Muda status para PAGO

#### **E. Relatórios** (relatorios.html)

- Filtros por período
- Exportação (simulada)
- Gráficos de métricas

---

## 🔐 Sistema de Autenticação (Simulado)

### Funcionalidades em app.js

```javascript
// Funções implementadas:
login(role); // Simula login (salva role no localStorage)
logout(); // Limpa localStorage e redireciona
checkAuth(); // Verifica se está logado
```

### Roles Implementados

- `medico` → Acessa portal médico
- `empresa` → Acessa portal empresa
- `admin` → Acessa portal admin

**Nota:** Qualquer email/senha funciona no protótipo (não há validação real)

---

## 🎯 Funcionalidades Utilitárias (app.js)

```javascript
// Formatação
formatCurrency(value); // R$ 1.234,56
formatDate(dateString); // 25/12/2025
formatDateTime(dateString); // 25/12/2025 14:30

// UI
showToast(message, type); // Alert simplificado
toggleMobileMenu(); // Menu responsivo

// Mock Data
mockData.medico; // Dados do médico
mockData.solicitacoes; // Solicitações exemplo
mockData.empresa; // Dados da empresa
mockData.admin; // Dados admin
```

---

## ⚠️ Limitações Atuais (Protótipo)

### 1. **Sem Backend Real**

- Dados em localStorage (volatíl)
- Sem persistência entre dispositivos
- Sem validações server-side

### 2. **Autenticação Simulada**

- Sem JWT real
- Sem validação de credenciais
- Qualquer email/senha funciona

### 3. **Upload de Arquivos Simulado**

- Não salva arquivos reais
- Apenas mock de nomes

### 4. **Sem Validações Avançadas**

- CPF, CRM, CNPJ não validados
- Datas não verificadas
- Duplicatas permitidas

### 5. **Sem Notificações Reais**

- Sem emails
- Sem push notifications
- Apenas alerts JavaScript

---

## 🚀 Próximos Passos para Integração

### **Fase 1: Backend API**

1. ✅ Criar endpoints REST que **replicam** as funções do storage.js
2. ✅ Manter mesma estrutura de dados JSON
3. ✅ Usar os mesmos status/workflows

### **Fase 2: Ajustes no Frontend**

1. Substituir chamadas `AppStorage.*` por chamadas `fetch()` / `axios`
2. Adicionar loader/spinner durante requisições
3. Tratamento de erros HTTP
4. Tokens JWT para autenticação

### **Fase 3: Funcionalidades Faltantes**

1. Sistema de cadastro de médicos **COM KYC** (conforme especificação)
   - Upload real de fotos
   - Validação de identidade
   - Aprovação admin
2. Upload real de documentos
3. Geração de contratos em PDF
4. Sistema de notificações (email)
5. Validações server-side

### **Fase 4: Melhorias**

1. Testes automatizados
2. Documentação da API
3. Logs de auditoria
4. Backup automático

---

## 📝 Observações Importantes

### ✅ **O que está pronto e pode ser reaproveitado:**

1. **Toda a interface HTML/CSS**
   - Apenas substituir chamadas de API
2. **Estrutura de dados JSON**
   - Backend deve usar os mesmos campos
3. **Fluxo de status**
   - Backend deve replicar as transições de status
4. **Lógica de cálculos**
   - Taxa, valor líquido, cashback (pode migrar para backend)

### ⚠️ **O que precisa ser desenvolvido do zero:**

1. **Backend completo** (Node.js + Express + SQLite)
2. **Autenticação JWT real**
3. **Upload de arquivos real** (Multer + filesystem)
4. **Sistema de KYC** (conforme especificação técnica)
5. **Validações server-side**
6. **Geração de PDFs** (contratos)
7. **Envio de emails**
8. **Logs de auditoria** no banco

### 🎯 **Compatibilidade com Especificação Técnica**

| Item Especificado | Status no Protótipo                 | Ação Necessária       |
| ----------------- | ----------------------------------- | --------------------- |
| Portal Médico     | ✅ Pronto                           | Integrar com API      |
| Portal Admin      | ✅ Pronto                           | Integrar com API      |
| Portal Empresa    | ⚠️ Pronto mas será removido no MVP1 | Ignorar no backend    |
| KYC com fotos     | ❌ Não implementado                 | Desenvolver do zero   |
| Autenticação      | ⚠️ Simulada                         | Implementar JWT       |
| Upload de docs    | ⚠️ Simulado                         | Implementar Multer    |
| SQLite            | ❌ Não usado                        | Configurar no backend |
| Validações        | ⚠️ Mínimas                          | Implementar Joi       |

---

## 💡 Recomendações

### **1. Abordagem Incremental**

Começar com endpoints básicos que replicam exatamente o storage.js:

```javascript
// Exemplo: Substituição gradual
// ANTES (protótipo):
const solicitacoes = AppStorage.getSolicitacoes();

// DEPOIS (com backend):
const response = await fetch("/api/v1/requests");
const solicitacoes = await response.json();
```

### **2. Manter Compatibilidade**

Backend deve retornar **mesma estrutura JSON** do protótipo:

```json
{
  "success": true,
  "data": {
    "id": "SOL-2025-00042",
    "numero": "SOL-2025-00042",
    "status": "AGUARDANDO_TRIAGEM_ADMIN",
    ...
  }
}
```

### **3. Priorizar MVP1**

**Remover do escopo inicial:**

- Portal da Empresa (conforme decisão)
- Cashback automatizado
- Relatórios avançados

**Focar em:**

- ✅ Cadastro com KYC
- ✅ Solicitações
- ✅ Triagem e aprovação
- ✅ Pagamentos

---

## 📊 Resumo Estatístico

| Métrica                         | Quantidade                 |
| ------------------------------- | -------------------------- |
| **Páginas HTML**                | 19                         |
| **Portais**                     | 3 (Médico, Empresa, Admin) |
| **Funções JS storage.js**       | 15+                        |
| **Status implementados**        | 8                          |
| **Ações de workflow**           | 12                         |
| **Linhas de código storage.js** | ~524                       |
| **Linhas de código app.js**     | ~150                       |

---

## ✅ Conclusão

O protótipo frontend está **maduro e bem estruturado**, com:

- ✅ Interface completa e responsiva
- ✅ Fluxos de trabalho implementados
- ✅ Sistema de persistência funcional (localStorage)
- ✅ Lógica de negócio clara

**Próximo passo:** Criar backend que **replique a lógica do storage.js** em APIs REST, mantendo compatibilidade de dados para facilitar integração.

---

**Documento gerado por:** GitHub Copilot  
**Data:** 15 de Janeiro de 2026  
**Versão:** 1.0
