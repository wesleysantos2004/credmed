# Guia de Diagnóstico - localStorage

## ✅ Correções Aplicadas

1. **Adicionado método `getSolicitacoesMedico()`** no storage.js
2. **Adicionados logs de debug** em nova-solicitacao.html e lista-solicitacoes.html
3. **Corrigido mapeamento de dados** incluindo quantidade de plantões

## 🔍 Como Testar

### Passo 1: Limpar localStorage (Começar do Zero)

Abra o Console (F12) em qualquer página e execute:

```javascript
localStorage.clear();
console.log("localStorage limpo!");
```

### Passo 2: Criar Nova Solicitação

1. Abra `medico/nova-solicitacao.html`
2. Abra o Console (F12) antes de criar
3. Preencha o formulário:
   - Selecione uma empresa
   - Adicione 1-2 plantões com valores
   - Selecione uma taxa
   - Marque "Concordo com os termos"
4. Clique em "Enviar Solicitação"

**O que observar no Console:**

```
Criando solicitação com dados: {medicoId: 'medico1', ...}
Solicitação criada: {id: 'SOL-2025-00048', ...}
Todas solicitações após criar: [Array com 4 itens - 3 mock + 1 nova]
Solicitações do médico: [Array com 1 item - sua nova solicitação]
```

### Passo 3: Verificar na Lista

1. Clique no botão "Ver Minhas Solicitações"
2. A página lista-solicitacoes.html vai abrir
3. No Console, você verá:

```
=== Iniciando loadSolicitacoes ===
Carregando solicitações do médico medico1...
Solicitações encontradas: [Array com sua solicitação]
Resultado de loadFromStorage: [Array mapeado]
Usando dados do storage
```

### Passo 4: Inspecionar localStorage Diretamente

No Console, execute:

```javascript
// Ver todas as solicitações armazenadas
const todas = JSON.parse(localStorage.getItem("solicitacoes"));
console.log("Total de solicitações:", todas.length);
console.log("Solicitações:", todas);

// Ver apenas do médico
const doMedico = todas.filter((s) => s.medicoId === "medico1");
console.log("Solicitações do Dr. Fernando:", doMedico);
```

## 🐛 Possíveis Problemas e Soluções

### Problema: "AppStorage is not defined"

**Causa:** Script storage.js não carregou
**Solução:**

- Verifique se o arquivo existe em `assets/js/storage.js`
- Verifique se o caminho no `<script src="../assets/js/storage.js">` está correto

### Problema: Solicitação criada mas não aparece na lista

**Causa:** Dados do mock no storage.js não têm medicoId='medico1'
**Solução:** Execute no console:

```javascript
AppStorage.resetData();
location.reload();
```

### Problema: Lista sempre mostra mock data

**Causa:** getSolicitacoesMedico() retorna array vazio
**Diagnóstico:**

```javascript
// Verificar se existem solicitações
console.log("Total:", AppStorage.getSolicitacoes().length);

// Verificar médicos nas solicitações
AppStorage.getSolicitacoes().forEach((s) => {
  console.log(s.numero, "- Médico:", s.medicoId);
});
```

### Problema: localStorage funciona em uma página mas não em outra

**Causa:** Protocolo file:// pode isolar storage por diretório
**Solução:** Use um servidor HTTP local:

```powershell
# Usando Python (se instalado)
cd "c:\Users\WESLEYSA\OneDrive - Capgemini\Copilot\BMAD\prototype-frontend"
python -m http.server 8000

# Ou usando VS Code Live Server
# Clique com botão direito em qualquer .html > "Open with Live Server"
```

Então acesse: `http://localhost:8000/medico/nova-solicitacao.html`

## 📊 Comandos Úteis do Console

```javascript
// Ver estrutura de uma solicitação
AppStorage.getSolicitacao("SOL-2025-00048");

// Listar todas
AppStorage.getSolicitacoes();

// Filtrar por status
AppStorage.getSolicitacoes().filter(
  (s) => s.status === "AGUARDANDO_TRIAGEM_ADMIN"
);

// Contar por status
const porStatus = {};
AppStorage.getSolicitacoes().forEach((s) => {
  porStatus[s.status] = (porStatus[s.status] || 0) + 1;
});
console.table(porStatus);

// Limpar tudo e recomeçar
AppStorage.resetData();

// Ver próximo ID
localStorage.getItem("nextId");
```

## ✨ Teste Completo do Fluxo

1. **Limpar:** `localStorage.clear()`
2. **Recarregar:** F5
3. **Criar solicitação:** Preencher formulário e enviar
4. **Verificar console:** Deve mostrar logs de criação
5. **Ir para lista:** Clicar no botão
6. **Verificar console:** Deve mostrar logs de carregamento
7. **Ver na tela:** Solicitação deve aparecer com status "Aguardando Triagem"

Se tudo funcionar, você verá:

- ✅ Sua nova solicitação na lista
- ✅ Status correto (Aguardando Triagem)
- ✅ Valores corretos
- ✅ Empresa correta
- ✅ Logs no console confirmando tudo
