console.clear();
const base = "http://localhost:3000";

const functions = {
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
        full_name: "Carlos Silva",
        cpf: "123.456.789-01",
        email: "carlos_silva@example.com",
        crm: "123456",
        phone: "(11) 91234-5678",
        pix_key: "carlos_silva@example.com",
        pix_key_type: "email",
        birth_date: "1980-01-01",
        specialty: "Cardiology",
        password: "securepassword",
        bank_name: "Bank Example",
      }),
    });
    const body = await response.json();
    console.table(body);
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
};

functions[process.argv[2]]();
