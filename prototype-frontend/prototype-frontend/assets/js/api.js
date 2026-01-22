// API Client para integração com backend - LIMPO (sem localStorage)
const API_BASE_URL = "http://localhost:3000/api/v1"; // Porta padrão ajustada para 3000

const API = {
  // Configuração padrão para fetch
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || "Erro na requisição");
      }

      return data.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  // ==================== REQUESTS ====================

  async getRequests(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.doctor_id) params.append("doctor_id", filters.doctor_id);
    if (filters.company_id) params.append("company_id", filters.company_id);

    const queryString = params.toString();
    const endpoint = queryString ? `/requests?${queryString}` : "/requests";

    const data = await this.request(endpoint);
    return data.map((req) => this.mapRequestToFrontend(req));
  },

  async getRequestById(id) {
    const data = await this.request(`/requests/${id}`);
    return this.mapRequestToFrontend(data);
  },

  async createRequest(requestData) {
    return await this.request("/requests", {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  },

  async updateRequestStatus(id, status, notes = null) {
    return await this.request(`/requests/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes }),
    });
  },

  // ==================== DOCTORS ====================

  async getDoctors(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);

    const queryString = params.toString();
    const endpoint = queryString ? `/doctors?${queryString}` : "/doctors";

    return await this.request(endpoint);
  },

  async getDoctorById(id) {
    return await this.request(`/doctors/${id}`);
  },

  async createDoctor(doctorData) {
    return await this.request("/doctors", {
      method: "POST",
      body: JSON.stringify(doctorData),
    });
  },

  async updateDoctor(id, doctorData) {
    return await this.request(`/doctors/${id}`, {
      method: "PATCH",
      body: JSON.stringify(doctorData),
    });
  },

  async updateDoctorStatus(id, status) {
    return await this.request(`/doctors/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // ==================== COMPANIES ====================

  async getCompanies(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);

    const queryString = params.toString();
    const endpoint = queryString ? `/companies?${queryString}` : "/companies";

    return await this.request(endpoint);
  },

  async getCompanyById(id) {
    return await this.request(`/companies/${id}`);
  },

  async createCompany(companyData) {
    return await this.request("/companies", {
      method: "POST",
      body: JSON.stringify(companyData),
    });
  },

  async updateCompany(id, companyData) {
    return await this.request(`/companies/${id}`, {
      method: "PATCH",
      body: JSON.stringify(companyData),
    });
  },

  async updateCompanyStatus(id, status) {
    return await this.request(`/companies/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // ==================== HELPERS ====================

  // Mapear dados do backend para formato do frontend
  mapRequestToFrontend(request) {
    const totalAmount = parseFloat(request.total_amount) || 0;
    const feeRate = parseFloat(request.fee_rate) || 0;
    const netAmount = parseFloat(request.net_amount) || 0;
    const cashbackRate = parseFloat(request.company?.cashback_rate || 0);

    return {
      id: request.id,
      numero: request.request_number,
      medicoId: request.doctor_id,
      medicoNome: request.doctor?.full_name || "N/A",
      medicoCRM:
        request.doctor?.crm_state && request.doctor?.crm
          ? `CRM-${request.doctor.crm_state} ${request.doctor.crm}`
          : "N/A",
      medicoCPF: request.doctor?.cpf || "N/A",
      medicoEmail: request.doctor?.email || "N/A",
      medicoTelefone: request.doctor?.phone || "N/A",
      empresaId: request.company_id,
      empresaNome: request.company?.name || "N/A",
      empresaCNPJ: request.company?.cnpj || "N/A",
      valorTotal: totalAmount,
      taxa: totalAmount * (feeRate / 100),
      taxaPercentual: feeRate,
      valorLiquido: netAmount,
      cashback: totalAmount * (cashbackRate / 100),
      status: this.mapStatusToFrontend(request.status),
      dataCriacao: request.createdAt,
      plantoes: (request.shifts || []).map((shift) => ({
        id: shift.id,
        data: shift.shift_date,
        horarioInicio: shift.start_time,
        horarioFim: shift.end_time,
        duracao: parseFloat(shift.hours) || 0,
        local: shift.location || "N/A",
        valor: parseFloat(shift.amount) || 0,
        empresaNome: shift.company?.name || request.company?.name || "N/A",
        validado: shift.status === "validated",
        status: shift.status,
      })),
      notas: request.notes || "",
    };
  },

  // Mapear status do backend para frontend
  mapStatusToFrontend(backendStatus) {
    const statusMap = {
      draft: "RASCUNHO",
      pending: "AGUARDANDO_TRIAGEM_ADMIN",
      in_review: "EM_ANALISE_ADMIN",
      pending_info: "AGUARDANDO_INFO_MEDICO",
      approved: "APROVADO_AGUARDANDO_PAGAMENTO",
      paid: "PAGO",
      rejected: "REJEITADO",
      cancelled: "CANCELADO",
    };
    return statusMap[backendStatus] || backendStatus.toUpperCase();
  },

  // Mapear status do frontend para backend
  mapStatusToBackend(frontendStatus) {
    const statusMap = {
      RASCUNHO: "draft",
      AGUARDANDO_TRIAGEM_ADMIN: "pending",
      EM_ANALISE_ADMIN: "in_review",
      AGUARDANDO_INFO_MEDICO: "pending_info",
      APROVADO_AGUARDANDO_PAGAMENTO: "approved",
      PAGO: "paid",
      REJEITADO: "rejected",
      CANCELADO: "cancelled",
    };
    return statusMap[frontendStatus] || frontendStatus.toLowerCase();
  },
};

// Exportar para uso global
window.API = API;
