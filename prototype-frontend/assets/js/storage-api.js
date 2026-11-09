function formatProtocolFromId(id) {
  return `SOL-2026-${String(id).padStart(5, '0')}`;
}

function mapStatusFromBackend(status, contract) {
  const contractStatus = contract?.file_path || contract?.status || null;
  const contractSignedAt = contract?.signed_at || contract?.assinadoEm || null;

  if (contractStatus === 'released' && !contractSignedAt) {
    return 'AGUARDANDO_ASSINATURA_CONTRATO';
  }

  if (contractStatus === 'generated') {
    return 'CONTRATO_GERADO_AGUARDANDO_LIBERACAO';
  }

  const map = {
    draft: 'AGUARDANDO_TRIAGEM_ADMIN',
    pending: 'AGUARDANDO_TRIAGEM_ADMIN',
    in_review: 'AGUARDANDO_INFORMACOES_MEDICO',
    approved: 'APROVADO_ADMIN',
    paid: 'PAGO',
    rejected: 'REJEITADO_ADMIN',
    cancelled: 'REJEITADO_ADMIN',
  };

  return map[status] || 'AGUARDANDO_TRIAGEM_ADMIN';
}

function mapHistoryAction(newStatus) {
  const map = {
    pending: 'CRIACAO',
    in_review: 'INFORMACOES_SOLICITADAS',
    approved: 'APROVACAO_DIRETA_ADMIN',
    paid: 'PAGAMENTO_REALIZADO',
    rejected: 'REJEICAO_FINAL_ADMIN',
  };

  return map[newStatus] || 'ATUALIZACAO_STATUS';
}

function normalizeShift(shift) {
  const hours = Number(shift.hours || 0);
  const start = shift.start_time || '19:00';
  const end = shift.end_time || '07:00';

  return {
    id: shift.id,
    data: shift.shift_date,
    horarioInicio: start,
    horarioFim: end,
    duracao: hours || 12,
    local: shift.location || 'Plantão',
    valor: Number(shift.amount || 0),
    validado: shift.status === 'validated',
  };
}

function normalizeRequest(raw) {
  const total = Number(raw.total_amount || 0);
  const feeRate = Number(raw.fee_rate || 0);
  const fee = Number(((total * feeRate) / 100).toFixed(2));
  const net = Number(raw.net_amount || (total - fee));

  return {
    id: String(raw.id),
    numero: formatProtocolFromId(raw.id),
    medicoId: `medico${raw.doctor_id}`,
    medicoNome: raw.doctor_name || `Médico #${raw.doctor_id}`,
    medicoCRM: raw.doctor_crm || 'CRM não informado',
    medicoCPF: raw.doctor_cpf || '00000000000',
    medicoEmail: raw.doctor_email || 'nao.informado@credmed.local',
    medicoTelefone: raw.doctor_phone || '(00) 00000-0000',
    empresaId: String(raw.company_id),
    empresaNome: raw.company_name || `Empresa #${raw.company_id}`,
    empresaCNPJ: raw.company_cnpj || '00.000.000/0000-00',
    valorTotal: total,
    taxa: fee,
    taxaPercentual: feeRate,
    valorLiquido: net,
    cashback: Number((total * 0.01).toFixed(2)),
    status: mapStatusFromBackend(raw.status, raw.contract),
    dataCriacao: raw.created_at,
    plantoes: Array.isArray(raw.shifts) ? raw.shifts.map(normalizeShift) : [],
    historico: Array.isArray(raw.history)
      ? raw.history.map((item) => ({
          data: item.changed_at,
          acao: mapHistoryAction(item.new_status),
          usuario: item.changed_by ? `Usuário #${item.changed_by}` : 'Sistema',
          papel: item.changed_by ? 'ADMIN' : 'SISTEMA',
          descricao: `Status alterado para ${item.new_status}`,
          observacao: item.notes,
        }))
      : [],
    contrato: raw.contract
      ? {
          numero: raw.contract.contract_number,
          texto: raw.contract.contract_text,
          status: raw.contract.file_path || 'generated',
          assinadoEm: raw.contract.signed_at,
          arquivoGerado: raw.contract.generated_pdf_path || null,
          arquivoAssinado: raw.contract.signed_pdf_path || null,
        }
      : null,
    dadosBancarios: {
      banco: 'Banco não informado',
      codigoBanco: '000',
      agencia: '0000-0',
      conta: '000000-0',
      tipoConta: 'Corrente',
      chavePix: raw.doctor_pix_key || 'pix@credmed.local',
      tipoChavePix: 'EMAIL',
    },
    documentos: [],
    observacoes: [],
  };
}

window.AppStorage = {
  async getSolicitacoes() {
    const response = await ApiClient.getRequests();
    const rows = Array.isArray(response?.data) ? response.data : [];
    return rows.map(normalizeRequest);
  },

  async getSolicitacoesMedico(medicoId) {
    const doctorId = Number(String(medicoId).replace(/\D/g, '')) || 1;
    const response = await ApiClient.getRequests({ doctor_id: doctorId });
    const rows = Array.isArray(response?.data) ? response.data : [];
    return rows.map(normalizeRequest);
  },

  async getSolicitacao(id) {
    const response = await ApiClient.getRequestById(id);
    const request = response?.data;
    if (!request) return null;
    return normalizeRequest(request);
  },

  async criarSolicitacao(dados) {
    const requestPayload = {
      doctor_id: Number(String(dados.medicoId || '').replace(/\D/g, '')) || 1,
      company_id: Number(String(dados.empresaId || '').replace(/\D/g, '')) || 1,
      total_amount: Number(dados.valorTotal || 0),
      fee_rate: Number(dados.taxaPercentual || 0),
      net_amount: Number(dados.valorLiquido || 0),
      notes: 'Solicitação enviada pelo portal médico',
      plantoes: (dados.plantoes || []).map((p) => ({
        data: p.data,
        horarioInicio: p.horarioInicio || '19:00',
        horarioFim: p.horarioFim || '07:00',
        duracao: Number(p.duracao || 12),
        local: p.local || 'Plantão',
        valor: Number(p.valor || 0),
      })),
    };

    const response = await ApiClient.createRequest(requestPayload);
    return normalizeRequest(response?.data || {});
  },

  async adminAprovarDireto(id, observacao = '') {
    await ApiClient.approveDirect(id, { notes: observacao || 'Aprovação direta admin' });
    return true;
  },

  async adminEncaminharParaEmpresa(id, observacao = '') {
    await ApiClient.setInReview(id, {
      notes: observacao || 'Encaminhado para análise interna (MVP sem portal empresa)',
    });
    return true;
  },

  async adminSolicitarInformacoes(id, mensagem = '') {
    await ApiClient.requestInfo(id, { notes: mensagem || 'Solicitadas informações adicionais' });
    return true;
  },

  async adminRejeitar(id, motivo, detalhes) {
    const notes = `${motivo || 'motivo não informado'} - ${detalhes || ''}`.trim();
    await ApiClient.reject(id, { notes });
    return true;
  },

  async registrarPagamento(id, dadosPagamento = {}) {
    await ApiClient.pay(id, { notes: dadosPagamento.observacao || 'Pagamento registrado no portal admin' });
    return true;
  },
};
