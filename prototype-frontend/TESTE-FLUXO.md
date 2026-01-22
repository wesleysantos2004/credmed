# Sistema de Adiantamento de Plantões - Guia de Testes

## 🔄 Fluxo Completo do Sistema

### Visão Geral

O sistema permite que médicos solicitem adiantamento de salário baseado em plantões realizados. A solicitação passa por um processo de triagem e validação antes da aprovação final.

## 📋 Fluxos Possíveis

### **Fluxo 1: Aprovação Direta pela Charlene**

```
1. Médico cria solicitação
2. Charlene (Admin) faz triagem
3. Charlene aprova diretamente
4. Pagamento processado
```

### **Fluxo 2: Validação pela Empresa**

```
1. Médico cria solicitação
2. Charlene encaminha para MedPlus
3. MedPlus valida os plantões
4. Charlene aprova após validação
5. Pagamento processado
```

### **Fluxo 3: Solicitação de Mais Informações**

```
1. Médico cria solicitação
2. Charlene solicita mais informações
3. Médico complementa informações
4. Fluxo reinicia na triagem
```

### **Fluxo 4: Rejeição**

```
1. Médico cria solicitação
2. Charlene OU MedPlus rejeita
3. Processo encerrado
```

### **Fluxo 5: Ciclo de Revisão**

```
1. Médico cria solicitação
2. Charlene encaminha para MedPlus
3. MedPlus valida
4. Charlene devolve para MedPlus revisar
5. MedPlus revalida
6. Charlene aprova
7. Pagamento processado
```

## 🧪 Como Testar

### **Passo 1: Reset dos Dados**

Abra o console do navegador (F12) e execute:

```javascript
localStorage.clear();
location.reload();
```

### **Passo 2: Acesso aos Portais**

#### **Portal do Médico** (`medico/login.html`)

- Simula login do médico
- Cria novas solicitações
- Visualiza status das solicitações

#### **Portal Admin - Triagem** (`admin/triagem.html?id=SOL-2025-00042`)

- Charlene faz triagem inicial
- 4 opções disponíveis:
  - ✅ **Aprovar Diretamente**: Aprova sem passar pela empresa
  - 📤 **Encaminhar para MedPlus**: Envia para validação da empresa
  - ❓ **Solicitar Mais Informações**: Pede dados adicionais ao médico
  - ❌ **Rejeitar**: Rejeita definitivamente

#### **Portal Empresa - Validação** (`empresa/validar.html?id=SOL-2025-00042`)

- MedPlus valida cada plantão individualmente
- Pode validar parcialmente ou totalmente
- Pode rejeitar a validação

#### **Portal Admin - Aprovações** (`admin/aprovacoes.html`)

- Charlene vê solicitações validadas pela empresa
- Pode:
  - ✅ Aprovar definitivamente
  - 🔄 Devolver para empresa revisar
  - ❓ Solicitar mais informações ao médico
  - ❌ Rejeitar

### **Passo 3: Estados das Solicitações**

| Status                          | Significado              | Próxima Ação               |
| ------------------------------- | ------------------------ | -------------------------- |
| `AGUARDANDO_TRIAGEM_ADMIN`      | Nova solicitação         | Charlene faz triagem       |
| `AGUARDANDO_VALIDACAO_EMPRESA`  | Encaminhada para empresa | MedPlus valida             |
| `VALIDADO_EMPRESA`              | Empresa validou          | Charlene aprova ou devolve |
| `REJEITADO_EMPRESA`             | Empresa rejeitou         | Fim do processo            |
| `APROVADO_ADMIN`                | Aprovado pela Charlene   | Processar pagamento        |
| `REJEITADO_ADMIN`               | Rejeitado pela Charlene  | Fim do processo            |
| `AGUARDANDO_INFORMACOES_MEDICO` | Pendente informações     | Médico complementa         |
| `PAGO`                          | Pagamento processado     | Concluído                  |

## 🔧 Testando Fluxos Específicos

### **Teste 1: Aprovação Direta**

1. Abra `admin/triagem.html?id=SOL-2025-00042`
2. Clique em "Aprovar Diretamente"
3. Veja a solicitação em `admin/pagamentos.html` com status "Aprovado"

### **Teste 2: Fluxo com Validação da Empresa**

1. Abra `admin/triagem.html?id=SOL-2025-00042`
2. Clique em "Encaminhar para MedPlus"
3. Abra `empresa/validacoes.html` (verá a solicitação pendente)
4. Clique em "Validar" na solicitação
5. Em `empresa/validar.html?id=SOL-2025-00042`, marque os plantões e clique "Validar e Enviar"
6. Volte para `admin/aprovacoes.html` (verá a solicitação validada)
7. Clique em "Aprovar" na solicitação
8. Aprove definitivamente

