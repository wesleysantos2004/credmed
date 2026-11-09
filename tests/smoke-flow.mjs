import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { copyFile, mkdir, rm } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { access } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const SERVER_BOOT_TIMEOUT_MS = 15000;
const PROJECT_DIR = fileURLToPath(new URL("..", import.meta.url));
const TEST_PORT = Number(process.env.TEST_PORT || 3100);
const BASE_URL = process.env.BASE_URL || `http://localhost:${TEST_PORT}`;
const DEFAULT_DB_PATH = fileURLToPath(new URL("../db_credmed.sqlite", import.meta.url));
const SAMPLE_SIGNED_PDF_BASE64 = Buffer.from(
  "%PDF-1.1\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF",
  "utf8",
).toString("base64");

function nowTag() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function buildUniqueCpf() {
  return `${Date.now()}`.slice(-11);
}

function buildUniqueCnpj() {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`
    .replace(/\D/g, "")
    .slice(0, 14)
    .padEnd(14, "0");
}

async function api(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} ${path} -> ${JSON.stringify(body).slice(0, 500)}`,
    );
  }

  return body;
}

async function apiSafe(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  return { ok: response.ok, status: response.status, body };
}

async function ensureDoctor1() {
  const doctorResponse = await apiSafe("/auth/doctor/1");
  if (doctorResponse.ok) return doctorResponse.body;

  const uniqueTag = nowTag();
  const cpf = buildUniqueCpf();
  const createResponse = await api("/auth/doctor", {
    method: "POST",
    body: JSON.stringify({
      full_name: "Carlos Silva",
      cpf,
      email: `carlos.silva+${uniqueTag}@credmed.local`,
      crm: "123456",
      phone: "(11) 91234-5678",
      pix_key: `carlos.silva+${uniqueTag}@credmed.local`,
      pix_key_type: "email",
      birth_date: "1980-01-01",
      password: "securepassword",
      bank_name: "001",
    }),
  });

  assert.ok(createResponse?.message, "Falha ao criar médico de seed");

  const retry = await api("/auth/doctor/1");
  assert.ok(retry?.data?.id === 1, "Médico ID 1 não disponível após seed");
  return retry;
}

async function ensureAtLeastOneCompany() {
  const companiesResponse = await apiSafe("/companies");
  if (companiesResponse.ok && Array.isArray(companiesResponse.body) && companiesResponse.body.length > 0) {
    return companiesResponse.body;
  }

  const uniqueTag = nowTag();
  const created = await api("/companies", {
    method: "POST",
    body: JSON.stringify({
      name: `Clínica Saúde ${uniqueTag}`,
      cnpj: buildUniqueCnpj(),
      contact_name: "Roberto Souza",
      contact_phone: "(21) 98876-5435",
      contact_email: `contato+${uniqueTag}@credmed.local`,
      status: "active",
      cashback_rate: 5.0,
    }),
  });

  assert.ok(created?.message, "Falha ao criar empresa de seed");

  const companiesRetry = await api("/companies");
  assert.ok(Array.isArray(companiesRetry) && companiesRetry.length > 0, "Sem empresas após seed");
  return companiesRetry;
}

async function pathExists(path) {
  try {
    await access(path, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function createIsolatedDb() {
  const tempDir = join(tmpdir(), "credmed-tests");
  await mkdir(tempDir, { recursive: true });
  const isolatedDbPath = join(tempDir, `db-credmed-smoke-${nowTag()}.sqlite`);

  if (await pathExists(DEFAULT_DB_PATH)) {
    await copyFile(DEFAULT_DB_PATH, isolatedDbPath);
  }

  return isolatedDbPath;
}

async function startServerForTest(dbPath) {
  const env = {
    ...process.env,
    PORT: String(TEST_PORT),
    DB_PATH: dbPath,
  };

  const child = spawn("npm", ["start"], {
    cwd: PROJECT_DIR,
    stdio: ["ignore", "pipe", "pipe"],
    env,
  });

  let booted = false;
  let startupLog = "";

  const onData = (chunk) => {
    const text = chunk.toString();
    startupLog += text;
    if (startupLog.length > 6000) {
      startupLog = startupLog.slice(-6000);
    }
    if (text.includes(`Server: http://localhost:${TEST_PORT}`)) {
      booted = true;
    }
  };

  child.stdout.on("data", onData);
  child.stderr.on("data", onData);

  const started = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(
        new Error(
          `Servidor não subiu em tempo hábil. Log:\n${startupLog || "(sem saída)"}`,
        ),
      );
    }, SERVER_BOOT_TIMEOUT_MS);

    const interval = setInterval(async () => {
      if (booted) {
        clearTimeout(timeout);
        clearInterval(interval);
        resolve(true);
      }
    }, 250);

    child.once("exit", (code) => {
      clearTimeout(timeout);
      clearInterval(interval);
      reject(
        new Error(
          `Servidor encerrou antes do teste (code=${code}). Log:\n${startupLog || "(sem saída)"}`,
        ),
      );
    });
  });

  if (!started) {
    throw new Error("Falha ao iniciar servidor");
  }

  return { process: child };
}

async function stopServer(serverHandle) {
  if (!serverHandle?.process) return;
  serverHandle.process.kill("SIGTERM");
}

