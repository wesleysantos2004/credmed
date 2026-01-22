# Research - Mercado e Técnica

## Sistema de Adiantamento de Plantões Médicos (CREDMED)

**Data:** 02 de Janeiro de 2026  
**Fase:** Discovery  
**Responsável:** Analyst Agent

---

## 📋 Sumário Executivo

Este documento apresenta o resultado da pesquisa de mercado e técnica para o projeto CREDMED, um sistema fintech-healthcare que permite adiantamento de valores de plantões médicos. A pesquisa abrange regulamentações financeiras e de saúde brasileiras, análise de concorrentes, stack tecnológica recomendada e considerações de segurança e compliance.

### Principais Conclusões

- **Compliance Crítico:** Projeto requer atenção especial a LGPD (dados de saúde sensíveis) e regulamentações financeiras do Banco Central
- **Viabilidade Regulatória:** Sistema pode ser operado como SCD (Sociedade de Crédito Direto) ou parceria com instituições financeiras
- **Mercado Promissor:** Lacuna identificada - fintechs focadas especificamente em profissionais de saúde
- **Stack Recomendada:** Node.js/Python + PostgreSQL + AWS/Azure, com forte ênfase em segurança

---

## 🏛️ 1. Regulamentações Financeiras

### 1.1 Banco Central do Brasil - Fintechs

#### Sociedade de Crédito Direto (SCD)

**Definição e Características:**

- Realiza operações de crédito via plataforma eletrônica com **recursos próprios**
- **NÃO pode** fazer captação de recursos do público
- Autorização necessária do Banco Central

**Aplicabilidade ao CREDMED:**

- ✅ **Modelo Compatível:** CREDMED pode operar como SCD
- ✅ Adiantamento com recursos próprios da fintech
- ✅ Seleção de clientes baseada em critérios verificáveis (histórico de plantões, empresa parceira)

**Serviços Permitidos:**

- Análise de crédito para terceiros
- Cobrança de crédito de terceiros
- Distribuição de seguro relacionado às operações
- Emissão de moeda eletrônica

**Requisitos:**

- Capital mínimo
- Comprovação de origem dos recursos
- Capacidade econômico-financeira compatível
- Autorização prévia do Banco Central

**Referências:**

