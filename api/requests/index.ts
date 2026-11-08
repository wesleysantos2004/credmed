import { Router } from "../../core/router.ts";
import { Api } from "../../core/utils/abstract.ts";
import { RouteError } from "../../core/utils/route-error.ts";
import { RequestsQuery, type RequestStatus } from "./query.ts";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, basename } from "node:path";

const VALID_STATUSES: RequestStatus[] = [
  "draft",
  "pending",
  "in_review",
  "approved",
  "paid",
  "rejected",
  "cancelled",
];

const ALLOWED_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  draft: ["pending", "cancelled"],
  pending: ["in_review", "approved", "rejected", "cancelled"],
  in_review: ["approved", "rejected", "cancelled"],
  approved: ["paid", "rejected"],
  paid: [],
  rejected: [],
  cancelled: [],
};

export class RequestsApi extends Api {
  query = new RequestsQuery(this.db);

  private get contractsStorageDir() {
    return resolve(process.cwd(), "storage", "contracts");
  }

  private ensureContractsStorageDir() {
    mkdirSync(this.contractsStorageDir, { recursive: true });
  }

  private buildContractNumber(requestId: number) {
    return `CTR-${new Date().getFullYear()}-${String(requestId).padStart(6, "0")}`;
  }

  private buildContractText(params: {
    request: ReturnType<RequestsQuery["getRequestById"]>;
    shifts: ReturnType<RequestsQuery["getShiftsByRequestId"]>;
  }) {
    const { request, shifts } = params;

    const shiftsText = shifts
      .map(
        (s, index) =>
          `${index + 1}. ${s.shift_date} | ${s.start_time}-${s.end_time} | ${s.location} | R$ ${Number(s.amount || 0).toFixed(2)}`,
      )
      .join("\n");

    return [
      "CONTRATO DE ADIANTAMENTO DE PLANTÕES (MODELO DE TESTE)",
      "",
      `Médico: ${request?.doctor_name || "N/I"}`,
      `Empresa: ${request?.company_name || "N/I"}`,
      `Valor total: R$ ${Number(request?.total_amount || 0).toFixed(2)}`,
      `Taxa aplicada: ${Number(request?.fee_rate || 0).toFixed(2)}%`,
      `Valor líquido: R$ ${Number(request?.net_amount || 0).toFixed(2)}`,
      "",
      "Plantões:",
      shiftsText || "Nenhum plantão informado.",
      "",
      "Declaro que li e concordo com os termos do adiantamento.",
      "",
      "Campo de assinatura do médico:",
      "________________________________________",
    ].join("\n");
  }

  private escapePdfText(value: string) {
    return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  }

  private wrapLine(line: string, maxLength = 88) {
    if (line.length <= maxLength) return [line];
    const words = line.split(" ");
    const output: string[] = [];
    let current = "";

    for (const word of words) {
      if (!current) {
        current = word;
        continue;
      }

      if (`${current} ${word}`.length <= maxLength) {
        current = `${current} ${word}`;
      } else {
        output.push(current);
        current = word;
      }
    }

    if (current) output.push(current);
    return output;
  }

