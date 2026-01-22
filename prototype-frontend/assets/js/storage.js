// Sistema de gerenciamento de estado com localStorage
// Para testar o fluxo completo do sistema de adiantamento

const AppStorage = {
  // Inicializar dados de exemplo se não existirem
  init() {
    if (!localStorage.getItem("solicitacoes")) {
      this.resetData();
    }
  },

  // Reset para dados iniciais de exemplo
  resetData() {
    const solicitacoes = [
      {
        id: "SOL-2025-00042",
        numero: "SOL-2025-00042",
        medicoId: "medico1",
        medicoNome: "Dr. Fernando Silva",
        medicoCRM: "CRM-SP 123456",
        medicoCPF: "123.456.789-00",
        medicoEmail: "fernando.silva@email.com",
        medicoTelefone: "(11) 98765-4321",
        empresaId: "empresa1",
        empresaNome: "MedPlus",
        empresaCNPJ: "12.345.678/0001-00",
        valorTotal: 5200.0,
        taxa: 182.0,
        taxaPercentual: 3.5,
        valorLiquido: 5018.0,
        cashback: 52.0,
        status: "AGUARDANDO_TRIAGEM_ADMIN",
        dataCriacao: "2025-12-25T14:30:00",
        plantoes: [
          {
            id: 1,
            data: "2025-12-28",
            horarioInicio: "19:00",
            horarioFim: "07:00",
            duracao: 12,
            local: "Hospital São Lucas - Unidade Centro",
            valor: 1800.0,
            validado: false,
          },
          {
            id: 2,
            data: "2025-12-30",
            horarioInicio: "19:00",
            horarioFim: "07:00",
            duracao: 12,
            local: "Hospital São Lucas - Unidade Zona Sul",
            valor: 1700.0,
            validado: false,
          },
          {
            id: 3,
            data: "2026-01-01",
            horarioInicio: "07:00",
            horarioFim: "19:00",
            duracao: 12,
            local: "Hospital São Lucas - Unidade Centro",
            valor: 1700.0,
            validado: false,
          },
        ],
        historico: [
          {
            data: "2025-12-25T14:30:00",
            acao: "CRIACAO",
            usuario: "Dr. Fernando Silva",
            papel: "MEDICO",
            descricao: "Solicitação criada",
          },
        ],
        dadosBancarios: {
          banco: "Banco do Brasil",
          codigoBanco: "001",
          agencia: "1234-5",
          conta: "12345678-9",
          tipoConta: "Corrente",
          chavePix: "fernando.silva@email.com",
          tipoChavePix: "EMAIL",
        },
        documentos: [
          {
            nome: "Contrato Assinado.pdf",
            tamanho: "245 KB",
            tipo: "application/pdf",
            dataUpload: "2025-12-25T14:30:00",
          },
          {
            nome: "Comprovantes Plantões.pdf",
            tamanho: "1.2 MB",
            tipo: "application/pdf",
            dataUpload: "2025-12-25T14:30:00",
          },
        ],
        observacoes: [],
      },
    ];

    localStorage.setItem("solicitacoes", JSON.stringify(solicitacoes));
    localStorage.setItem("nextId", "48");
  },

  // Obter todas as solicitações
  getSolicitacoes() {
    const data = localStorage.getItem("solicitacoes");
    return data ? JSON.parse(data) : [];
  },

  // Obter solicitação por ID
  getSolicitacao(id) {
    const solicitacoes = this.getSolicitacoes();
    return solicitacoes.find((s) => s.id === id || s.numero === id);
  },

  // Obter solicitações de um médico específico
  getSolicitacoesMedico(medicoId) {
    const solicitacoes = this.getSolicitacoes();
    return solicitacoes.filter((s) => s.medicoId === medicoId);
  },

  // Salvar solicitações
  saveSolicitacoes(solicitacoes) {
    localStorage.setItem("solicitacoes", JSON.stringify(solicitacoes));
  },

  // Criar nova solicitação
  criarSolicitacao(dados) {
    const solicitacoes = this.getSolicitacoes();
    const nextId = parseInt(localStorage.getItem("nextId") || "48");

    const novaSolicitacao = {
      id: `SOL-2025-${String(nextId).padStart(5, "0")}`,
      numero: `SOL-2025-${String(nextId).padStart(5, "0")}`,
      ...dados,
      status: "AGUARDANDO_TRIAGEM_ADMIN",
      dataCriacao: new Date().toISOString(),
      historico: [
        {
          data: new Date().toISOString(),
          acao: "CRIACAO",
          usuario: dados.medicoNome,
          papel: "MEDICO",
          descricao: "Solicitação criada",
        },
      ],
      observacoes: [],
    };

    solicitacoes.push(novaSolicitacao);
    this.saveSolicitacoes(solicitacoes);
    localStorage.setItem("nextId", String(nextId + 1));

    return novaSolicitacao;
  },

  // Adicionar ação ao histórico
  adicionarHistorico(
    solicitacaoId,
    acao,
    usuario,
    papel,
    descricao,
    observacao = null,
  ) {
    const solicitacoes = this.getSolicitacoes();
    const solicitacao = solicitacoes.find((s) => s.id === solicitacaoId);

    if (solicitacao) {
      solicitacao.historico.push({
        data: new Date().toISOString(),
        acao,
        usuario,
        papel,
        descricao,
        observacao,
      });
      this.saveSolicitacoes(solicitacoes);
    }
  },

  // Adicionar observação
  adicionarObservacao(solicitacaoId, observacao, usuario, papel) {
    const solicitacoes = this.getSolicitacoes();
    const solicitacao = solicitacoes.find((s) => s.id === solicitacaoId);

    if (solicitacao) {
      if (!solicitacao.observacoes) {
        solicitacao.observacoes = [];
      }
      solicitacao.observacoes.push({
        data: new Date().toISOString(),
        texto: observacao,
        usuario,
        papel,
      });
      this.saveSolicitacoes(solicitacoes);
    }
  },

  // ADMIN: Aprovar diretamente (sem passar pela empresa)
  adminAprovarDireto(solicitacaoId, observacao = "") {
    const solicitacoes = this.getSolicitacoes();
    const solicitacao = solicitacoes.find((s) => s.id === solicitacaoId);

    if (solicitacao) {
      solicitacao.status = "APROVADO_ADMIN";
      solicitacao.dataAprovacaoAdmin = new Date().toISOString();

      this.adicionarHistorico(
        solicitacaoId,
        "APROVACAO_DIRETA_ADMIN",
        "Charlene",
        "ADMIN",
        "Aprovado diretamente pela administração",
        observacao,
      );

      if (observacao) {
        this.adicionarObservacao(
          solicitacaoId,
          observacao,
          "Charlene",
          "ADMIN",
        );
      }

      this.saveSolicitacoes(solicitacoes);
      return true;
    }
    return false;
  },

  // ADMIN: Encaminhar para empresa validar
  adminEncaminharParaEmpresa(solicitacaoId, observacao = "") {
    const solicitacoes = this.getSolicitacoes();
    const solicitacao = solicitacoes.find((s) => s.id === solicitacaoId);

    if (solicitacao) {
      solicitacao.status = "AGUARDANDO_VALIDACAO_EMPRESA";

      this.adicionarHistorico(
        solicitacaoId,
        "ENCAMINHADO_PARA_EMPRESA",
        "Charlene",
        "ADMIN",
        `Encaminhado para validação da ${solicitacao.empresaNome}`,
        observacao,
      );

      if (observacao) {
        this.adicionarObservacao(
          solicitacaoId,
          observacao,
          "Charlene",
          "ADMIN",
        );
      }

      this.saveSolicitacoes(solicitacoes);
      return true;
    }
    return false;
  },

  // EMPRESA: Validar plantões
  empresaValidarPlantoes(solicitacaoId, plantoesValidados, observacao = "") {
    const solicitacoes = this.getSolicitacoes();
    const solicitacao = solicitacoes.find((s) => s.id === solicitacaoId);

    if (solicitacao) {
      // Atualizar status dos plantões
      solicitacao.plantoes.forEach((plantao) => {
        plantao.validado = plantoesValidados.includes(plantao.id);
      });

      solicitacao.status = "VALIDADO_EMPRESA";
      solicitacao.dataValidacaoEmpresa = new Date().toISOString();

      this.adicionarHistorico(
        solicitacaoId,
        "VALIDACAO_EMPRESA",
        solicitacao.empresaNome,
        "EMPRESA",
        `Plantões validados pela empresa (${plantoesValidados.length} de ${solicitacao.plantoes.length})`,
        observacao,
      );

      if (observacao) {
        this.adicionarObservacao(
          solicitacaoId,
          observacao,
          solicitacao.empresaNome,
          "EMPRESA",
        );
      }

      this.saveSolicitacoes(solicitacoes);
      return true;
    }
    return false;
  },

  // EMPRESA: Rejeitar validação
  empresaRejeitar(solicitacaoId, motivo, detalhes) {
    const solicitacoes = this.getSolicitacoes();
    const solicitacao = solicitacoes.find((s) => s.id === solicitacaoId);

    if (solicitacao) {
      solicitacao.status = "REJEITADO_EMPRESA";
      solicitacao.motivoRejeicaoEmpresa = motivo;
      solicitacao.dataRejeicaoEmpresa = new Date().toISOString();

      this.adicionarHistorico(
        solicitacaoId,
        "REJEICAO_EMPRESA",
        solicitacao.empresaNome,
        "EMPRESA",
        `Rejeitado pela empresa: ${motivo}`,
        detalhes,
      );

      this.adicionarObservacao(
        solicitacaoId,
        detalhes,
        solicitacao.empresaNome,
        "EMPRESA",
      );

      this.saveSolicitacoes(solicitacoes);
      return true;
    }
    return false;
  },

  // ADMIN: Aprovar após validação da empresa
  adminAprovarAposEmpresa(solicitacaoId, observacao = "") {
    const solicitacoes = this.getSolicitacoes();
    const solicitacao = solicitacoes.find((s) => s.id === solicitacaoId);

    if (solicitacao && solicitacao.status === "VALIDADO_EMPRESA") {
      solicitacao.status = "APROVADO_ADMIN";
      solicitacao.dataAprovacaoAdmin = new Date().toISOString();

      this.adicionarHistorico(
        solicitacaoId,
        "APROVACAO_FINAL_ADMIN",
        "Charlene",
        "ADMIN",
        "Aprovado pela administração após validação da empresa",
        observacao,
      );

      if (observacao) {
        this.adicionarObservacao(
          solicitacaoId,
          observacao,
          "Charlene",
          "ADMIN",
        );
      }

      this.saveSolicitacoes(solicitacoes);
      return true;
    }
    return false;
  },

  // ADMIN: Devolver para empresa (solicitar revisão)
  adminDevolverParaEmpresa(solicitacaoId, motivo) {
    const solicitacoes = this.getSolicitacoes();
    const solicitacao = solicitacoes.find((s) => s.id === solicitacaoId);

    if (solicitacao) {
      solicitacao.status = "AGUARDANDO_VALIDACAO_EMPRESA";

      this.adicionarHistorico(
        solicitacaoId,
        "DEVOLVIDO_PARA_EMPRESA",
        "Charlene",
        "ADMIN",
        "Devolvido para empresa revisar",
        motivo,
      );

      this.adicionarObservacao(solicitacaoId, motivo, "Charlene", "ADMIN");

      this.saveSolicitacoes(solicitacoes);
      return true;
    }
    return false;
  },

  // ADMIN: Solicitar mais informações do médico
  adminSolicitarInformacoes(solicitacaoId, mensagem) {
    const solicitacoes = this.getSolicitacoes();
    const solicitacao = solicitacoes.find((s) => s.id === solicitacaoId);

    if (solicitacao) {
      solicitacao.status = "AGUARDANDO_INFORMACOES_MEDICO";

      this.adicionarHistorico(
        solicitacaoId,
        "INFORMACOES_SOLICITADAS",
        "Charlene",
        "ADMIN",
        "Mais informações solicitadas ao médico",
        mensagem,
      );

      this.adicionarObservacao(solicitacaoId, mensagem, "Charlene", "ADMIN");

      this.saveSolicitacoes(solicitacoes);
      return true;
    }
    return false;
  },

  // ADMIN: Rejeitar definitivamente
  adminRejeitar(solicitacaoId, motivo, detalhes) {
    const solicitacoes = this.getSolicitacoes();
    const solicitacao = solicitacoes.find((s) => s.id === solicitacaoId);

    if (solicitacao) {
      solicitacao.status = "REJEITADO_ADMIN";
      solicitacao.motivoRejeicaoAdmin = motivo;
      solicitacao.dataRejeicaoAdmin = new Date().toISOString();

      this.adicionarHistorico(
        solicitacaoId,
        "REJEICAO_FINAL_ADMIN",
        "Charlene",
        "ADMIN",
        `Rejeitado pela administração: ${motivo}`,
        detalhes,
      );

      this.adicionarObservacao(solicitacaoId, detalhes, "Charlene", "ADMIN");

      this.saveSolicitacoes(solicitacoes);
      return true;
    }
    return false;
  },

  // ADMIN: Processar pagamento
  adminProcessarPagamento(solicitacaoId) {
    const solicitacoes = this.getSolicitacoes();
    const solicitacao = solicitacoes.find((s) => s.id === solicitacaoId);

    if (solicitacao && solicitacao.status === "APROVADO_ADMIN") {
      solicitacao.status = "PAGO";
      solicitacao.dataPagamento = new Date().toISOString();

      this.adicionarHistorico(
        solicitacaoId,
        "PAGAMENTO_PROCESSADO",
        "Sistema",
        "SISTEMA",
        `Pagamento processado via PIX: R$ ${solicitacao.valorLiquido.toFixed(
          2,
        )}`,
      );

      this.saveSolicitacoes(solicitacoes);
      return true;
    }
    return false;
  },

  // Obter solicitações por status
  getSolicitacoesPorStatus(status) {
    const solicitacoes = this.getSolicitacoes();
    return solicitacoes.filter((s) => s.status === status);
  },

  // Obter solicitações do médico
  getSolicitacoesMedico(medicoId) {
    const solicitacoes = this.getSolicitacoes();
    return solicitacoes.filter((s) => s.medicoId === medicoId);
  },

  // Obter solicitações da empresa
  getSolicitacoesEmpresa(empresaId) {
    const solicitacoes = this.getSolicitacoes();
    return solicitacoes.filter((s) => s.empresaId === empresaId);
  },

  // Mapear status para exibição
  getStatusLabel(status) {
    const labels = {
      AGUARDANDO_TRIAGEM_ADMIN: "Aguardando Triagem",
      AGUARDANDO_VALIDACAO_EMPRESA: "Aguardando Validação da Empresa",
      VALIDADO_EMPRESA: "Validado pela Empresa",
      REJEITADO_EMPRESA: "Rejeitado pela Empresa",
      APROVADO_ADMIN: "Aprovado - Aguardando Pagamento",
      REJEITADO_ADMIN: "Rejeitado pela Administração",
      AGUARDANDO_INFORMACOES_MEDICO: "Aguardando Informações do Médico",
      PAGO: "Pago",
    };
    return labels[status] || status;
  },

  // Mapear status para cor
  getStatusClass(status) {
    const classes = {
      AGUARDANDO_TRIAGEM_ADMIN: "warning",
      AGUARDANDO_VALIDACAO_EMPRESA: "info",
      VALIDADO_EMPRESA: "primary",
      REJEITADO_EMPRESA: "danger",
      APROVADO_ADMIN: "success",
      REJEITADO_ADMIN: "danger",
      AGUARDANDO_INFORMACOES_MEDICO: "warning",
      PAGO: "success",
    };
    return classes[status] || "secondary";
  },
};

// Inicializar ao carregar
AppStorage.init();
