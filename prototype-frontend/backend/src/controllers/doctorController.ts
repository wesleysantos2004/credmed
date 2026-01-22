import { Request, Response, NextFunction } from "express";
import { Doctor, AdvRequest } from "../models/index";
import { AppError } from "../middlewares/errorHandler";

/**
 * Lista todos os médicos cadastrados
 * @route GET /api/v1/doctors
 * @query status - Filtrar por status (pending, approved, blocked)
 */
export const listDoctors = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status) where.status = status;

    const doctors = await Doctor.findAll({
      where,
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
      order: [["full_name", "ASC"]],
    });

    res.success(doctors, "Médicos recuperados com sucesso");
  } catch (error) {
    next(error);
  }
};

/**
 * Busca um médico específico por ID
 * @route GET /api/v1/doctors/:id
 * @param id - ID do médico (UUID)
 */
export const getDoctorById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id, {
      include: [
        {
          model: AdvRequest,
          as: "requests",
          attributes: [
            "id",
            "request_number",
            "total_amount",
            "net_amount",
            "status",
            "created_at",
          ],
          order: [["created_at", "DESC"]],
          limit: 10,
        },
      ],
    });

    if (!doctor) {
      throw new AppError(404, "ERROR", "Médico não encontrado");
    }

    res.success(doctor, "Médico recuperado com sucesso");
  } catch (error) {
    next(error);
  }
};

/**
 * Cria um novo médico
 * @route POST /api/v1/doctors
 */
export const createDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const doctorData = req.body;

    // Verificar se CPF já existe
    const existingDoctor = await Doctor.findOne({
      where: { cpf: doctorData.cpf },
    });
    if (existingDoctor) {
      throw new AppError(
        409,
        "ERROR",
        "Já existe um médico cadastrado com este CPF",
      );
    }

    const doctor = await Doctor.create({
      ...doctorData,
      status: "pending", // Novo médico começa como pendente
    });

    res.success(doctor, "Médico criado com sucesso", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza dados de um médico
 * @route PATCH /api/v1/doctors/:id
 */
export const updateDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      throw new AppError(404, "ERROR", "Médico não encontrado");
    }

    // Não permitir atualização de CPF
    if (updates.cpf) {
      throw new AppError(400, "ERROR", "CPF não pode ser alterado");
    }

    await doctor.update(updates);

    res.success(doctor, "Médico atualizado com sucesso");
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza o status de um médico (aprovar/bloquear)
 * @route PATCH /api/v1/doctors/:id/status
 */
export const updateDoctorStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "blocked"].includes(status)) {
      throw new AppError(
        400,
        "ERROR",
        "Status inválido. Use: pending, approved ou blocked",
      );
    }

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      throw new AppError(404, "ERROR", "Médico não encontrado");
    }

    doctor.status = status;
    await doctor.save();

    res.success(doctor, `Status do médico atualizado para ${status}`);
  } catch (error) {
    next(error);
  }
};