  private buildSimplePdfBuffer(text: string) {
    const normalizedLines = text
      .split("\n")
      .flatMap((line) => this.wrapLine(line))
      .slice(0, 60);

    const pdfLines = normalizedLines.map((line) => `(${this.escapePdfText(line)}) Tj`);

    const contentStream = [
      "BT",
      "/F1 10 Tf",
      "40 790 Td",
      ...pdfLines.flatMap((line, idx) => (idx === 0 ? [line] : ["0 -14 Td", line])),
      "ET",
    ].join("\n");

    const objects = [
      "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
      "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
      "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n",
      `4 0 obj\n<< /Length ${Buffer.byteLength(contentStream, "utf8")} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
      "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    ];

    let pdf = "%PDF-1.4\n";
    const offsets: number[] = [];

    for (const obj of objects) {
      offsets.push(Buffer.byteLength(pdf, "utf8"));
      pdf += obj;
    }

    const xrefOffset = Buffer.byteLength(pdf, "utf8");
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += "0000000000 65535 f \n";
    for (const offset of offsets) {
      pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    return Buffer.from(pdf, "utf8");
  }

  private parseBase64Pdf(input: string) {
    if (!input || typeof input !== "string") {
      throw new RouteError(400, "arquivo do contrato assinado é obrigatório");
    }

    const extracted = input.includes(",") ? input.split(",")[1] : input;
    const clean = extracted.replace(/\s/g, "");

    if (!clean) {
      throw new RouteError(400, "arquivo do contrato assinado inválido");
    }

    const buffer = Buffer.from(clean, "base64");
    if (!buffer.length) {
      throw new RouteError(400, "arquivo do contrato assinado inválido");
    }

    const pdfMagic = buffer.slice(0, 4).toString("utf8");
    if (pdfMagic !== "%PDF") {
      throw new RouteError(400, "o arquivo enviado deve ser um PDF válido");
    }

    return buffer;
  }

  private ensureContractGenerated(requestId: number) {
    const existing = this.query.getContractByRequestId(requestId);
    if (existing) {
      if (!existing.generated_pdf_path) {
        const pdfBuffer = this.buildSimplePdfBuffer(existing.contract_text || "Contrato CREDMED");
        const generatedPath = resolve(this.contractsStorageDir, `request-${requestId}-contrato-gerado.pdf`);
        this.ensureContractsStorageDir();
        writeFileSync(generatedPath, pdfBuffer);
        this.query.updateContractGeneratedPdfPath(requestId, generatedPath);
      }
      return this.query.getContractByRequestId(requestId);
    }

    const request = this.query.getRequestById(requestId);
    const shifts = this.query.getShiftsByRequestId(requestId);

    const contractNumber = this.buildContractNumber(requestId);
    const contractText = this.buildContractText({ request, shifts });

    this.query.insertContract({
      request_id: requestId,
      contract_number: contractNumber,
      contract_text: contractText,
      workflow_state: "generated",
    });

    const generatedPdfPath = resolve(this.contractsStorageDir, `request-${requestId}-contrato-gerado.pdf`);
    this.ensureContractsStorageDir();
    writeFileSync(generatedPdfPath, this.buildSimplePdfBuffer(contractText));
    this.query.updateContractGeneratedPdfPath(requestId, generatedPdfPath);

    this.query.addStatusHistory({
      request_id: requestId,
      old_status: request?.status || null,
      new_status: "contract_generated",
      notes: `Contrato ${contractNumber} gerado automaticamente`,
    });

    return this.query.getContractByRequestId(requestId);
  }

  private parseId(value: string | undefined, field: string) {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
      throw new RouteError(400, `${field} inválido`);
    }
    return id;
  }

  private ensureRequest(id: number) {
    const request = this.query.getRequestById(id);
    if (!request) {
      throw new RouteError(404, "solicitação não encontrada");
    }
    return request;
  }

  private parseOptionalPositiveInt(value: unknown, field: string) {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new RouteError(400, `${field} inválido`);
    }
    return parsed;
  }

  private parseStatus(value: string | null) {
    if (!value) return undefined;
    if (!VALID_STATUSES.includes(value as RequestStatus)) {
      throw new RouteError(400, "status inválido");
    }
    return value as RequestStatus;
  }

  private appendStatusChange(params: {
    id: number;
    to: RequestStatus;
    notes?: string;
    changedBy?: number;
  }) {
    const current = this.ensureRequest(params.id);

    const currentStatus = current.status as RequestStatus;
    const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(params.to)) {
      throw new RouteError(409, `transição não permitida: ${current.status} -> ${params.to}`);
    }

    if (current.status === params.to) {
      throw new RouteError(409, `solicitação já está em ${params.to}`);
    }

    const updateResult = this.query.updateStatus({
      id: params.id,
      new_status: params.to,
      notes: params.notes,
      approved_by: params.to === "approved" ? params.changedBy : undefined,
      paid_by: params.to === "paid" ? params.changedBy : undefined,
    });

    if (updateResult.changes === 0) {
      throw new RouteError(400, "não foi possível atualizar o status");
    }

    this.query.addStatusHistory({
      request_id: params.id,
      old_status: current.status,
      new_status: params.to,
      changed_by: params.changedBy,
      notes: params.notes,
    });

    return this.query.getRequestById(params.id);
  }

  handlers = {
    postRequest: (req, res) => {
      const {
        doctor_id,
        company_id,
        total_amount,
        fee_rate,
        net_amount,
        notes,
        shifts,
        plantoes,
      } = req.body;

      if (!doctor_id || !company_id || !total_amount || fee_rate === undefined) {
        throw new RouteError(400, "campos obrigatórios: doctor_id, company_id, total_amount, fee_rate");
      }

      const parsedDoctorId = this.parseId(String(doctor_id), "doctor_id");
      const parsedCompanyId = this.parseId(String(company_id), "company_id");
      const parsedTotalAmount = Number(total_amount);
      const parsedFeeRate = Number(fee_rate);

      if (!Number.isFinite(parsedTotalAmount) || parsedTotalAmount <= 0) {
        throw new RouteError(400, "total_amount inválido");
      }

      if (!Number.isFinite(parsedFeeRate) || parsedFeeRate < 0 || parsedFeeRate > 100) {
        throw new RouteError(400, "fee_rate inválido");
      }

      if (!this.query.doctorExists(parsedDoctorId)) {
        throw new RouteError(404, "médico não encontrado");
      }

      if (!this.query.companyExists(parsedCompanyId)) {
        throw new RouteError(404, "empresa não encontrada");
      }

      const status = "pending";
      const normalizedNetAmount =
        typeof net_amount === "number"
          ? net_amount
          : Number((parsedTotalAmount * (1 - parsedFeeRate / 100)).toFixed(2));

      if (!Number.isFinite(normalizedNetAmount) || normalizedNetAmount < 0) {
        throw new RouteError(400, "net_amount inválido");
      }

      const inputShifts = Array.isArray(shifts)
        ? shifts
        : Array.isArray(plantoes)
          ? plantoes
          : [];

      if (inputShifts.length === 0) {
        throw new RouteError(400, "ao menos um plantão deve ser informado");
      }

      const normalizedShifts = inputShifts.map((item) => {
        const shiftDate = item.shift_date ?? item.data;
        const startTime = item.start_time ?? item.horarioInicio;
        const endTime = item.end_time ?? item.horarioFim;
        const hours = Number(item.hours ?? item.duracao ?? 0);
        const location = item.location ?? item.local;
        const amount = Number(item.amount ?? item.valor ?? 0);

        if (!shiftDate || !startTime || !endTime || !location) {
          throw new RouteError(400, "plantão inválido: data, horário e local são obrigatórios");
        }

        if (!Number.isFinite(hours) || hours <= 0) {
          throw new RouteError(400, "plantão inválido: hours deve ser maior que zero");
        }

        if (!Number.isFinite(amount) || amount <= 0) {
          throw new RouteError(400, "plantão inválido: amount deve ser maior que zero");
        }

        return {
          shiftDate,
          startTime,
          endTime,
          hours,
          location,
          amount,
        };
      });

     const writeResult = this.query.insertRequest({
        doctor_id: parsedDoctorId,
        company_id: parsedCompanyId,
        total_amount: parsedTotalAmount,
        fee_rate: parsedFeeRate,
        net_amount: normalizedNetAmount,
        status,
        notes,
     });

      if (writeResult.changes === 0) {
        throw new RouteError(400, "erro ao criar solicitação");
      }

      const requestId = Number(writeResult.lastInsertRowid);

      for (const item of normalizedShifts) {
        this.query.insertShift(requestId, {
          company_id: parsedCompanyId,
          shift_date: item.shiftDate,
          start_time: item.startTime,
          end_time: item.endTime,
          hours: item.hours,
          location: item.location,
          amount: item.amount,
          status: "pending",
        });
      }

      this.query.addStatusHistory({
        request_id: requestId,
        old_status: null,
        new_status: status,
        notes: notes || "Solicitação criada",
      });

      const createdRequest = this.query.getRequestById(requestId);

      console.log("Request created with ID:", writeResult.lastInsertRowid);
      res.status(201).json({
        message: "Solicitação criada com sucesso",
        data: {
          ...createdRequest,
          shifts: this.query.getShiftsByRequestId(requestId),
        },
      });

    },
    getRequests: (req, res) => {
      const doctor_id = req.query.get("doctor_id");
      const status = req.query.get("status");

      const requests = this.query.getRequests({
        doctor_id: doctor_id ? this.parseId(doctor_id, "doctor_id") : undefined,
        status: this.parseStatus(status),
      });

      res.status(200).json({ data: requests });
    },

    getRequestById: (req, res) => {
      const id = this.parseId(req.params.id, "id");
      const request = this.ensureRequest(id);

      res.status(200).json({
        data: {
          ...request,
          shifts: this.query.getShiftsByRequestId(id),
          history: this.query.getStatusHistoryByRequestId(id),
          contract: this.query.getContractByRequestId(id),
        },
      });
    },

    getPendingContractSignatures: (_req, res) => {
      const data = this.query.getPendingContractSignatures();
      res.status(200).json({ data });
    },

    downloadContractPdf: (req, res) => {
      const id = this.parseId(req.params.id, "id");
      this.ensureRequest(id);
      const contract = this.ensureContractGenerated(id);

      const targetPath = contract?.generated_pdf_path;
      if (!targetPath) {
        throw new RouteError(404, "PDF do contrato não encontrado");
      }

      const file = readFileSync(targetPath);
      const filename = basename(targetPath);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=\"${filename}\"`);
      res.end(file);
    },

