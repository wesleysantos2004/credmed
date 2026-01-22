// Sistema de gerenciamento de estado integrado com API backend
// Mantém compatibilidade com a interface AppStorage original

const AppStorage = {
  // Cache local (opcional, pode ser usado para offline)
  _cache: {
    requests: [],
    doctors: [],
    companies: [],
    lastUpdate: null,
  },

  // Inicializar dados
  async init() {
    try {
      // Carregar dados da API
      await this.refreshCache();
    } catch (error) {
      console.error("Erro ao inicializar dados:", error);
      // Fallback para localStorage se API falhar
      this.initFallback();
    }
  },

  // Atualizar cache com dados da API
  async refreshCache() {
    try {
      const [requests, doctors, companies] = await Promise.all([
        window.API.getRequests(),
        window.API.getDoctors(),
        window.API.getCompanies(),
      ]);

      this._cache.requests = requests;
      this._cache.doctors = doctors;
      this._cache.companies = companies;
      this._cache.lastUpdate = new Date().toISOString();

      return true;
    } catch (error) {
      console.error("Erro ao atualizar cache:", error);
      throw error;
    }
  },

  // Fallback para localStorage (mantém dados mock se API falhar)
  initFallback() {
    const stored = localStorage.getItem("solicitacoes");
    if (stored) {
      this._cache.requests = JSON.parse(stored);
    }
  },

  // Obter todas as solicitações
  async getSolicitacoes() {
    try {
      const requests = await window.API.getRequests();
      this._cache.requests = requests;
      return requests;
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
      return this._cache.requests;
    }
  },

  // Obter solicitação por ID
  async getSolicitacao(id) {
    try {
      const request = await window.API.getRequestById(id);
      return request;
    } catch (error) {
      console.error("Erro ao buscar solicitação:", error);
      // Fallback para cache
      return this._cache.requests.find((r) => r.id === id || r.numero === id);
    }
  },

  // Obter solicitações de um médico específico
  async getSolicitacoesMedico(medicoId) {
    try {
      const requests = await window.API.getRequests({ doctorId: medicoId });
      return requests;
    } catch (error) {
      console.error("Erro ao buscar solicitações do médico:", error);
      return this._cache.requests.filter((r) => r.medicoId === medicoId);
    }
  },

  // Criar nova solicitação
  async criarSolicitacao(dados) {
    try {
      // Mapear dados do frontend para o formato da API
      const requestData = {
        doctorId: dados.medicoId,
        companyId: dados.empresaId,
        totalAmount: dados.valorTotal,
        netAmount: dados.valorLiquido,
        feeAmount: dados.taxa,
        feePercentage: dados.taxaPercentual,
        cashbackAmount: dados.cashback,
        shifts:
          dados.plantoes?.map((p) => ({
            date: p.data,
            startTime: p.horarioInicio,
            endTime: p.horarioFim,
            hours: p.duracao,
            location: p.local,
            amount: p.valor,
            validated: p.validado || false,
          })) || [],
        bankData: dados.dadosBancarios
          ? {
              bankName: dados.dadosBancarios.banco,
              bankCode: dados.dadosBancarios.codigoBanco,
              agency: dados.dadosBancarios.agencia,
              account: dados.dadosBancarios.conta,
              accountType: dados.dadosBancarios.tipoConta,
              pixKey: dados.dadosBancarios.chavePix,
              pixKeyType: dados.dadosBancarios.tipoChavePix,
            }
          : null,
      };

      const novaSolicitacao = await window.API.createRequest(requestData);

      // Atualizar cache
      this._cache.requests.push(novaSolicitacao);

      return novaSolicitacao;
    } catch (error) {
      console.error("Erro ao criar solicitação:", error);
      throw error;
    }
  },

  // Adicionar ação ao histórico
  async adicionarHistorico(
    solicitacaoId,
    acao,
    usuario,
    papel,
    descricao,
    observacao = null
  ) {
    // Por enquanto, apenas adiciona observação se houver
    if (observacao) {
      return this.adicionarObservacao(
        solicitacaoId,
        observacao,
        usuario,
        papel
      );
    }
    return true;
  },

  // Adicionar observação
  async adicionarObservacao(solicitacaoId, observacao, usuario, papel) {
    try {
      // API não suporta observações separadas ainda, então salvamos como nota no status
      const request = await this.getSolicitacao(solicitacaoId);
      if (request) {
        await window.API.updateRequestStatus(
          solicitacaoId,
          request.status,
          observacao
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao adicionar observação:", error);
      return false;
    }
  },

  // ADMIN: Aprovar diretamente (sem passar pela empresa)
  async adminAprovarDireto(solicitacaoId, observacao = "") {
    try {
      await window.API.updateRequestStatus(
        solicitacaoId,
        "APROVADO",
        observacao
      );
      await this.refreshCache();
      return true;
    } catch (error) {
      console.error("Erro ao aprovar solicitação:", error);
      return false;
    }
  },

  // ADMIN: Encaminhar para empresa validar
  async adminEncaminharParaEmpresa(solicitacaoId, observacao = "") {
    try {
      await window.API.updateRequestStatus(
        solicitacaoId,
        "PENDING",
        observacao
      );
      await this.refreshCache();
      return true;
    } catch (error) {
      console.error("Erro ao encaminhar para empresa:", error);
      return false;
    }
  },

  // EMPRESA: Validar plantões
  async empresaValidarPlantoes(
    solicitacaoId,
    plantoesValidados,
    observacao = ""
  ) {
    try {
      // Por enquanto, apenas aprova
      await window.API.updateRequestStatus(
        solicitacaoId,
        "APPROVED",
        observacao
      );
      await this.refreshCache();
      return true;
    } catch (error) {
      console.error("Erro ao validar plantões:", error);
      return false;
    }
  },

  // EMPRESA: Rejeitar validação
  async empresaRejeitar(solicitacaoId, motivo, detalhes) {
    try {
      await window.API.updateRequestStatus(
        solicitacaoId,
        "REJECTED",
        `${motivo}: ${detalhes}`
      );
      await this.refreshCache();
      return true;
    } catch (error) {
      console.error("Erro ao rejeitar:", error);
      return false;
    }
  },

  // ADMIN: Aprovar após validação da empresa
  async adminAprovarAposEmpresa(solicitacaoId, observacao = "") {
    return this.adminAprovarDireto(solicitacaoId, observacao);
  },

  // ADMIN: Devolver para empresa (solicitar revisão)
  async adminDevolverParaEmpresa(solicitacaoId, motivo) {
    return this.adminEncaminharParaEmpresa(solicitacaoId, motivo);
  },

  // ADMIN: Solicitar mais informações do médico
  async adminSolicitarInformacoes(solicitacaoId, mensagem) {
    try {
      await window.API.updateRequestStatus(solicitacaoId, "PENDING", mensagem);
      await this.refreshCache();
      return true;
    } catch (error) {
      console.error("Erro ao solicitar informações:", error);
      return false;
    }
  },

  // ADMIN: Rejeitar definitivamente
  async adminRejeitar(solicitacaoId, motivo, detalhes) {
    return this.empresaRejeitar(solicitacaoId, motivo, detalhes);
  },

  // ADMIN: Processar pagamento
  async adminProcessarPagamento(solicitacaoId) {
    try {
      await window.API.updateRequestStatus(
        solicitacaoId,
        "PAID",
        "Pagamento processado"
      );
      await this.refreshCache();
      return true;
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      return false;
    }
  },

  // Obter solicitações por status
  async getSolicitacoesPorStatus(status) {
    try {
      const requests = await window.API.getRequests({ status: status });
      return requests;
    } catch (error) {
      console.error("Erro ao buscar por status:", error);
      return this._cache.requests.filter((r) => r.status === status);
    }
  },

  // Obter solicitações da empresa
  async getSolicitacoesEmpresa(empresaId) {
    try {
      const requests = await window.API.getRequests({ companyId: empresaId });
      return requests;
    } catch (error) {
      console.error("Erro ao buscar solicitações da empresa:", error);
      return this._cache.requests.filter((r) => r.empresaId === empresaId);
    }
  },

  // Mapear status para exibição (mantém compatibilidade)
  getStatusLabel(status) {
    const labels = {
      RASCUNHO: "Rascunho",
      AGUARDANDO_TRIAGEM_ADMIN: "Aguardando Triagem",
      AGUARDANDO_VALIDACAO_EMPRESA: "Aguardando Validação da Empresa",
      VALIDADO_EMPRESA: "Validado pela Empresa",
      REJEITADO_EMPRESA: "Rejeitado pela Empresa",
      APROVADO_ADMIN: "Aprovado - Aguardando Pagamento",
      APROVADO: "Aprovado - Aguardando Pagamento",
      APROVADO_AGUARDANDO_PAGAMENTO: "Aprovado - Aguardando Pagamento",
      REJEITADO_ADMIN: "Rejeitado pela Administração",
      REJEITADO: "Rejeitado",
      AGUARDANDO_INFORMACOES_MEDICO: "Aguardando Informações do Médico",
      PAGO: "Pago",
      PAID: "Pago",
      PENDING: "Pendente",
      EM_ANALISE_ADMIN: "Em Análise",
      AGUARDANDO_INFO_MEDICO: "Aguardando Informações",
      CANCELADO: "Cancelado",
    };
    return labels[status] || status;
  },

  // Mapear status para cor (mantém compatibilidade)
  getStatusClass(status) {
    const classes = {
      RASCUNHO: "secondary",
      AGUARDANDO_TRIAGEM_ADMIN: "warning",
      AGUARDANDO_VALIDACAO_EMPRESA: "info",
      VALIDADO_EMPRESA: "primary",
      REJEITADO_EMPRESA: "danger",
      APROVADO_ADMIN: "success",
      APROVADO: "success",
      APROVADO_AGUARDANDO_PAGAMENTO: "success",
      REJEITADO_ADMIN: "danger",
      REJEITADO: "danger",
      AGUARDANDO_INFORMACOES_MEDICO: "warning",
      PAGO: "success",
      PAID: "success",
      PENDING: "warning",
      EM_ANALISE_ADMIN: "info",
      AGUARDANDO_INFO_MEDICO: "warning",
      CANCELADO: "dark",
    };
    return classes[status] || "secondary";
  },
      REJEITADO_ADMIN: "danger",
      REJEITADO: "danger",
      AGUARDANDO_INFORMACOES_MEDICO: "warning",
      PAGO: "success",
      PAID: "success",
      PENDING: "warning",
    };
    return classes[status] || "secondary";
  },

  // Reset para dados iniciais (não faz nada na versão API)
  resetData() {
    console.warn("resetData() não disponível na versão API");
  },

  // Salvar solicitações (não necessário na versão API)
  saveSolicitacoes(solicitacoes) {
    console.warn("saveSolicitacoes() não necessário na versão API");
  },
};

// Inicializar ao carregar
document.addEventListener("DOMContentLoaded", async () => {
  await AppStorage.init();
});
