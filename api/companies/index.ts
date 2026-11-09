import { Router } from "../../core/router.ts";
import { Api } from "../../core/utils/abstract.ts";
import { RouteError } from "../../core/utils/route-error.ts";
import { CompaniesQuery } from "./query.ts";

export class CompaniesApi extends Api {
  query = new CompaniesQuery(this.db);

  private parseId(value: string | undefined) {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
      throw new RouteError(400, "id inválido");
    }
    return id;
  }

  handlers = {
    postCompany: (req, res) => {
      const {
        name,
        cnpj,
        contact_name,
        contact_email,
        contact_phone,
        status,
        cashback_rate,
      } = req.body;

      const writeResult = this.query.insertCompany({
        name,
        cnpj,
        contact_name,
        contact_email,
        contact_phone,
        status,
        cashback_rate,
      });
      if (writeResult.changes === 0) {
        throw new RouteError(400, "erro ao criar empresa");
      }

      console.log("Empresa criada com ID:", writeResult.lastInsertRowid);
      res.status(201).json({ message: "empresa criada com sucesso" });
    },

    getCompanies: (req, res) => {
      const companies = this.query.getAllCompanies();
      if (companies.length === 0) {
        throw new RouteError(404, "nenhuma empresa encontrada");
      }

      res.status(200).json(companies);
    },

    getCompanyById: (req, res) => {
      const id = this.parseId(req.params.id);
      const company = this.query.getCompanyById(id);
      if (!company) {
        throw new RouteError(404, "empresa não encontrada");
      }

      res.status(200).json(company);
    },
  } satisfies Api["handlers"];

  tables(): void {}

  routes(): void {
    this.router.post("/companies", this.handlers.postCompany);
    this.router.get("/companies", this.handlers.getCompanies);
    this.router.get("/companies/:id", this.handlers.getCompanyById);
  }
}