    setInReview: (req, res) => {
      const id = this.parseId(req.params.id, "id");
      const { notes, changed_by } = req.body;
      const data = this.appendStatusChange({
        id,
        to: "in_review",
        notes,
        changedBy: this.parseOptionalPositiveInt(changed_by, "changed_by"),
      });

      res.status(200).json({ message: "Solicitação marcada em análise", data });
    },

    approveDirect: (req, res) => {
      const id = this.parseId(req.params.id, "id");
      const { notes } = req.body;
      const current = this.ensureRequest(id);

      if (current.status === "rejected" || current.status === "cancelled" || current.status === "paid") {
        throw new RouteError(409, "solicitação não pode entrar em assinatura no status atual");
      }

      const contract = this.ensureContractGenerated(id);
      if (contract?.file_path !== "released" && contract?.file_path !== "signed") {
        this.query.updateContractWorkflowState(id, "released");
        this.query.addStatusHistory({
          request_id: id,
          old_status: current.status,
          new_status: "contract_released",
          notes: "Contrato liberado para assinatura do médico",
        });
      }

      res.status(200).json({
        message: "Contrato gerado e liberado para assinatura do médico",
        data: {
          ...current,
          contract: this.query.getContractByRequestId(id),
        },
      });
    },

    approve: (req, res) => {
      const id = this.parseId(req.params.id, "id");
      const { notes } = req.body;
      const current = this.ensureRequest(id);

      if (current.status === "rejected" || current.status === "cancelled" || current.status === "paid") {
        throw new RouteError(409, "solicitação não pode entrar em assinatura no status atual");
      }

      const contract = this.ensureContractGenerated(id);
      if (contract?.file_path === "generated") {
        this.query.updateContractWorkflowState(id, "released");
        this.query.addStatusHistory({
          request_id: id,
          old_status: current.status,
          new_status: "contract_released",
          notes: notes || "Contrato liberado para assinatura do médico",
        });
      }

      res.status(200).json({
        message: "Contrato gerado e liberado para assinatura. A aprovação ocorrerá após o envio do contrato assinado.",
        data: { ...current, contract: this.query.getContractByRequestId(id) },
      });
    },

