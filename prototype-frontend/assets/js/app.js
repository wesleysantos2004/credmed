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
  if (role === "empresa") {
    window.location.href = "../../index.html";
    return;
  }

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
  window.location.href = "../../index.html";
}

function checkAuth() {
  const expectedRole = arguments[0];

  if (expectedRole === "empresa") {
    window.location.href = "../../index.html";
    return;
  }

  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    localStorage.setItem("isLoggedIn", "true");
  }

  if (expectedRole) {
    localStorage.setItem("userRole", expectedRole);
  }
}

function showToast(message, type = "success") {
  const colorByType = {
    success: "text-bg-success",
    info: "text-bg-info",
    warning: "text-bg-warning",
    danger: "text-bg-danger",
    error: "text-bg-danger",
  };

  const colorClass = colorByType[type] || colorByType.info;

  const containerId = "app-toast-container";
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.className = "toast-container position-fixed top-0 end-0 p-3";
    container.style.zIndex = "1090";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast align-items-center border-0 ${colorClass}`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  container.appendChild(toast);

  if (window.bootstrap?.Toast) {
    const instance = new window.bootstrap.Toast(toast, {
      delay: type === "error" || type === "danger" ? 5000 : 3200,
    });
    instance.show();
    toast.addEventListener("hidden.bs.toast", () => toast.remove());
  } else {
    alert(message);
    toast.remove();
  }
}

function setButtonLoading(button, isLoading, loadingText = "Processando...") {
  if (!button) return;

  if (isLoading) {
    if (!button.dataset.originalHtml) {
      button.dataset.originalHtml = button.innerHTML;
    }
    button.disabled = true;
    button.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>${loadingText}`;
    return;
  }

  button.disabled = false;
  if (button.dataset.originalHtml) {
    button.innerHTML = button.dataset.originalHtml;
    delete button.dataset.originalHtml;
  }
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
