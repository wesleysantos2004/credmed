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
};

functions[process.argv[2]]();