    requestInfo: (req, res) => {
      const id = this.parseId(req.params.id, "id");
      const { notes, changed_by } = req.body;

      const data = this.appendStatusChange({
        id,
        to: "in_review",
        notes: notes || "Solicitadas informações adicionais",
        changedBy: this.parseOptionalPositiveInt(changed_by, "changed_by"),
      });

      res.status(200).json({
        message: "Informações adicionais solicitadas",
        data,
      });
    },

    reject: (req, res) => {
      const id = this.parseId(req.params.id, "id");
      const { notes, changed_by } = req.body;

      const data = this.appendStatusChange({
        id,
        to: "rejected",
        notes,
        changedBy: this.parseOptionalPositiveInt(changed_by, "changed_by"),
      });

      res.status(200).json({ message: "Solicitação rejeitada", data });
    },

    pay: (req, res) => {
      const id = this.parseId(req.params.id, "id");
      const { notes, changed_by } = req.body;

      const current = this.ensureRequest(id);
      if (current.status !== "approved") {
        throw new RouteError(409, "somente solicitações aprovadas podem ser pagas");
      }

      const contract = this.query.getContractByRequestId(id);
      if (!contract) {
        throw new RouteError(409, "contrato ainda não foi gerado");
      }

      if (contract.file_path !== "signed" || !contract.signed_at) {
        throw new RouteError(409, "contrato precisa estar assinado pelo médico antes do pagamento");
      }

      const data = this.appendStatusChange({
        id,
        to: "paid",
        notes,
        changedBy: this.parseOptionalPositiveInt(changed_by, "changed_by"),
      });

      res.status(200).json({ message: "Pagamento registrado", data });
    },

