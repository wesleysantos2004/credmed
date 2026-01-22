import { Request, Response, NextFunction } from "express";
import { AdvRequest, Doctor, Company, Shift } from "../models/index";
import { AppError } from "../middlewares/errorHandler";

/**
 * Lista todas as solicitações com filtros opcionais
 * @route GET /api/v1/requests
 * @query status - Filtrar por status (pending, approved, paid, etc.)
 * @query doctor_id - Filtrar por ID do médico
 * @query company_id - Filtrar por ID da empresa
 */
export const listRequests = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { status, doctor_id, company_id } = req.query;

    // Construir filtros dinamicamente
    const where: any = {};
    if (status) where.status = status;
    if (doctor_id) where.doctor_id = doctor_id;
    if (company_id) where.company_id = company_id;

    const requests = await AdvRequest.findAll({
      where,
      include: [
        {
          model: Doctor,
          as: "doctor",
          attributes: ["id", "full_name", "cpf", "crm", "crm_state", "status"],
        },
        {
          model: Company,
          as: "company",
          attributes: ["id", "name", "cnpj", "cashback_rate"],
        },
        {
          model: Shift,
          as: "shifts",
          include: [
            {
              model: Company,
              as: "company",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.success(requests, "Solicitações recuperadas com sucesso");
  } catch (error) {
    next(error);
  }
};

/**
 * Busca uma solicitação específica por ID
 * @route GET /api/v1/requests/:id
 * @param id - ID da solicitação (UUID)
 */
export const getRequestById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const request = await AdvRequest.findByPk(id, {
      include: [
        {
          model: Doctor,
          as: "doctor",
          attributes: [
            "id",
            "full_name",
            "cpf",
            "crm",
            "crm_state",
            "phone",
            "email",
            "pix_key",
            "pix_key_type",
            "bank_name",
            "bank_account",
            "status",
          ],
        },
        {
          model: Company,
          as: "company",
          attributes: [
            "id",
            "name",
            "cnpj",
            "contact_name",
            "contact_email",
            "cashback_rate",
          ],
        },
        {
          model: Shift,
          as: "shifts",
          include: [
            {
              model: Company,
              as: "company",
              attributes: ["id", "name"],
            },
          ],
          order: [["shift_date", "ASC"]],
        },
      ],
    });

    if (!request) {
      throw new AppError(404, "ERROR", "Solicitação não encontrada");
    }

    res.success(request, "Solicitação recuperada com sucesso");
  } catch (error) {
    next(error);
  }
};

/**
 * Cria uma nova solicitação de antecipação
 * @route POST /api/v1/requests
 */
export const createRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { doctor_id, company_id, shifts } = req.body;

    // Validar se médico e empresa existem
    const doctor = await Doctor.findByPk(doctor_id);
    if (!doctor) {
      throw new AppError(404, "ERROR", "Médico não encontrado");
    }

    const company = await Company.findByPk(company_id);
    if (!company) {
      throw new AppError(404, "ERROR", "Empresa não encontrada");
    }

    // Calcular valores
    const total_amount = shifts.reduce(
      (sum: number, shift: any) => sum + shift.amount,
      0,
    );
    const fee_rate = 2.5; // Taxa padrão de 2.5%
    const net_amount = total_amount * (1 - fee_rate / 100);

    // Gerar número da solicitação
    const year = new Date().getFullYear();
    const count = await AdvRequest.count();
    const request_number = `SOL-${year}-${String(count + 1).padStart(5, "0")}`;

    // Criar solicitação
    const request = await AdvRequest.create({
      doctor_id,
      company_id,
      request_number,
      total_amount,
      fee_rate,
      net_amount,
      status: "draft",
    });

    // Criar plantões
    const shiftPromises = shifts.map((shift: any) =>
      Shift.create({
        request_id: request.id,
        company_id: shift.company_id,
        shift_date: shift.shift_date,
        start_time: shift.start_time,
        end_time: shift.end_time,
        hours: shift.hours,
        location: shift.location,
        amount: shift.amount,
        status: "pending",
      }),
    );

    await Promise.all(shiftPromises);

    // Buscar solicitação completa
    const createdRequest = await AdvRequest.findByPk(request.id, {
      include: [
        { model: Doctor, as: "doctor" },
        { model: Company, as: "company" },
        { model: Shift, as: "shifts" },
      ],
    });

    res.success(createdRequest, "Solicitação criada com sucesso", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza o status de uma solicitação
 * @route PATCH /api/v1/requests/:id/status
 */
export const updateRequestStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const request = await AdvRequest.findByPk(id);
    if (!request) {
      throw new AppError(404, "ERROR", "Solicitação não encontrada");
    }

    // Validar transições de status
    const validTransitions: { [key: string]: string[] } = {
      draft: ["pending"],
      pending: ["in_review", "cancelled"],
      in_review: ["approved", "rejected", "pending_info"],
      pending_info: ["in_review"],
      approved: ["paid"],
      rejected: [],
      paid: [],
      cancelled: [],
    };

    if (!validTransitions[request.status]?.includes(status)) {
      throw new AppError(
        400,
        "ERROR",
        `Transição de status inválida: ${request.status} -> ${status}`,
      );
    }

    request.status = status;
    if (notes) request.notes = notes;
    await request.save();

    res.success(request, `Status atualizado para ${status}`);
  } catch (error) {
    next(error);
  }
};