- Resoluções CMN 4.656 e 4.657 de Abril/2018
- [Site Oficial BC sobre Fintechs](https://www.bcb.gov.br/estabilidadefinanceira/fintechs)

---

### 1.2 Sistema PIX

#### Características do PIX

**Vantagens para o CREDMED:**

- ✅ **Transferências instantâneas** (segundos)
- ✅ **Disponível 24/7** - plantões são a qualquer hora
- ✅ **Custo baixo** para empresas
- ✅ **Seguro** - mecanismos robustos de segurança
- ✅ **Rastreável** - facilita conciliação e auditoria

**Funcionalidades Relevantes:**

- **PIX Automático (2025):** Pagamento automático de contas recorrentes
  - _Possível uso:_ Repagamento automático de adiantamentos
- **PIX Agendado:** Agendar pagamentos
  - _Possível uso:_ Agendar repasse aos médicos
- **PIX Cobrança:** Emitir cobranças integradas
  - _Possível uso:_ Cobrança de taxas ou parcelas

**Segurança do PIX:**

- Mecanismo Especial de Devolução (MED)
- Bloqueio cautelar
- Limites noturnos configuráveis
- Botão de emergência (2024)

**Estatísticas (Out/2025):**

- +170 milhões de usuários (80% da população)
- +7 bilhões de transações/mês
- +R$ 3 trilhões em volume mensal

**Aplicação ao Projeto:**

- ✅ Médico recebe adiantamento via PIX em segundos após aprovação
- ✅ Empresa redireciona pagamento via PIX após plantão realizado
- ✅ Baixo custo operacional

---

### 1.3 KYC e AML (Know Your Customer / Anti-Money Laundering)

#### Requisitos Obrigatórios

**KYC - Conheça Seu Cliente:**

- ✅ Identificação completa do médico (CPF, CRM, endereço)
- ✅ Comprovação de vínculo com empresa de escalas
- ✅ Histórico financeiro e creditício
- ✅ Análise de capacidade de pagamento

**AML - Prevenção à Lavagem de Dinheiro:**

- ✅ Monitoramento de transações suspeitas
- ✅ Relatórios ao COAF (Conselho de Controle de Atividades Financeiras)
- ✅ Políticas de compliance
- ✅ Registro de todas as operações financeiras

**Implementação Prática:**

```
1. Cadastro do Médico
   - Upload de documentos (RG, CPF, CRM, comprovante residência)
   - Validação facial (biometria)
   - Consulta a bureaus de crédito (Serasa, SPC)

2. Validação da Empresa
   - CNPJ ativo
   - Contrato de parceria
   - Histórico de pagamentos

3. Monitoramento Contínuo
   - Transações acima de R$ 10.000 (reportar)
   - Padrões atípicos de solicitações
   - Mudanças repentinas de comportamento
```

**Sistemas Necessários:**

- Integração com CPF/CNPJ (Receita Federal)
- Integração com bureaus de crédito
- Sistema de scoring interno
- Dashboard de monitoramento AML

---

### 1.4 PCI-DSS (Payment Card Industry Data Security Standard)

#### Aplicabilidade ao CREDMED

**Mesmo sem cartões de crédito, PCI-DSS é relevante:**

- ✅ Boas práticas de segurança de dados financeiros
- ✅ Criptografia de dados em trânsito e repouso
- ✅ Controle de acesso rigoroso
- ✅ Monitoramento e logs de acesso

**Princípios Aplicáveis:**

1. **Firewalls** em todas as camadas
2. **Senhas fortes** + MFA (Multi-Factor Authentication)
3. **Criptografia** de dados sensíveis (AES-256)
4. **Antivírus** e atualizações constantes
5. **Controle de acesso** baseado em papéis (RBAC)
6. **Logs detalhados** de todas as operações
7. **Testes de segurança** regulares (penetration testing)
8. **Políticas de segurança** documentadas

---

## 🏥 2. Regulamentações de Saúde e Privacidade

### 2.1 LGPD (Lei Geral de Proteção de Dados) - Lei 13.709/2018

#### Dados Pessoais Sensíveis no CREDMED

**Artigo 5º, Inciso II - Dado Pessoal Sensível:**

> "dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, **dado referente à saúde** ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural"

**Dados de Saúde no CREDMED:**

- ✅ CRM (Conselho Regional de Medicina)
- ✅ Especialidade médica
- ✅ Local de plantão (hospital, clínica)
- ✅ Horário de plantão (pode inferir condição de trabalho)

**⚠️ ATENÇÃO CRÍTICA:**
Esses dados requerem **consentimento específico e destacado** do titular (Art. 11, Inciso I).

---

#### Bases Legais Aplicáveis (Art. 7º e 11)

**Principais bases legais para tratar dados no CREDMED:**

1. **Consentimento (Art. 11, I):**

   - Médico consente de forma específica para uso dos dados
   - Consentimento deve ser destacado no contrato

2. **Execução de Contrato (Art. 7º, V):**

   - Tratamento necessário para executar o contrato de adiantamento

3. **Tutela da Saúde (Art. 11, II, f):**

   - Profissionais de saúde realizando atividades relacionadas

4. **Legítimo Interesse (Art. 7º, IX):**
   - Para validação de plantões e prevenção de fraudes

**Implementação Prática:**

```
✅ Termo de Consentimento Específico
   - Destaque para dados de saúde
   - Finalidades claras e específicas
   - Possibilidade de revogar consentimento

✅ Transparência Total
   - Política de Privacidade clara
   - Informar quem acessa os dados
   - Informar período de retenção

✅ Direitos do Titular (Art. 18)
   - Confirmação de tratamento
   - Acesso aos dados
   - Correção de dados
   - Portabilidade
   - Eliminação
```

---

#### Obrigações da Fintech (Controlador de Dados)

**Artigo 37 - Registro de Operações:**

- ✅ Manter registro detalhado de todas as operações de tratamento

**Artigo 39 - Encarregado (DPO - Data Protection Officer):**

- ✅ Indicar um encarregado pela proteção de dados
- ✅ Publicar contato do encarregado no site
- ✅ Canal de comunicação com titulares e ANPD

**Artigo 46 - Segurança:**

- ✅ Medidas técnicas e administrativas para proteger dados
- ✅ Prevenção de acessos não autorizados
- ✅ Criptografia desde a concepção (Privacy by Design)

**Artigo 48 - Notificação de Incidentes:**

- ✅ Comunicar ANPD e titulares em caso de vazamento
- ✅ Prazo razoável definido pela ANPD
- ✅ Descrever natureza dos dados, riscos e medidas tomadas

---

#### Penalidades (Art. 52) - Vigentes desde Agosto/2021

**Sanções Administrativas Aplicáveis:**

- ⚠️ **Advertência** com prazo para correção
- ⚠️ **Multa simples:** até 2% do faturamento, limitada a R$ 50 milhões por infração
- ⚠️ **Multa diária**
- ⚠️ **Publicização da infração**
- ⚠️ **Bloqueio ou eliminação dos dados**

**Gradação considera:**

- Gravidade e natureza das infrações
- Boa-fé do infrator
- Cooperação com autoridade
- Adoção de políticas de boas práticas
- Medidas de minimização de dano

---

### 2.2 Autoridade Nacional de Proteção de Dados (ANPD)

**Criada pela Lei 13.853/2019:**

- Agência Nacional de Proteção de Dados (desde MP 1.317/2025)
- Autarquia vinculada ao Ministério da Justiça e Segurança Pública
- Autonomia técnica e decisória

**Competências da ANPD (Art. 55-J):**

- Fiscalizar e aplicar sanções
- Zelar pela proteção de dados pessoais
- Editar normas e regulamentos
- Aprovar relatórios de impacto
- Realizar auditorias

**Aplicação ao CREDMED:**

- ✅ Elaborar Relatório de Impacto à Proteção de Dados (RIPD)
- ✅ Manter canal direto com ANPD
- ✅ Seguir diretrizes e regulamentos publicados
- ✅ Preparar para possíveis auditorias

---

### 2.3 Outras Regulamentações de Saúde

#### Conselho Federal de Medicina (CFM)

**Relevância para CREDMED:**

- Validação de CRM ativo
- Verificação de especialidade
- Consulta a situações disciplinares

**API/Integração:**

- [Portal CFM](https://portal.cfm.org.br/)
- Consulta pública de médicos
- Verificação de CRM por UF

---

#### Código de Ética Médica

**Sigilo Profissional:**

- CREDMED não deve expor dados do paciente (não aplicável, pois sistema não lida com pacientes)
- Dados do médico devem ser mantidos confidenciais

---

## 🔍 3. Análise de Concorrentes

### 3.1 Fintechs de Crédito para Profissionais de Saúde

#### Concorrentes Diretos (Especializados)

**1. ⚕️ Creditas - Empréstimo com Garantia**

- **Modelo:** Crédito com garantia de imóvel ou veículo
- **Público:** Geral, incluindo profissionais de saúde
- **Diferencial:** Taxas mais baixas por ter garantia
- **Gap para CREDMED:** Não foca em adiantamento de salário/plantões

**2. 💳 Credihome**

- **Modelo:** Empréstimo com garantia de imóvel
- **Público:** Profissionais liberais
- **Diferencial:** Taxas competitivas (0,99% a.m.)
- **Gap para CREDMED:** Processo mais demorado, requer garantia

**3. 🏥 BizCapital (foco B2B Healthcare)**

- **Modelo:** Antecipação de recebíveis para clínicas e hospitais
- **Público:** Empresas de saúde (não médicos diretamente)
- **Diferencial:** Antecipa recebimentos de convênios
- **Gap para CREDMED:** Não atende médicos PF diretamente

---

#### Concorrentes Indiretos

**4. 💰 Creditas Salário**

- **Modelo:** Adiantamento salarial para funcionários CLT
- **Público:** Empresas parceiras
- **Diferencial:** Desconto em folha
- **Gap para CREDMED:** Médicos são PJ/autônomos, não CLT

**5. 🚗 Uber - Adiantamento para Motoristas**

- **Modelo:** Adiantamento de corridas
- **Público:** Motoristas Uber
- **Diferencial:** Integração nativa na plataforma
- **Gap para CREDMED:** Não aplicável a profissionais de saúde

**6. 🏦 Bancos Tradicionais (Bradesco, Itaú, Santander)**

- **Modelo:** Empréstimo pessoal
- **Público:** Geral
- **Diferencial:** Maior rede de agências
- **Gap para CREDMED:**
  - Burocracia
  - Taxas altas (3-8% a.m.)
  - Processo demorado (dias/semanas)
  - Não entendem o nicho de plantões

---

### 3.2 Empresas de Escalas Médicas (Parceiros Potenciais)

**Principais Players:**

1. **MedPlus Escalas Médicas**

   - Gestão de escalas e plantões
   - Pagamento mensal aos médicos
   - Potencial parceiro para validação

2. **CredPlant (Fictício - similar real)**

   - Intermediação entre hospitais e médicos
   - Potencial para integração de dados

3. **Plataformas de Telemedicina**
   - Doctoralia, Conexa Saúde, Telemedicina
   - Podem ser parceiros futuros

---

### 3.3 Análise SWOT - CREDMED vs Concorrentes

#### Forças (Strengths)

- ✅ **Nicho Específico:** Foco exclusivo em médicos plantonistas
- ✅ **Processo Rápido:** Adiantamento em minutos via PIX
- ✅ **Sem Garantia:** Não exige imóvel ou veículo como garantia
- ✅ **Validação Automática:** Integração com empresas de escalas
- ✅ **Transparência:** Rastreamento de cada plantão

#### Fraquezas (Weaknesses)

- ⚠️ **Dependência de Parcerias:** Precisa de empresas de escalas como parceiras
- ⚠️ **Risco de Crédito:** Adiantamento sem garantia real
- ⚠️ **Regulação Complexa:** LGPD + dados de saúde + regulação financeira
- ⚠️ **MVP Manual:** Sem integração automática inicial

#### Oportunidades (Opportunities)

- 🚀 **Mercado Inexplorado:** Nenhuma fintech focada especificamente nisso
- 🚀 **Expansão:** Outros profissionais de saúde (enfermeiros, fisioterapeutas)
- 🚀 **Cashback para Empresas:** Incentivo financeiro para parceiros
- 🚀 **Dados Valiosos:** Analytics sobre mercado de plantões

#### Ameaças (Threats)

- ⚠️ **Entrada de Grandes Players:** Bancos ou fintechs grandes podem copiar
- ⚠️ **Mudanças Regulatórias:** BC ou ANPD podem endurecer regras
- ⚠️ **Inadimplência:** Médicos podem não pagar (risco de crédito)
- ⚠️ **Resistência de Empresas:** Empresas de escalas podem não querer parceria

---

### 3.4 Diferencial Competitivo do CREDMED

**Proposta de Valor Única:**

```
"Adiantamento de salário de plantões médicos em minutos,
sem burocracia, com validação automática pela empresa de escalas."
```

**Por que médicos escolheriam CREDMED:**

1. ✅ **Velocidade:** Dinheiro na conta em segundos (PIX)
2. ✅ **Facilidade:** Solicita pelo app, sem ir ao banco
3. ✅ **Sem Garantia:** Não precisa dar imóvel ou carro como garantia
4. ✅ **Taxa Justa:** Negociável, transparente, competitiva
5. ✅ **Especializado:** Sistema entende o ciclo de plantões

**Por que empresas escolheriam CREDMED:**

1. ✅ **Cashback:** Recebe retorno financeiro por manter parceria
2. ✅ **Retenção de Médicos:** Médicos satisfeitos ficam mais na empresa
3. ✅ **Sem Custo Operacional:** CREDMED cuida de tudo
4. ✅ **Compliance:** Redirecionamento de pagamento é legal e transparente

---

## 💻 4. Stack Tecnológica Recomendada

### 4.1 Arquitetura Geral

**Modelo Proposto: Arquitetura de Microserviços**

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Web App)                       │
│  React.js + TypeScript + Tailwind CSS                       │
│  PWA (Progressive Web App) para mobile                       │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS / WSS
┌───────────────────────▼─────────────────────────────────────┐
│                   API GATEWAY (Kong / AWS API Gateway)       │
│  Autenticação (JWT) + Rate Limiting + Load Balancer         │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
│  Auth Service│ │Credit Svc  │ │Payment Svc │
│  Node.js     │ │Python/Fast │ │Node.js     │
│              │ │API         │ │            │
└───────┬──────┘ └─────┬──────┘ └─────┬──────┘
        │              │              │
┌───────▼──────────────▼──────────────▼──────┐
│         PostgreSQL (Primary Database)       │
│         + Redis (Cache)                     │
└─────────────────────────────────────────────┘
```

---

### 4.2 Backend - Linguagem e Framework

#### Opção 1: Node.js (Recomendado para MVP)

**Vantagens:**

- ✅ **JavaScript Full-Stack:** Desenvolvedores podem trabalhar em front e back
- ✅ **Ecossistema Rico:** NPM com milhares de bibliotecas
- ✅ **Performance:** Assíncrono por natureza (ideal para I/O)
- ✅ **Community:** Grande comunidade, fácil contratar

**Frameworks Recomendados:**

- **Express.js:** Simples, leve, maduro
- **NestJS:** Estruturado, TypeScript nativo, similar ao Angular
- **Fastify:** Mais rápido que Express

**Stack Sugerida:**

```javascript
- Node.js 20 LTS
- NestJS (TypeScript)
- Prisma ORM (acesso ao banco)
- Jest (testes)
- JWT (autenticação)
- bcrypt (hash de senhas)
```

---

#### Opção 2: Python (Recomendado para Crédito/Scoring)

**Vantagens:**

- ✅ **Machine Learning:** Excelente para análise de crédito e scoring
- ✅ **Bibliotecas Financeiras:** Pandas, NumPy, Scikit-learn
- ✅ **Legibilidade:** Código mais limpo e fácil de manter
- ✅ **Data Science:** Futuro analytics sobre plantões

**Frameworks Recomendados:**

- **FastAPI:** Moderno, rápido, tipagem com Pydantic
- **Django:** Completo, admin panel nativo, ORM robusto
- **Flask:** Leve, flexível

**Stack Sugerida:**

```python
- Python 3.12
- FastAPI
- SQLAlchemy (ORM)
- Pydantic (validação)
- pytest (testes)
- PassLib (hash de senhas)
- Celery (tarefas assíncronas)
```

---

#### Opção 3: Arquitetura Híbrida (Ideal para Produção)

**Combinação Estratégica:**

```
✅ Node.js (NestJS)
   - API Gateway
   - Autenticação e Autorização
   - Serviço de Pagamentos (integração PIX)
   - Notificações

✅ Python (FastAPI)
   - Análise de Crédito
   - Scoring e ML
   - Relatórios e Analytics
   - Cálculo de Taxas
```

**Comunicação entre Serviços:**

- REST API
- gRPC (mais rápido que REST)
- Message Queue (RabbitMQ / AWS SQS)

---

### 4.3 Banco de Dados

#### Banco Principal: PostgreSQL

**Por que PostgreSQL:**

- ✅ **ACID Compliant:** Transações financeiras requerem consistência
- ✅ **Open Source:** Sem custo de licença
- ✅ **Performance:** Excelente para leitura e escrita
- ✅ **JSON Support:** Flexibilidade para dados semi-estruturados
- ✅ **Extensões:** PostGIS (geo), pg_cron (agendamento)

**Modelo de Dados Sugerido:**

```sql
-- Principais Tabelas
medicos
empresas
solicitacoes
plantoes
pagamentos
transacoes
usuarios
audit_log
```

---

#### Cache: Redis

**Uso:**

- ✅ Session Store (JWT tokens)
- ✅ Cache de queries frequentes (dashboard)
- ✅ Rate Limiting
- ✅ Fila de jobs (ex: envio de emails)

---

#### Armazenamento de Arquivos: S3 (AWS) ou Azure Blob

**Uso:**

- ✅ Upload de documentos (RG, CRM, comprovantes)
- ✅ Contratos assinados digitalmente
- ✅ Logs de auditoria (arquivamento)

---

### 4.4 Infraestrutura Cloud

#### Opção 1: AWS (Amazon Web Services)

**Serviços Recomendados:**

```
✅ EC2 / ECS / Fargate: Deploy de containers
✅ RDS PostgreSQL: Banco gerenciado
✅ ElastiCache Redis: Cache gerenciado
✅ S3: Storage de arquivos
✅ CloudFront: CDN para front-end
✅ API Gateway: Gerenciamento de APIs
✅ Lambda: Funções serverless (webhooks)
✅ SQS/SNS: Message Queue
✅ CloudWatch: Monitoramento e logs
✅ Cognito: Autenticação (opcional)
✅ WAF: Firewall de aplicação web
```

**Custo Estimado (MVP):**

- Instâncias EC2/Fargate: ~$50-100/mês
- RDS PostgreSQL: ~$50-80/mês
- Outros serviços: ~$30-50/mês
- **Total: ~$130-230/mês**

---

#### Opção 2: Azure (Microsoft Azure)

**Serviços Recomendados:**

```
✅ App Service / AKS: Deploy de apps
✅ Azure Database for PostgreSQL: Banco gerenciado
✅ Azure Cache for Redis: Cache
✅ Blob Storage: Arquivos
✅ Azure CDN: CDN
✅ Azure Functions: Serverless
✅ Service Bus: Message Queue
✅ Application Insights: Monitoramento
✅ Azure AD B2C: Autenticação
✅ Azure WAF: Firewall
```

**Vantagens Azure:**

- Integração nativa com .NET (se for usar C#)
- Compliance mais fácil no Brasil (data centers locais)

---

#### Opção 3: Google Cloud Platform (GCP)

**Serviços Recomendados:**

```
✅ Cloud Run / GKE: Deploy de containers
✅ Cloud SQL PostgreSQL: Banco gerenciado
✅ Memorystore Redis: Cache
✅ Cloud Storage: Arquivos
✅ Cloud CDN: CDN
✅ Cloud Functions: Serverless
✅ Pub/Sub: Message Queue
✅ Cloud Monitoring: Monitoramento
✅ Firebase Auth: Autenticação (opcional)
```

---

### 4.5 Frontend - Web App

#### Tecnologias Recomendadas

**Framework: React.js**

**Stack Completa:**

```javascript
✅ React 18
✅ TypeScript (tipagem estática)
✅ Vite (build tool - mais rápido que Webpack)
✅ React Router (navegação)
✅ Tailwind CSS (estilização)
✅ Shadcn/ui (componentes)
✅ React Query (gerenciamento de estado assíncrono)
✅ Zod (validação de formulários)
✅ Axios (requisições HTTP)
✅ React Hook Form (formulários)
```

**Alternativas:**

- **Next.js:** Se precisar de SSR (Server-Side Rendering) para SEO
- **Vue.js:** Mais simples, curva de aprendizado menor
- **Angular:** Mais estruturado, mas mais complexo

---

#### PWA (Progressive Web App)

**Por que PWA:**

- ✅ Funciona em mobile sem precisar de app nativo
- ✅ Pode ser instalado na tela inicial
- ✅ Funciona offline (service workers)
- ✅ Notificações push
- ✅ Menor custo de desenvolvimento (não precisa de iOS + Android)

**Implementação:**

```javascript
// service-worker.js
// Permite funcionar offline
// Cache de assets estáticos
// Background sync de solicitações
```

---

### 4.6 Autenticação e Autorização

#### JWT (JSON Web Tokens)

**Fluxo:**

```
1. Usuário faz login (email + senha)
2. Backend valida credenciais
3. Backend gera JWT assinado com secret
4. Frontend armazena JWT (httpOnly cookie ou localStorage)
5. Toda requisição envia JWT no header Authorization: Bearer <token>
6. Backend valida JWT e autoriza acesso
```

**Payload do JWT:**

```json
{
  "sub": "user_id_12345",
  "role": "medico",
  "email": "dr.joao@example.com",
  "iat": 1704153600,
  "exp": 1704240000
}
```

---

#### MFA (Multi-Factor Authentication)

**Implementação:**

- ✅ **SMS:** Código via Twilio ou AWS SNS
- ✅ **Email:** Código via SendGrid ou AWS SES
- ✅ **Authenticator App:** TOTP (Google Authenticator, Authy)

**Quando exigir MFA:**

- Login de novo dispositivo
- Operações críticas (aprovar pagamento)
- Alteração de dados bancários

---

#### RBAC (Role-Based Access Control)

**Papéis (Roles):**

```javascript
const roles = {
  MEDICO: {
    permissions: ["read:own", "create:solicitacao", "update:own"],
  },
  EMPRESA: {
    permissions: ["read:solicitacoes", "validate:plantao"],
  },
  ADMIN: {
    permissions: ["read:all", "update:all", "approve:payment"],
  },
};
```

---

### 4.7 Assinatura Digital de Contratos

#### Opções de Implementação

**1. Clicksign (SaaS Brasileiro)**

- ✅ Integração via API
- ✅ Validade jurídica (ICP-Brasil)
- ✅ Notificações automáticas
- ✅ Custo: ~R$ 0,50 - R$ 2,00 por assinatura
- [https://www.clicksign.com](https://www.clicksign.com)

**2. DocuSign (Internacional)**

- ✅ Líder global
- ✅ Integração via API
- ✅ Mais caro que Clicksign
- [https://www.docusign.com](https://www.docusign.com)

**3. D4Sign (Brasileiro)**

- ✅ Mais barato
- ✅ API simples
- ✅ Validade jurídica
- [https://www.d4sign.com.br](https://www.d4sign.com.br)

**4. Implementação Própria (Mais Complexo)**

- ⚠️ Requer certificado ICP-Brasil
- ⚠️ Maior custo de desenvolvimento
- ⚠️ Responsabilidade legal maior

**Recomendação para MVP:**

- **Clicksign** (custo/benefício + compliance)

---

### 4.8 Integração com PIX

#### Opções de Integração

**1. API PIX do Banco (Direto)**

- ✅ Sem intermediários
- ✅ Taxas menores
- ⚠️ Requer conta jurídica PJ
- ⚠️ Cada banco tem API diferente

**Bancos com API PIX:**

- Banco do Brasil
- Bradesco
- Itaú
- Santander
- Nubank Business
- Inter Empresas

**2. Gateway de Pagamento (Intermediário)**

- ✅ Unifica APIs de vários bancos
- ✅ Mais fácil de integrar
- ⚠️ Taxa adicional (1-2% + tarifa fixa)

**Gateways Recomendados:**

- **Asaas:** Focado em SaaS, PIX integrado
- **Iugu:** Bom para marketplaces
- **Pagar.me:** Da Stone, confiável
- **Mercado Pago:** Amplo alcance

**Recomendação para MVP:**

- **Asaas** (facilidade + custo/benefício)

**Fluxo PIX no CREDMED:**

```
1. Solicitação aprovada
2. Backend gera cobrança PIX via Asaas
3. Asaas transfere valor para conta do médico
4. Webhook notifica CREDMED do sucesso
5. Atualiza status no banco de dados
```

---

### 4.9 Monitoramento e Observabilidade

#### Ferramentas Essenciais

**1. Logs: ELK Stack ou Datadog**

```
✅ Elasticsearch: Busca e análise de logs
✅ Logstash: Coleta e processamento
✅ Kibana: Visualização
```

**Alternativa:** **Datadog** (SaaS, mais fácil)

**2. Métricas: Prometheus + Grafana**

```
✅ Prometheus: Coleta de métricas
✅ Grafana: Dashboards visuais
```

**Métricas Importantes:**

- Taxa de solicitações aprovadas/rejeitadas
- Tempo de resposta das APIs
- Taxa de erros (4xx, 5xx)
- Uso de CPU e memória
- Latência do banco de dados

**3. APM (Application Performance Monitoring): New Relic ou Datadog**

```
✅ Rastreamento de transações
✅ Identificação de gargalos
✅ Alertas em tempo real
```

**4. Uptime Monitoring: UptimeRobot ou Pingdom**

```
✅ Verifica se site está no ar
✅ Alerta via email/SMS/Slack
```

---

### 4.10 CI/CD (Integração e Deploy Contínuo)

#### Pipeline Recomendado

**Ferramentas:**

- **GitHub Actions** (integrado ao GitHub)
- **GitLab CI/CD**
- **CircleCI**
- **Jenkins** (self-hosted)

**Fluxo de Deploy:**

```yaml
# .github/workflows/deploy.yml

name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Tests
        run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker Image
        run: docker build -t credmed-api:latest .
      - name: Push to Registry
        run: docker push credmed-api:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to AWS ECS
        run: aws ecs update-service --cluster prod --service credmed-api
```

---

## 🛡️ 5. Segurança e Compliance

### 5.1 Checklist de Segurança

#### Infraestrutura

```
✅ Firewall (WAF) em todas as entradas
✅ VPC privada para banco de dados
✅ Certificado SSL/TLS (HTTPS obrigatório)
✅ DDoS protection (CloudFlare / AWS Shield)
✅ Backups automáticos diários
✅ Disaster Recovery Plan
```

#### Aplicação

```
✅ Validação de inputs (prevenir SQL Injection)
✅ Sanitização de dados (prevenir XSS)
✅ Rate Limiting (prevenir brute force)
✅ CORS configurado corretamente
✅ Headers de segurança (CSP, X-Frame-Options)
✅ Secrets em variáveis de ambiente (nunca no código)
```

#### Dados

```
✅ Criptografia em trânsito (TLS 1.3)
✅ Criptografia em repouso (AES-256)
✅ Hash de senhas (bcrypt com salt)
✅ Tokenização de dados sensíveis
✅ Anonimização para analytics
```

---

### 5.2 Testes de Segurança

**Tipos de Testes:**

1. **SAST** (Static Application Security Testing)

   - Ferramentas: SonarQube, Snyk
   - Analisa código em busca de vulnerabilidades

2. **DAST** (Dynamic Application Security Testing)

   - Ferramentas: OWASP ZAP, Burp Suite
   - Testa aplicação em execução

3. **Penetration Testing**

   - Contratar empresa especializada (1-2x por ano)
   - Simula ataque real

4. **Dependency Scanning**
   - Ferramentas: npm audit, Dependabot
   - Verifica bibliotecas vulneráveis

---

### 5.3 Políticas de Compliance

**Documentos Obrigatórios:**

```
✅ Política de Privacidade
✅ Termos de Uso
✅ Política de Cookies
✅ Relatório de Impacto à Proteção de Dados (RIPD)
✅ Política de Segurança da Informação
✅ Plano de Resposta a Incidentes
✅ Política de Retenção de Dados
```

---

## 📊 6. Análise de Custos Estimados (MVP)

### 6.1 Custos de Infraestrutura (Mensal)

| Item           | Provedor                | Custo/Mês  |
| -------------- | ----------------------- | ---------- |
| Servidor (API) | AWS EC2 t3.medium       | R$ 100     |
| Banco de Dados | AWS RDS PostgreSQL      | R$ 150     |
| Cache          | AWS ElastiCache Redis   | R$ 50      |
| Storage (S3)   | AWS S3 (100GB)          | R$ 20      |
| CDN            | CloudFlare / CloudFront | R$ 30      |
| Backup         | AWS Backup              | R$ 30      |
| Monitoring     | Datadog / CloudWatch    | R$ 80      |
| **SUBTOTAL**   |                         | **R$ 460** |

---

### 6.2 Custos de SaaS / APIs (Mensal)

| Item               | Provedor                   | Custo/Mês  |
| ------------------ | -------------------------- | ---------- |
| Assinatura Digital | Clicksign (100 docs)       | R$ 100     |
| Gateway PIX        | Asaas (taxa por transação) | Variável\* |
| Email Transacional | SendGrid (100k emails)     | R$ 80      |
| SMS (MFA)          | Twilio (1000 SMS)          | R$ 50      |
| Analytics          | Mixpanel / Amplitude       | R$ 50      |
| **SUBTOTAL**       |                            | **R$ 280** |

\*Taxa Asaas: ~1,5% + R$ 0,50 por transação PIX

---

### 6.3 Custos de Desenvolvimento (One-Time)

| Item                          | Estimativa de Horas | Custo (R$ 100/h) |
| ----------------------------- | ------------------- | ---------------- |
| Backend API                   | 200h                | R$ 20.000        |
| Frontend Web                  | 150h                | R$ 15.000        |
| Integrações (PIX, Assinatura) | 80h                 | R$ 8.000         |
| Segurança e Compliance        | 60h                 | R$ 6.000         |
| Testes e QA                   | 80h                 | R$ 8.000         |
| Deploy e DevOps               | 40h                 | R$ 4.000         |
| **TOTAL MVP**                 | **610h**            | **R$ 61.000**    |

---

### 6.4 Custos Operacionais (Mensal)

| Item                              | Custo/Mês    |
| --------------------------------- | ------------ |
| Infraestrutura                    | R$ 460       |
| SaaS / APIs                       | R$ 280       |
| Suporte Técnico (1 dev part-time) | R$ 4.000     |
| **TOTAL MENSAL**                  | **R$ 4.740** |

---

## 📅 7. Roadmap Técnico Sugerido

### Fase 1: MVP (3-4 meses)

**Sprint 1-2 (Mês 1):**

- ✅ Setup de infraestrutura (AWS, banco, CI/CD)
- ✅ Autenticação e autorização
- ✅ CRUD de médicos, empresas, solicitações

**Sprint 3-4 (Mês 2):**

- ✅ Integração com gateway PIX (Asaas)
- ✅ Fluxo de aprovação (triagem, validação)
- ✅ Upload e gestão de documentos

**Sprint 5-6 (Mês 3):**

- ✅ Assinatura digital de contratos (Clicksign)
- ✅ Dashboard e relatórios
- ✅ Notificações (email, SMS)

**Sprint 7-8 (Mês 4):**

- ✅ Testes de segurança e compliance
- ✅ Ajustes finais e otimizações
- ✅ Deploy em produção (MVP)

---

### Fase 2: Pós-MVP (6 meses)

**Q2 2026:**

- ✅ Sistema de scoring de crédito (ML)
- ✅ Integração com bureaus (Serasa, SPC)
- ✅ Analytics avançado
- ✅ App mobile nativo (iOS + Android)

**Q3 2026:**

- ✅ Open Finance / Open Banking
- ✅ PIX Automático para repagamento
- ✅ Cashback automático para empresas
- ✅ Programa de indicação (referral)

---

## 🎯 8. Recomendações Finais

### 8.1 Prioridades Críticas

1. **🔒 Segurança e Compliance em Primeiro Lugar**

   - LGPD não é opcional - dados de saúde são sensíveis
   - Investir em auditoria de segurança antes de lançar
   - Contratar DPO (Data Protection Officer)

2. **🤝 Parcerias Estratégicas**

   - Fechar acordos com 2-3 empresas de escalas antes do MVP
   - Validar hipóteses com médicos reais
   - Garantir que empresas aceitarão redirecionamento de pagamento

3. **📊 Métricas desde o Dia 1**

   - Taxa de conversão (solicitação → aprovação)
   - Tempo médio de aprovação
   - Taxa de inadimplência
   - NPS (Net Promoter Score)

4. **💰 Controle de Risco**
   - Começar com limites baixos (ex: R$ 1.000-2.000)
   - Scoring básico no MVP (regras simples)
   - Acompanhar inadimplência de perto
   - Reserva para perdas (provisão)

---

### 8.2 Tecnologias Recomendadas para MVP

**Backend:**

- Node.js (NestJS) + TypeScript
- PostgreSQL + Redis
- JWT para autenticação

**Frontend:**

- React + TypeScript + Tailwind CSS
- PWA para mobile

**Infraestrutura:**

- AWS (ECS + RDS + S3)
- GitHub Actions (CI/CD)
- Datadog (monitoramento)

**Integrações:**

- Asaas (PIX)
- Clicksign (assinatura digital)
- SendGrid (emails)
- Twilio (SMS/MFA)

---

### 8.3 Red Flags (Riscos a Evitar)

⚠️ **Não subestime compliance:** LGPD + dados de saúde + financeiro = regulação tripla  
⚠️ **Não lance sem segurança:** Um vazamento pode destruir a reputação  
⚠️ **Não ignore o risco de crédito:** Inadimplência pode quebrar a operação  
⚠️ **Não dependa de uma única empresa parceira:** Diversifique parcerias  
⚠️ **Não use dados de saúde além do necessário:** Princípio da minimização (LGPD)

---

## 📚 9. Referências e Links Úteis

### Regulamentações

- [LGPD - Lei 13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [Banco Central - Fintechs](https://www.bcb.gov.br/estabilidadefinanceira/fintechs)
- [Banco Central - PIX](https://www.bcb.gov.br/estabilidadefinanceira/pix)
- [ANPD - Autoridade Nacional de Proteção de Dados](https://www.gov.br/anpd)
- [Conselho Federal de Medicina](https://portal.cfm.org.br/)

### Tecnologias

- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
- [PostgreSQL](https://www.postgresql.org/)
- [AWS](https://aws.amazon.com/)

### Integrações

- [Asaas - Gateway de Pagamento](https://www.asaas.com/)
- [Clicksign - Assinatura Digital](https://www.clicksign.com/)
- [SendGrid - Email](https://sendgrid.com/)
- [Twilio - SMS](https://www.twilio.com/)

### Segurança

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [PCI-DSS](https://www.pcisecuritystandards.org/)

---

## ✅ Conclusão

O projeto CREDMED é **viável tecnicamente e regulatoriamente**, mas requer **atenção especial a compliance** (LGPD + dados de saúde + regulação financeira).

**Principais Desafios:**

1. Parcerias com empresas de escalas médicas
2. Gestão de risco de crédito
3. Compliance com LGPD e ANPD
4. Segurança da informação

**Oportunidades:**

1. Nicho inexplorado por grandes players
2. Mercado de médicos plantonistas é grande
3. Possibilidade de expansão para outros profissionais de saúde

**Próximos Passos Recomendados:**

1. ✅ Criar especificação técnica detalhada (próximo documento)
2. ✅ Validar parceria com pelo menos 1 empresa de escalas
3. ✅ Consultar advogado especializado em fintech/saúde
4. ✅ Contratar DPO (Data Protection Officer)
5. ✅ Iniciar MVP com stack recomendada

---

**Documento preparado por:** Analyst Agent  
**Data:** 02 de Janeiro de 2026  
**Versão:** 1.0  
**Status:** ✅ Completo - Pronto para próxima fase (Especificação Técnica)
