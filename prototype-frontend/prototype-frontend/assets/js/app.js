// Funções utilitárias
function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function login(role) {
  localStorage.setItem("userRole", role);
  localStorage.setItem("isLoggedIn", "true");

  const redirects = {
    medico: "dashboard.html",
    empresa: "dashboard.html",
    admin: "dashboard.html",
  };

  window.location.href = redirects[role];
}

function logout() {
  localStorage.clear();
  window.location.href = "../index.html";
}

function checkAuth() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    window.location.href = "login.html";
  }
}

function showToast(message, type = "success") {
  alert(message); // Simplified for prototype
}

// Mobile menu toggle
function toggleMobileMenu() {
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".sidebar-overlay");

  if (sidebar && overlay) {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  }
}

// Close menu when clicking overlay
document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.querySelector(".sidebar-overlay");
  if (overlay) {
    overlay.addEventListener("click", toggleMobileMenu);
  }

  // Close menu when clicking a link on mobile
  const sidebarLinks = document.querySelectorAll(".sidebar .nav-link");
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 768) {
        toggleMobileMenu();
      }
    });
  });
});

// Dados mockados
const mockData = {
  medico: {
    nome: "Dr. Fernando Silva",
    crm: "12345/SP",
    limiteDisponivel: 4500.0,
    limiteTotalMes: 5000.0,
  },
  solicitacoes: [
    {
      id: "SOL-2025-00042",
      numero: "SOL-2025-00042",
      status: "AGUARDANDO_VALIDACAO_EMPRESA",
      statusLabel: "Aguardando Empresa",
      valorTotal: 3500.0,
      valorLiquido: 3377.5,
      taxaPercentual: 3.5,
      valorTaxa: 122.5,
      dataSolicitacao: "2025-12-26T14:30:00",
      plantoes: 2,
      empresa: "MedPlus",
    },
    {
      id: "SOL-2025-00038",
      numero: "SOL-2025-00038",
      status: "PAGO",
      statusLabel: "Pago",
      valorTotal: 5200.0,
      valorLiquido: 5018.0,
      taxaPercentual: 3.5,
      valorTaxa: 182.0,
      dataSolicitacao: "2025-12-20T10:15:00",
      dataPagamento: "2025-12-20T16:30:00",
      plantoes: 3,
      empresa: "MedPlus",
    },
  ],
  empresa: {
    nome: "MedPlus",
    cnpj: "12.345.678/0001-90",
    cashbackAcumulado: 145.0,
    validacoesPendentes: 8,
    medicosAtivos: 23,
  },
  admin: {
    nome: "Charlene",
    cargo: "Administradora",
    solicitacoesPendentes: 8,
    solicitacoesAprovadas: 12,
    solicitacoesRejeitadas: 2,
    totalAdiantadoHoje: 15000.0,
    totalAdiantadoMes: 245000.0,
    receitaLiquidaMes: 8575.0,
    cashbackPagoMes: 2450.0,
  },
};
