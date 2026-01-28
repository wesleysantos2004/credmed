import { Router } from "../../core/router.ts";
import { Api } from "../../core/utils/abstract.ts";
import { RouteError } from "../../core/utils/route-error.ts";
import { RequestsQuery } from "./query.ts";

export class RequestsApi extends Api {
  query = new RequestsQuery(this.db);

  handlers = {
    postRequest: (req, res) => {
      const { doctor_id, company_id, total_amount, fee_rate, net_amount, notes } = req.body;
      const status = 'pending';

     const writeResult = this.query.insertRequest({
        doctor_id,
        company_id,
        total_amount,
        fee_rate,
        net_amount,
        status,
        notes,
     });

      if (writeResult.changes === 0) {
        throw new RouteError(400, "erro ao criar empresa");
      }

      console.log("Request created with ID:", writeResult.lastInsertRowid);
      res.status(201).json({ message: "Request created successfully" });

    },
    getRequests: (req, res) => {
      res.status(200).json("ola");
    },
  } satisfies Api["handlers"];

  tables(): void {
    
  }

  routes(): void {
    this.router.post("/requests", this.handlers.postRequest);
    this.router.get("/requests", this.handlers.getRequests);
  }
}
