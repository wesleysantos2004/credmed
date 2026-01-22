# Personas e Seed Data - Ambiente de Testes

**Data:** 15 de Janeiro de 2026  
**Objetivo:** Dados para testes de fluxo sem autenticação

---

## 👥 Personas - Médicos

### **1. Dr. Fernando Silva** (ID: `medico-001`)

**Perfil:**

- **CRM:** 123456/SP
- **CPF:** 123.456.789-00
- **Email:** fernando.silva@email.com
- **Telefone:** (11) 98765-4321
- **Especialidade:** Clínico Geral
- **Status:** Ativo

**Cenário de Teste:**

- ✅ Médico experiente, várias solicitações
- ✅ Tem solicitações em diferentes status
- ✅ Usa sistema regularmente

**Solicitações:**

- 1 Aguardando Triagem
- 2 Aprovadas
- 3 Pagas (histórico)

---

### **2. Dra. Ana Costa** (ID: `medico-002`)

**Perfil:**

- **CRM:** 234567/RJ
- **CPF:** 234.567.890-11
- **Email:** ana.costa@email.com
- **Telefone:** (21) 99876-5432
- **Especialidade:** Pediatra
- **Status:** Ativo

**Cenário de Teste:**

- ✅ Primeira solicitação
- ✅ Valores baixos (testar cálculos)
- ✅ Poucos plantões

**Solicitações:**

- 1 Nova (primeira vez)

---

### **3. Dr. Carlos Mendes** (ID: `medico-003`)

**Perfil:**

- **CRM:** 345678/MG
- **CPF:** 345.678.901-22
- **Email:** carlos.mendes@email.com
- **Telefone:** (31) 98765-1234
- **Especialidade:** Ortopedista
- **Status:** Ativo

**Cenário de Teste:**

- ✅ Solicitação rejeitada (histórico)
- ✅ Solicitação aguardando informações
- ✅ Testar fluxo de correção

**Solicitações:**

- 1 Aguardando Informações
- 1 Rejeitada (histórico)

---

### **4. Dra. Julia Santos** (ID: `medico-004`)

**Perfil:**

- **CRM:** 456789/SP
- **CPF:** 456.789.012-33
- **Email:** julia.santos@email.com
- **Telefone:** (11) 97654-3210
- **Especialidade:** Cardiologista
- **Status:** Ativo

**Cenário de Teste:**

- ✅ Valores altos (testar limites)
- ✅ Muitos plantões em uma solicitação
- ✅ Taxas diferentes

**Solicitações:**

- 1 Aprovada (alto valor)

---

### **5. Dr. Roberto Lima** (ID: `medico-005`)

**Perfil:**

- **CRM:** 567890/BA
- **CPF:** 567.890.123-44
- **Email:** roberto.lima@email.com
- **Telefone:** (71) 96543-2109
- **Especialidade:** Anestesista
- **Status:** Ativo

**Cenário de Teste:**

- ✅ Médico sem solicitações ainda
- ✅ Testar tela vazia
- ✅ Testar criação do zero

**Solicitações:**

- Nenhuma (novo no sistema)

---

## 👔 Personas - Administradores

### **1. Charlene Oliveira** (ID: `admin-001`)

**Perfil:**

- **Nome:** Charlene Oliveira
- **Email:** charlene@credmed.com.br
- **Cargo:** Administradora Principal
- **Permissões:** Todas

**Cenário de Teste:**

- ✅ Admin principal que faz tudo
- ✅ Triagem, aprovação e pagamento
- ✅ Visualiza todas as solicitações

---

### **2. Pedro Santos** (ID: `admin-002`)

**Perfil:**

- **Nome:** Pedro Santos
- **Email:** pedro@credmed.com.br
- **Cargo:** Analista Financeiro
- **Permissões:** Visualizar + Aprovar (sem pagamento)

**Cenário de Teste:**

- ✅ Admin com permissões limitadas (futuro)
- ✅ Pode fazer triagem e aprovação
- ✅ Não pode registrar pagamentos

---

## 🏢 Empresas Parceiras

### **1. MedPlus** (ID: `empresa-001`)

**Dados:**

- **CNPJ:** 12.345.678/0001-00
- **Razão Social:** MedPlus Escalas Médicas Ltda
- **Contato:** Maria Santos
- **Email:** contato@medplus.com.br
- **Telefone:** (11) 3333-4444
- **Taxa Cashback:** 1.0%
- **Status:** Ativa

