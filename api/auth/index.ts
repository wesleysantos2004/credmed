import { Router } from "../../core/router.ts";
import { Api } from "../../core/utils/abstract.ts";
import { RouteError } from "../../core/utils/route-error.ts";
import { UserQuery } from "./query.ts";
import { CREATE_TABLES_SQL } from "./tables.ts";

export class AuthApi extends Api {
  query = new UserQuery(this.db);

  handlers = {
    postUser: (req, res) => {
      const { email, password } = req.body;
      const password_hash = password; // Aqui você deve implementar a lógica de hash da senha
      const role = "doctor";
      const status = "active";
      const writeResult = this.query.insertUser({
        email,
        password_hash,
        role,
        status,
      });
      if (writeResult.changes === 0) {
        throw new RouteError(400, "erro ao criar usuário");
      }

      console.log("Usuário criado com ID:", writeResult.lastInsertRowid);
      res.status(201).json({ message: "usuário criado com sucesso" });
    },

    postDoctor: (req, res) => {
      const {
        full_name,
        cpf,
        email,
        crm,
        phone,
        pix_key,
        pix_key_type,
        password,
        bank_name,
        //bank_account,
        birth_date,
      } = req.body;
      const password_hash = password; // Aqui você deve implementar a lógica de hash da senha
      const crm_state = "active";
      const id_document_photo = "";
      const selfie_with_document = "";

      const writeResult = this.query.insertDoctor({
        full_name,
        cpf,
        email,
        crm,
        phone,
        pix_key,
        pix_key_type,
        birth_date,
        password_hash,
        bank_name,
        //bank_account,
        id_document_photo,
        selfie_with_document,
        crm_state,
      });

      if (writeResult.changes === 0) {
        throw new RouteError(400, "erro ao criar médico");
      }

      console.log("Usuário criado com ID:", writeResult.lastInsertRowid);
      res.status(201).json({ message: "usuário criado com sucesso" });
    },
  } satisfies Api["handlers"];

  tables(): void {
    this.db.exec(CREATE_TABLES_SQL);
  }
  routes(): void {
    this.router.post("/auth/user", this.handlers.postUser);
    this.router.post("/auth/doctor", this.handlers.postDoctor);
  }
}
