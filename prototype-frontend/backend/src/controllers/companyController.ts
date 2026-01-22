import { Request, Response, NextFunction } from "express";
import { Company, AdvRequest } from "../models/index";
import { AppError } from "../middlewares/errorHandler";

/**
 * Lista todas as empresas cadastradas
 * @route GET /api/v1/companies
 * @query status - Filtrar por status (active, inactive)
 */
export const listCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status) {
      where.status = status;
    } else {
      // Por padrão, retornar apenas empresas ativas
      where.status = "active";
    }

    const companies = await Company.findAll({
      where,
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
      order: [["name", "ASC"]],
    });

    res.success(companies, "Empresas recuperadas com sucesso");
  } catch (error) {
    next(error);
  }
};

/**
 * Busca uma empresa específica por ID
 * @route GET /api/v1/companies/:id
 * @param id - ID da empresa (UUID)
 */
export const getCompanyById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const company = await Company.findByPk(id, {
      include: [
        {
          model: AdvRequest,
          as: "requests",
          attributes: [
            "id",
            "request_number",
            "total_amount",
            "status",
            "created_at",
          ],
          order: [["created_at", "DESC"]],
          limit: 10,
        },
      ],
    });

    if (!company) {
      throw new AppError(404, "ERROR", "Empresa não encontrada");
    }

    res.success(company, "Empresa recuperada com sucesso");
  } catch (error) {
    next(error);
  }
};

/**
 * Cria uma nova empresa
 * @route POST /api/v1/companies
 */
export const createCompany = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const companyData = req.body;

    // Verificar se CNPJ já existe
    const existingCompany = await Company.findOne({
      where: { cnpj: companyData.cnpj },
    });
    if (existingCompany) {
      throw new AppError(
        409,
        "ERROR",
        "Já existe uma empresa cadastrada com este CNPJ",
      );
    }

    const company = await Company.create({
      ...companyData,
      status: "active", // Nova empresa começa como ativa
    });

    res.success(company, "Empresa criada com sucesso", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza dados de uma empresa
 * @route PATCH /api/v1/companies/:id
 */
export const updateCompany = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const company = await Company.findByPk(id);
    if (!company) {
      throw new AppError(404, "ERROR", "Empresa não encontrada");
    }

    // Não permitir atualização de CNPJ
    if (updates.cnpj) {
      throw new AppError(400, "ERROR", "CNPJ não pode ser alterado");
    }

    await company.update(updates);

    res.success(company, "Empresa atualizada com sucesso");
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza o status de uma empresa (ativar/desativar)
 * @route PATCH /api/v1/companies/:id/status
 */
export const updateCompanyStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      throw new AppError(
        400,
        "ERROR",
        "Status inválido. Use: active ou inactive",
      );
    }

    const company = await Company.findByPk(id);
    if (!company) {
      throw new AppError(404, "ERROR", "Empresa não encontrada");
    }

    company.status = status;
    await company.save();

    res.success(company, `Status da empresa atualizado para ${status}`);
  } catch (error) {
    next(error);
  }
};