### **Teste 3: Ciclo de Revisão**

1. Siga passos 1-6 do Teste 2
2. Em vez de aprovar, clique em "Devolver para Empresa"
3. Justifique a devolução
4. Abra `empresa/validacoes.html` novamente
5. Revalide a solicitação
6. Volte para `admin/aprovacoes.html` e aprove

### **Teste 4: Solicitação de Informações**

1. Abra `admin/triagem.html?id=SOL-2025-00042`
2. Clique em "Solicitar Mais Informações"
3. Digite a mensagem e confirme
4. Status muda para "Aguardando Informações do Médico"

## 💾 Estrutura de Dados (localStorage)

### **Chave: `solicitacoes`**

Array de objetos contendo:

```javascript
{
  id: "SOL-2025-00042",
  medicoNome: "Dr. Fernando Silva",
  empresaNome: "MedPlus",
  valorTotal: 5200.00,
  status: "AGUARDANDO_TRIAGEM_ADMIN",
  plantoes: [...],
  historico: [...],
  observacoes: [...]
}
```

### **Inspecionar Dados**

No console do navegador:

```javascript
// Ver todas as solicitações
AppStorage.getSolicitacoes();

// Ver solicitação específica
AppStorage.getSolicitacao("SOL-2025-00042");

// Ver solicitações por status
AppStorage.getSolicitacoesPorStatus("AGUARDANDO_TRIAGEM_ADMIN");

// Ver histórico de uma solicitação
AppStorage.getSolicitacao("SOL-2025-00042").historico;

// Reset dos dados
AppStorage.resetData();
```

## 🎯 Cenários de Teste Recomendados

### **Cenário 1: Happy Path**

- Médico cria → Charlene encaminha → Empresa valida → Charlene aprova → Pago

### **Cenário 2: Aprovação Rápida**

- Médico cria → Charlene aprova direto → Pago

### **Cenário 3: Rejeição na Empresa**

- Médico cria → Charlene encaminha → Empresa rejeita → Fim

### **Cenário 4: Rejeição na Triagem**

- Médico cria → Charlene rejeita direto → Fim

### **Cenário 5: Ciclo de Revisão Múltiplo**

- Médico cria → Charlene encaminha → Empresa valida → Charlene devolve → Empresa revalida → Charlene aprova → Pago

### **Cenário 6: Solicitação de Informações**

- Médico cria → Charlene solicita info → [Aguarda médico] → Reinicia triagem

## 🔍 Debug e Desenvolvimento

### **Ver logs de ações**

Todas as ações são registradas no histórico:

```javascript
const sol = AppStorage.getSolicitacao("SOL-2025-00042");
console.table(sol.historico);
```

### **Forçar um estado específico**

```javascript
const solicitacoes = AppStorage.getSolicitacoes();
solicitacoes[0].status = "VALIDADO_EMPRESA";
AppStorage.saveSolicitacoes(solicitacoes);
location.reload();
```

### **Criar solicitação de teste**

```javascript
AppStorage.criarSolicitacao({
  medicoId: "medico1",
  medicoNome: "Dr. Teste",
  medicoCRM: "CRM-SP 999999",
  medicoCPF: "999.999.999-99",
  medicoEmail: "teste@teste.com",
  medicoTelefone: "(11) 99999-9999",
  empresaId: "empresa1",
  empresaNome: "MedPlus",
  empresaCNPJ: "12.345.678/0001-00",
  valorTotal: 3000.0,
  taxa: 105.0,
  taxaPercentual: 3.5,
  valorLiquido: 2895.0,
  cashback: 30.0,
  plantoes: [
    {
      id: 1,
      data: "2025-12-30",
      horarioInicio: "19:00",
      horarioFim: "07:00",
      duracao: 12,
      local: "Hospital Teste",
      valor: 3000.0,
      validado: false,
    },
  ],
  dadosBancarios: {
    banco: "Banco do Brasil",
    codigoBanco: "001",
    agencia: "1234-5",
    conta: "12345678-9",
    tipoConta: "Corrente",
    chavePix: "teste@teste.com",
    tipoChavePix: "EMAIL",
  },
  documentos: [],
});
```

## 📝 Notas Importantes

1. **Dados são salvos localmente**: Tudo fica no localStorage do navegador
2. **Limpar dados**: Use `localStorage.clear()` para resetar tudo
3. **Uma aba por vez**: Abrir múltiplas abas pode causar inconsistência
4. **Refresh manual**: Após cada ação, navegue para a próxima página
5. **Console do navegador**: Use F12 para ver logs e debugar

## 🚀 Próximos Passos

Após testar o fluxo completo:

1. Identificar melhorias na UX
2. Ajustar validações de formulário
3. Adicionar notificações visuais
4. Implementar busca e filtros dinâmicos
5. Preparar para integração com backend real