**Hospitais Conveniados:**

- Hospital São Lucas - Centro
- Hospital São Lucas - Zona Sul
- Hospital Santa Maria

---

### **2. PlantõesSP** (ID: `empresa-002`)

**Dados:**

- **CNPJ:** 23.456.789/0001-11
- **Razão Social:** Plantões SP Serviços Médicos S.A.
- **Contato:** João Ferreira
- **Email:** contato@plantoessp.com.br
- **Telefone:** (11) 4444-5555
- **Taxa Cashback:** 1.5%
- **Status:** Ativa

**Hospitais Conveniados:**

- Hospital Albert Einstein
- Hospital Sírio-Libanês

---

### **3. SaúdePlus** (ID: `empresa-003`)

**Dados:**

- **CNPJ:** 34.567.890/0001-22
- **Razão Social:** Saúde Plus Gestão de Recursos Humanos
- **Contato:** Ana Paula Silva
- **Email:** contato@saudeplus.com.br
- **Telefone:** (21) 5555-6666
- **Taxa Cashback:** 0.5%
- **Status:** Ativa

**Hospitais Conveniados:**

- Hospital Copa D'Or
- Hospital Quinta D'Or

---

## 💰 Solicitações de Exemplo (15 solicitações)

### **SOL-2026-00001** - Dr. Fernando Silva

- **Status:** `pending` (Aguardando Triagem)
- **Empresa:** MedPlus
- **Valor Total:** R$ 5.200,00
- **Taxa:** 3.5% (R$ 182,00)
- **Valor Líquido:** R$ 5.018,00
- **Plantões:** 3
  - 20/01/2026 - 19h às 07h - Hospital São Lucas Centro - R$ 1.800,00
  - 22/01/2026 - 19h às 07h - Hospital São Lucas Zona Sul - R$ 1.700,00
  - 25/01/2026 - 07h às 19h - Hospital Santa Maria - R$ 1.700,00
- **Data Criação:** 15/01/2026 10:30

---

### **SOL-2026-00002** - Dr. Fernando Silva

- **Status:** `approved` (Aprovada)
- **Empresa:** MedPlus
- **Valor Total:** R$ 3.600,00
- **Taxa:** 3.5% (R$ 126,00)
- **Valor Líquido:** R$ 3.474,00
- **Plantões:** 2
  - 10/01/2026 - 19h às 07h - Hospital São Lucas Centro - R$ 1.800,00
  - 12/01/2026 - 19h às 07h - Hospital São Lucas Centro - R$ 1.800,00
- **Data Criação:** 08/01/2026 14:20
- **Data Aprovação:** 08/01/2026 16:45
- **Aprovado por:** Charlene Oliveira

---

### **SOL-2026-00003** - Dr. Fernando Silva

- **Status:** `paid` (Paga)
- **Empresa:** MedPlus
- **Valor Total:** R$ 4.000,00
- **Taxa:** 3.5% (R$ 140,00)
- **Valor Líquido:** R$ 3.860,00
- **Plantões:** 2
  - 02/01/2026 - 19h às 07h - Hospital Santa Maria - R$ 2.000,00
  - 04/01/2026 - 19h às 07h - Hospital Santa Maria - R$ 2.000,00
- **Data Criação:** 30/12/2025 09:15
- **Data Aprovação:** 30/12/2025 11:30
- **Data Pagamento:** 30/12/2025 15:00
- **Aprovado por:** Charlene Oliveira
- **Pago por:** Charlene Oliveira
- **Chave PIX:** fernando.silva@email.com

---

### **SOL-2026-00004** - Dr. Fernando Silva

- **Status:** `paid` (Paga)
- **Empresa:** PlantõesSP
- **Valor Total:** R$ 6.500,00
- **Taxa:** 3.0% (R$ 195,00)
- **Valor Líquido:** R$ 6.305,00
- **Plantões:** 2
  - 20/12/2025 - 08h às 20h - Hospital Albert Einstein - R$ 3.500,00
  - 22/12/2025 - 08h às 20h - Hospital Sírio-Libanês - R$ 3.000,00
- **Data Criação:** 18/12/2025 13:45
- **Data Aprovação:** 18/12/2025 17:20
- **Data Pagamento:** 19/12/2025 09:30
- **Pago por:** Pedro Santos

---

### **SOL-2026-00005** - Dra. Ana Costa

