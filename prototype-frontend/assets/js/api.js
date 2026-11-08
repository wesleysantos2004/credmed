const API_BASE_URL = localStorage.getItem('apiBaseUrl') || 'http://localhost:3000';
const API_TIMEOUT_MS = 30000;

async function apiRequest(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') || '';
    const body = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message = body?.title || body?.message || `Erro HTTP ${response.status}`;
      throw new Error(message);
    }

    return body;
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('Tempo de resposta da API excedido');
    }

    if (error instanceof TypeError) {
      throw new Error('Não foi possível conectar ao backend');
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

window.ApiClient = {
  getDoctor(id) {
    return apiRequest(`/auth/doctor/${id}`, { method: 'GET' });
  },

  getCompanies() {
    return apiRequest('/companies', { method: 'GET' });
  },

  getCompanyById(id) {
    return apiRequest(`/companies/${id}`, { method: 'GET' });
  },

  getRequests(params = {}) {
    const query = new URLSearchParams();
    if (params.doctor_id) query.set('doctor_id', String(params.doctor_id));
    if (params.status) query.set('status', String(params.status));
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return apiRequest(`/requests${suffix}`, { method: 'GET' });
  },

  getRequestById(id) {
    return apiRequest(`/requests/${id}`, { method: 'GET' });
  },

  getPendingContractSignatures() {
    return apiRequest('/requests/contracts/pending-signature', { method: 'GET' });
  },

  async downloadContractPdf(id) {
    const response = await fetch(`${API_BASE_URL}/requests/${id}/contract-pdf`, {
      method: 'GET',
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type') || '';
      const body = contentType.includes('application/json')
        ? await response.json()
        : await response.text();
      const message = body?.title || body?.message || `Erro HTTP ${response.status}`;
      throw new Error(message);
    }

    const blob = await response.blob();
    const disposition = response.headers.get('content-disposition') || '';
    const match = disposition.match(/filename="?([^\"]+)"?/i);
    return {
      blob,
      filename: match?.[1] || `contrato-${id}.pdf`,
    };
  },

  createRequest(payload) {
    return apiRequest('/requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  setInReview(id, payload = {}) {
    return apiRequest(`/requests/${id}/set-in-review`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  approveDirect(id, payload = {}) {
    return apiRequest(`/requests/${id}/approve-direct`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  approve(id, payload = {}) {
    return apiRequest(`/requests/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  requestInfo(id, payload = {}) {
    return apiRequest(`/requests/${id}/request-info`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  reject(id, payload = {}) {
    return apiRequest(`/requests/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  releaseContract(id, payload = {}) {
    return apiRequest(`/requests/${id}/release-contract`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  signContract(id, payload = {}) {
    return apiRequest(`/requests/${id}/sign-contract`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  uploadSignedContract(id, payload = {}) {
    return apiRequest(`/requests/${id}/sign-contract`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  pay(id, payload = {}) {
    return apiRequest(`/requests/${id}/pay`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};
