console.clear();
const base = "http://localhost:3000";

export const functionsBackend = {
  async postUser() {
    const response = await fetch(base + "/auth/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "example@example.com",
        password: "password123",
      }),
    });
    const body = await response.json();
    console.table(body);
  },

  async postDoctor() {
    const response = await fetch(base + "/auth/doctor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: "Eduardo Pereira",
        cpf: "055.666.789-01",
        email: "eduardo_pereira@example.com",
        crm: "123456",
        phone: "(11) 91234-5678",
        pix_key: "eduardo_pereira@example.com",
        pix_key_type: "email",
        birth_date: "1980-01-01",
        password: "securepassword",
        bank_name: "Bank Example",
      }),
    });
    const body = await response.json();
    console.table(body);
  },

  async getDoctor(id) {
    const response = await fetch(base + `/auth/doctor/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = await response.json();
    console.log(body);
  },

  async postCompanies() {
    const response = await fetch(base + "/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Clínica Saúde",
        cnpj: "12.345.678/0001-95",
        contact_name: "Roberto Souza",
        contact_phone: "(21) 98876-5435",
        contact_email: "roberto.souza@example.com",
        status: "active",
        cashback_rate: 5.0,
      }),
    });
    const body = await response.json();
    console.table(body);
  },

  async getCompanies() {
    const response = await fetch(base + "/companies", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = await response.json();
    console.log(body);
  },

  async postRequest() {
    const response = await fetch(base + "/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: 14,
        doctor_id: 6,
        company_id: 1,
        total_amount: 2500.0,
        fee_rate: 5.0,
        net_amount: 2437.5,
        notes: "Patient requires follow-up in 2 weeks.",
      }),
    });
    const body = await response.json();
    console.table(body);
  },
};

//functions[process.argv[2]]();