- **Status:** `pending` (Aguardando Triagem - Primeira vez)
- **Empresa:** SaúdePlus
- **Valor Total:** R$ 2.400,00
- **Taxa:** 4.0% (R$ 96,00)
- **Valor Líquido:** R$ 2.304,00
- **Plantões:** 2
  - 18/01/2026 - 07h às 19h - Hospital Copa D'Or - R$ 1.200,00
  - 20/01/2026 - 07h às 19h - Hospital Copa D'Or - R$ 1.200,00
- **Data Criação:** 15/01/2026 11:45

---

### **SOL-2026-00006** - Dr. Carlos Mendes

- **Status:** `pending_info` (Aguardando Informações)
- **Empresa:** MedPlus
- **Valor Total:** R$ 4.500,00
- **Taxa:** 3.5% (R$ 157,50)
- **Valor Líquido:** R$ 4.342,50
- **Plantões:** 3
  - 12/01/2026 - 19h às 07h - Hospital São Lucas Centro - R$ 1.500,00
  - 14/01/2026 - 19h às 07h - Hospital São Lucas Centro - R$ 1.500,00
  - 16/01/2026 - 19h às 07h - Hospital Santa Maria - R$ 1.500,00
- **Data Criação:** 10/01/2026 08:30
- **Observação Admin:** "Favor enviar comprovante do plantão de 16/01"

---

### **SOL-2026-00007** - Dr. Carlos Mendes

- **Status:** `rejected` (Rejeitada)
- **Empresa:** MedPlus
- **Valor Total:** R$ 3.000,00
- **Taxa:** 3.5% (R$ 105,00)
- **Valor Líquido:** R$ 2.895,00
- **Plantões:** 2
  - 05/01/2026 - 19h às 07h - Hospital São Lucas Centro - R$ 1.500,00
  - 07/01/2026 - 19h às 07h - Hospital São Lucas Centro - R$ 1.500,00
- **Data Criação:** 03/01/2026 14:50
- **Data Rejeição:** 04/01/2026 10:15
- **Rejeitado por:** Charlene Oliveira
- **Motivo:** "Plantões não confirmados pela empresa"

---

### **SOL-2026-00008** - Dra. Julia Santos

- **Status:** `approved` (Aprovada - Alto valor)
- **Empresa:** PlantõesSP
- **Valor Total:** R$ 12.000,00
- **Taxa:** 2.5% (R$ 300,00)
- **Valor Líquido:** R$ 11.700,00
- **Plantões:** 4
  - 16/01/2026 - 08h às 20h - Hospital Albert Einstein - R$ 3.000,00
  - 18/01/2026 - 08h às 20h - Hospital Albert Einstein - R$ 3.000,00
  - 20/01/2026 - 08h às 20h - Hospital Sírio-Libanês - R$ 3.000,00
  - 22/01/2026 - 08h às 20h - Hospital Sírio-Libanês - R$ 3.000,00
- **Data Criação:** 14/01/2026 16:20
- **Data Aprovação:** 15/01/2026 09:10
- **Aprovado por:** Charlene Oliveira

---

### **SOL-2026-00009** - Dr. Fernando Silva

- **Status:** `paid` (Paga)
- **Empresa:** MedPlus
- **Valor Total:** R$ 3.200,00
- **Taxa:** 3.5% (R$ 112,00)
- **Valor Líquido:** R$ 3.088,00
- **Plantões:** 2
  - 10/12/2025 - 19h às 07h - Hospital São Lucas Centro - R$ 1.600,00
  - 12/12/2025 - 19h às 07h - Hospital Santa Maria - R$ 1.600,00
- **Data Criação:** 08/12/2025 10:00
- **Data Pagamento:** 09/12/2025 14:30

---

### **SOL-2026-00010** - Dra. Ana Costa (vazia para teste)

**Observação:** Persona sem solicitações além da primeira

---

### **SOL-2026-00011** - Dr. Fernando Silva

- **Status:** `in_review` (Em Análise)
- **Empresa:** MedPlus
- **Valor Total:** R$ 2.800,00
- **Taxa:** 3.5% (R$ 98,00)
- **Valor Líquido:** R$ 2.702,00
- **Plantões:** 2
  - 28/01/2026 - 19h às 07h - Hospital São Lucas Centro - R$ 1.400,00
  - 30/01/2026 - 19h às 07h - Hospital Santa Maria - R$ 1.400,00