    releaseContract: (req, res) => {
      const id = this.parseId(req.params.id, "id");
      const current = this.ensureRequest(id);

      if (current.status === "rejected" || current.status === "cancelled" || current.status === "paid") {
        throw new RouteError(409, "somente solicitações pendentes podem ser liberadas para assinatura");
      }

      const contract = this.ensureContractGenerated(id);
      if (!contract) {
        throw new RouteError(400, "não foi possível gerar o contrato");
      }

      if (contract.file_path === "signed") {
        res.status(200).json({
          message: "Contrato já foi assinado pelo médico",
          data: this.query.getContractByRequestId(id),
        });
        return;
      }

      if (contract.file_path === "released") {
        res.status(200).json({
          message: "Contrato já foi liberado para assinatura",
          data: this.query.getContractByRequestId(id),
        });
        return;
      }

      this.query.updateContractWorkflowState(id, "released");
      this.query.addStatusHistory({
        request_id: id,
        old_status: current.status,
        new_status: "contract_released",
        notes: "Contrato liberado para assinatura do médico",
      });

      res.status(200).json({
        message: "Contrato liberado para assinatura",
        data: this.query.getContractByRequestId(id),
      });
    },

    signContract: (req, res) => {
      const id = this.parseId(req.params.id, "id");
      const current = this.ensureRequest(id);
      const { signature_name, signed_contract_base64 } = req.body || {};

      if (current.status === "rejected" || current.status === "cancelled" || current.status === "paid") {
        throw new RouteError(409, "solicitação não pode receber assinatura no status atual");
      }

      const contract = this.query.getContractByRequestId(id);
      if (!contract) {
        throw new RouteError(409, "contrato não encontrado para esta solicitação");
      }

      if (contract.file_path !== "released") {
        throw new RouteError(409, "contrato ainda não foi liberado para assinatura");
      }

      if (contract.signed_at) {
        throw new RouteError(409, "contrato já foi assinado");
      }

      const signedBuffer = this.parseBase64Pdf(signed_contract_base64);
      const signedPath = resolve(this.contractsStorageDir, `request-${id}-contrato-assinado.pdf`);
      this.ensureContractsStorageDir();
      writeFileSync(signedPath, signedBuffer);

      this.query.signContract(id, signature_name);
      this.query.updateContractSignedPdfPath(id, signedPath);
      this.query.addStatusHistory({
        request_id: id,
        old_status: current.status,
        new_status: "contract_signed",
        notes: "Contrato assinado pelo médico",
      });

      if (current.status !== "approved") {
        this.appendStatusChange({
          id,
          to: "approved",
          notes: "Solicitação aprovada automaticamente após envio do contrato assinado",
        });
      }

      res.status(200).json({
        message: "Contrato assinado e solicitação aprovada com sucesso",
        data: this.query.getContractByRequestId(id),
      });
    },
  } satisfies Api["handlers"];

  tables(): void {
    const contractColumns = this.db
      .query(
        /*sql*/
        `
          PRAGMA table_info('contracts');
        `,
      )
      .all() as Array<{ name: string }>;

    const hasGeneratedPdfPath = contractColumns.some((col) => col.name === "generated_pdf_path");
    const hasSignedPdfPath = contractColumns.some((col) => col.name === "signed_pdf_path");

    if (!hasGeneratedPdfPath) {
      this.db.exec(`ALTER TABLE contracts ADD COLUMN generated_pdf_path TEXT;`);
    }

    if (!hasSignedPdfPath) {
      this.db.exec(`ALTER TABLE contracts ADD COLUMN signed_pdf_path TEXT;`);
    }

    this.ensureContractsStorageDir();
  }

  routes(): void {
    this.router.post("/requests", this.handlers.postRequest);
    this.router.get("/requests", this.handlers.getRequests);
    this.router.get("/requests/contracts/pending-signature", this.handlers.getPendingContractSignatures);
    this.router.get("/requests/:id/contract-pdf", this.handlers.downloadContractPdf);
    this.router.get("/requests/:id", this.handlers.getRequestById);
    this.router.put("/requests/:id/set-in-review", this.handlers.setInReview);
    this.router.put("/requests/:id/approve-direct", this.handlers.approveDirect);
    this.router.put("/requests/:id/approve", this.handlers.approve);
    this.router.put("/requests/:id/request-info", this.handlers.requestInfo);
    this.router.put("/requests/:id/reject", this.handlers.reject);
    this.router.put("/requests/:id/release-contract", this.handlers.releaseContract);
    this.router.put("/requests/:id/sign-contract", this.handlers.signContract);
    this.router.put("/requests/:id/pay", this.handlers.pay);
  }
}