async function run() {
  const isolatedDbPath = await createIsolatedDb();
  const serverHandle = await startServerForTest(isolatedDbPath);

  try {
  console.log("\n[1] Pré-check: médico fixo (ID 1) e empresas");
  const doctor = await ensureDoctor1();
  assert.ok(doctor?.data?.id === 1, "Médico ID 1 não encontrado");

  const companies = await ensureAtLeastOneCompany();
  assert.ok(Array.isArray(companies) && companies.length > 0, "Sem empresas");
  const companyId = companies[0].id;

  console.log("\n[2] Criar solicitação com plantões");
  const tag = nowTag();
  const createPayload = {
    doctor_id: 1,
    company_id: companyId,
    total_amount: 2000,
    fee_rate: 5,
    net_amount: 1900,
    notes: `Smoke flow ${tag}`,
    shifts: [
      {
        shift_date: "2026-11-10",
        start_time: "19:00",
        end_time: "07:00",
        hours: 12,
        location: `Hospital Smoke A ${tag}`,
        amount: 1000,
      },
      {
        shift_date: "2026-11-11",
        start_time: "19:00",
        end_time: "07:00",
        hours: 12,
        location: `Hospital Smoke B ${tag}`,
        amount: 1000,
      },
    ],
  };

  const created = await api("/requests", {
    method: "POST",
    body: JSON.stringify(createPayload),
  });

  const requestId = created?.data?.id;
  assert.ok(Number.isInteger(requestId), "ID da solicitação inválido");
  assert.equal(created?.data?.status, "pending", "Status inicial deve ser pending");

  console.log(`Solicitação criada: ${requestId}`);

  console.log("\n[3] Validar detalhe da solicitação (com plantões)");
  const detail1 = await api(`/requests/${requestId}`);
  assert.equal(detail1?.data?.id, requestId);
  assert.ok(Array.isArray(detail1?.data?.shifts), "shifts ausente no detalhe");
  assert.equal(detail1?.data?.shifts?.length, 2, "Quantidade de plantões incorreta");

  console.log("\n[4] Admin solicita mais informações");
  await api(`/requests/${requestId}/request-info`, {
    method: "PUT",
    body: JSON.stringify({ notes: `Solicitar docs extras ${tag}` }),
  });

  const detail2 = await api(`/requests/${requestId}`);
  assert.equal(detail2?.data?.status, "in_review", "Status esperado: in_review");

  console.log("\n[5] Admin envia contrato para assinatura");
  await api(`/requests/${requestId}/approve`, {
    method: "PUT",
    body: JSON.stringify({ notes: `Contrato enviado no smoke ${tag}` }),
  });

  const detail3 = await api(`/requests/${requestId}`);
  assert.equal(detail3?.data?.status, "in_review", "Status esperado: in_review até assinatura do contrato");
  assert.ok(detail3?.data?.contract?.contract_number, "Contrato não foi gerado após aprovação");

  console.log("\n[6] Admin libera contrato para assinatura");
  await api(`/requests/${requestId}/release-contract`, {
    method: "PUT",
    body: JSON.stringify({ notes: `Liberado no smoke ${tag}` }),
  });

  const detail4 = await api(`/requests/${requestId}`);
  assert.equal(detail4?.data?.contract?.file_path, "released", "Contrato deveria estar liberado");

  console.log("\n[7] Médico anexa contrato assinado (PDF)");
  await api(`/requests/${requestId}/sign-contract`, {
    method: "PUT",
    body: JSON.stringify({
      signature_name: "Assinatura Smoke",
      signed_contract_base64: SAMPLE_SIGNED_PDF_BASE64,
    }),
  });

  const detail5 = await api(`/requests/${requestId}`);
  assert.equal(detail5?.data?.contract?.file_path, "signed", "Contrato deveria estar assinado");
  assert.ok(detail5?.data?.contract?.signed_at, "Data de assinatura não preenchida");
  assert.equal(detail5?.data?.status, "approved", "Status esperado: approved após assinatura do contrato");

  console.log("\n[8] Admin registra pagamento");
  await api(`/requests/${requestId}/pay`, {
    method: "PUT",
    body: JSON.stringify({ notes: `Pix pago ${tag}` }),
  });

  const detail6 = await api(`/requests/${requestId}`);
  assert.equal(detail6?.data?.status, "paid", "Status esperado: paid");
  assert.ok(Array.isArray(detail6?.data?.history), "Histórico ausente");
  assert.ok(detail6?.data?.history?.length >= 6, "Histórico menor que o esperado");

  console.log("\n[9] Validação de listagem do médico (ID 1)");
  const list = await api("/requests?doctor_id=1");
  const found = (list?.data || []).find((r) => r.id === requestId);
  assert.ok(found, "Solicitação não encontrada na listagem do médico");
  assert.equal(found.status, "paid", "Status final na listagem deve ser paid");

  console.log("\n✅ Smoke test completo passou com sucesso.");
  console.log(`Request validada: SOL-2026-${String(requestId).padStart(5, "0")}`);
  } finally {
    await stopServer(serverHandle);
    await rm(isolatedDbPath, { force: true });
  }
}

run().catch((error) => {
  console.error("\n❌ Falha no smoke test:");
  console.error(error);
  process.exitCode = 1;
});