- **Data Criação:** 15/01/2026 15:30
- **Em análise desde:** 15/01/2026 16:00

---

### **SOL-2026-00012** - Dra. Julia Santos

- **Status:** `pending` (Aguardando Triagem)
- **Empresa:** SaúdePlus
- **Valor Total:** R$ 7.200,00
- **Taxa:** 3.0% (R$ 216,00)
- **Valor Líquido:** R$ 6.984,00
- **Plantões:** 3
  - 25/01/2026 - 08h às 20h - Hospital Copa D'Or - R$ 2.400,00
  - 27/01/2026 - 08h às 20h - Hospital Copa D'Or - R$ 2.400,00
  - 29/01/2026 - 08h às 20h - Hospital Quinta D'Or - R$ 2.400,00
- **Data Criação:** 15/01/2026 17:10

---

### **SOL-2026-00013** - Dr. Carlos Mendes

- **Status:** `paid` (Paga)
- **Empresa:** PlantõesSP
- **Valor Total:** R$ 5.500,00
- **Taxa:** 3.0% (R$ 165,00)
- **Valor Líquido:** R$ 5.335,00
- **Plantões:** 2
  - 15/12/2025 - 08h às 20h - Hospital Albert Einstein - R$ 2.800,00
  - 17/12/2025 - 08h às 20h - Hospital Albert Einstein - R$ 2.700,00
- **Data Pagamento:** 18/12/2025 10:45

---

### **SOL-2026-00014** - Dra. Julia Santos

- **Status:** `paid` (Paga)
- **Empresa:** PlantõesSP
- **Valor Total:** R$ 8.000,00
- **Taxa:** 2.5% (R$ 200,00)
- **Valor Líquido:** R$ 7.800,00
- **Plantões:** 2
  - 05/01/2026 - 08h às 20h - Hospital Sírio-Libanês - R$ 4.000,00
  - 07/01/2026 - 08h às 20h - Hospital Sírio-Libanês - R$ 4.000,00
- **Data Pagamento:** 08/01/2026 11:20

---

### **SOL-2026-00015** - Dr. Carlos Mendes

- **Status:** `approved` (Aprovada)
- **Empresa:** SaúdePlus
- **Valor Total:** R$ 3.800,00
- **Taxa:** 3.5% (R$ 133,00)
- **Valor Líquido:** R$ 3.667,00
- **Plantões:** 2
  - 23/01/2026 - 07h às 19h - Hospital Copa D'Or - R$ 1.900,00
  - 25/01/2026 - 07h às 19h - Hospital Quinta D'Or - R$ 1.900,00
- **Data Aprovação:** 15/01/2026 14:25

---

## 📊 Resumo Estatístico

### Por Status:

- **Aguardando Triagem (pending):** 3 solicitações
- **Em Análise (in_review):** 1 solicitação
- **Aprovada (approved):** 3 solicitações
- **Aguardando Info (pending_info):** 1 solicitação
- **Rejeitada (rejected):** 1 solicitação
- **Paga (paid):** 6 solicitações

### Por Médico:

- **Dr. Fernando Silva:** 6 solicitações
- **Dra. Ana Costa:** 1 solicitação
- **Dr. Carlos Mendes:** 4 solicitações
- **Dra. Julia Santos:** 3 solicitações
- **Dr. Roberto Lima:** 0 solicitações (novo)

### Por Empresa:

- **MedPlus:** 9 solicitações
- **PlantõesSP:** 4 solicitações
- **SaúdePlus:** 2 solicitações

### Valores:

- **Menor:** R$ 2.400,00
- **Maior:** R$ 12.000,00
- **Média:** R$ 4.980,00
- **Total geral:** R$ 74.700,00

---

## 🎯 Cenários de Teste Cobertos

✅ **Médico com várias solicitações** (Fernando)  
✅ **Médico novo no sistema** (Roberto)  
✅ **Médico com primeira solicitação** (Ana)  
✅ **Solicitações em todos os status**  
✅ **Valores baixos, médios e altos**  
✅ **Diferentes empresas**  
✅ **Diferentes taxas**  
✅ **Histórico de rejeição**  
✅ **Aguardando informações**  
✅ **Diferentes quantidades de plantões**

---

**Arquivo criado por:** GitHub Copilot  
**Data:** 15 de Janeiro de 2026  
**Pronto para:** Seed database
