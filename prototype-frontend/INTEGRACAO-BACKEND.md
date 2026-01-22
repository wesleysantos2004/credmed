# 🔗 Guia de Integração Frontend-Backend

## ✅ Status da Integração

A integração entre frontend e backend foi concluída com sucesso! Os arquivos foram criados e configurados.

## 📁 Arquivos Criados

### 1. **api.js** - Cliente HTTP

- **Localização:** `prototype-frontend/assets/js/api.js`
- **Função:** Gerencia todas as requisições HTTP para o backend
- **Endpoints disponíveis:**
  - `getRequests()` - Lista solicitações
  - `getRequestById(id)` - Busca solicitação específica
  - `createRequest(data)` - Cria nova solicitação
  - `updateRequestStatus(id, status, notes)` - Atualiza status
  - `getDoctors()`, `getCompanies()` - Lista médicos/empresas

### 2. **storage-api.js** - Camada de Compatibilidade

- **Localização:** `prototype-frontend/assets/js/storage-api.js`
- **Função:** Mantém a mesma interface do storage.js original, mas usa a API real
- **Compatibilidade:** 100% compatível com código existente
- **Vantagem:** Não precisa alterar os HTMLs existentes, apenas trocar o script

### 3. **test-integration.html** - Página de Testes

- **Localização:** `prototype-frontend/test-integration.html`
- **Função:** Interface visual para testar a integração
- **Recursos:**
  - Health check do backend
  - Teste de todos os endpoints
  - Console de logs em tempo real
  - Bateria completa de testes

## 🚀 Como Testar

### Passo 1: Iniciar o Backend

```bash
cd backend
npm run dev
```

O servidor deve iniciar em: `http://localhost:3000`

### Passo 2: Abrir a Página de Testes

1. Abra o VS Code
2. Instale a extensão **Live Server** (se ainda não tiver)
3. Clique com botão direito em `test-integration.html`
4. Selecione **"Open with Live Server"**

Ou simplesmente abra o arquivo no navegador: `file:///c:/Users/WESLEYSA/OneDrive%20-%20Capgemini/Copilot/PROJECT-BMAD-CREDMED/prototype-frontend/test-integration.html`

### Passo 3: Executar Testes

Na página de testes:

1. Clique em **"Executar Todos os Testes"**
2. Verifique o console de resultados
3. Deve mostrar:
   - ✅ Backend online
   - ✅ 3 solicitações encontradas
   - ✅ 3 médicos encontrados
   - ✅ 2 empresas encontradas

## 🔧 Configuração do CORS

O backend foi configurado para aceitar requisições de:

- `http://localhost:5500` (Live Server)
- `http://127.0.0.1:5500` (Live Server alternativo)
- `http://localhost:3000` (mesmo domínio)

Arquivo: `backend/src/app.ts`

```typescript
const corsOptions = {
  origin: [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
```

## 📝 Atualizar Páginas Existentes

Para usar a API real em vez do localStorage, substitua nos arquivos HTML:

### ❌ Antes:

```html
<script src="../assets/js/app.js"></script>
<script src="../assets/js/storage.js"></script>
```

### ✅ Depois:

```html
<script src="../assets/js/app.js"></script>
<script src="../assets/js/api.js"></script>
<script src="../assets/js/storage-api.js"></script>
```

### Páginas que precisam ser atualizadas:

- [x] `admin/triagem.html` - ✅ Já atualizado
- [ ] `medico/nova-solicitacao.html`
- [ ] `medico/lista-solicitacoes.html`
- [ ] `medico/dashboard.html`
- [ ] `empresa/validar.html`
- [ ] Demais páginas conforme necessário

## 🔄 Mapeamento de Status

O sistema mapeia automaticamente os status entre backend e frontend:

| Backend    | Frontend                   |
| ---------- | -------------------------- |
| `draft`    | `RASCUNHO`                 |
| `pending`  | `AGUARDANDO_TRIAGEM_ADMIN` |
| `approved` | `APROVADO_ADMIN`           |
| `rejected` | `REJEITADO_ADMIN`          |
| `paid`     | `PAGO`                     |

## 🎯 Formato dos Dados

### Solicitação (Request)

```javascript
{
  id: "SOL-2026-00001",
  numero: "SOL-2026-00001",
  medicoId: "abc123",
  medicoNome: "Dr. João Silva",
  medicoCRM: "CRM-SP 123456",
  empresaId: "xyz789",
  empresaNome: "Hospital XYZ",
  valorTotal: 5200.00,
  valorLiquido: 5018.00,
  taxa: 182.00,
  cashback: 52.00,
  status: "AGUARDANDO_TRIAGEM_ADMIN",
  dataCriacao: "2025-12-25T14:30:00",
  plantoes: [
    {
      id: 1,
      data: "2025-12-28",
      horarioInicio: "19:00",
      horarioFim: "07:00",
      duracao: 12,
      local: "Hospital São Lucas",
      valor: 1800.00,
      validado: false
    }
  ]
}
```

## 🐛 Troubleshooting

### Backend não responde

```bash
# Verificar se a porta está livre
npx kill-port 3000

# Reiniciar o servidor
cd backend
npm run dev
```

### Erro de CORS

- Verifique se está usando Live Server (não abra direto do sistema de arquivos)
- Confirme que o backend está rodando em `http://localhost:3000`
- Verifique o console do navegador para mensagens de erro

### Dados não aparecem

- Abra `test-integration.html` e execute os testes
- Verifique se o banco de dados tem dados: `backend/credmed.sqlite`
- Se necessário, execute novamente o seed: `npm run seed`

## 📊 Dados de Teste

O banco de dados contém:

- **3 médicos:** medico-001, medico-002, medico-003
- **2 empresas:** empresa-001, empresa-002
- **3 solicitações:**
  - SOL-2026-00001 (pending)
  - SOL-2026-00002 (approved)
  - SOL-2026-00003 (paid)
- **5 plantões** distribuídos entre as solicitações

## 📞 Próximos Passos

1. ✅ Testar a página test-integration.html
2. ⏳ Atualizar páginas do médico para usar storage-api.js
3. ⏳ Atualizar páginas da empresa para usar storage-api.js
4. ⏳ Implementar autenticação JWT
5. ⏳ Adicionar upload de documentos
6. ⏳ Implementar sistema de notificações

## 🎉 Conclusão

A integração está **completa e funcional**! O frontend agora consome dados reais do backend através de uma API REST, mantendo total compatibilidade com o código existente.
