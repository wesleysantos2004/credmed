import { Query } from "../../core/utils/abstract.ts";

type CompanyStatus = "active" | "inactive";

type CompanyData = {
  id: number;
  name: string;
  cnpj: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  status: CompanyStatus;
  cashback_rate: number;
  created_at: string;
  updated_at: string;
};

type CompanyCreate = Omit<CompanyData, "id" | "created_at" | "updated_at">;

export class CompaniesQuery extends Query {
  insertCompany({
    name,
    cnpj,
    contact_name,
    contact_email,
    contact_phone,
    status,
    cashback_rate,
  }: CompanyCreate) {
    return this.db
      .query(
        /*sql*/
        `
            INSERT INTO "companies" (name, cnpj, contact_name, contact_email, contact_phone, status, cashback_rate)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `,
      )
      .run(
        name,
        cnpj,
        contact_name,
        contact_email,
        contact_phone,
        status,
        cashback_rate,
      );
  }

  getAllCompanies() {
    return this.db
      .query(
        /*sql*/
        `
            SELECT * FROM "companies";
        `,
      )
      .all() as CompanyData[];
  }
}
