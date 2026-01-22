import { Api } from "../../core/utils/abstract.ts";

export class RequestsApi extends Api {
  handlers = {
    getRequests: (req, res) => {
      res.status(200).json("ola");
    },
  } satisfies Api["handlers"];

  tables(): void {
    this.db.exec(/*sql*/ `
        CREATE TABLE IF NOT EXISTS "requests" (
          "id" INTEGER PRIMARY KEY,
          "title" TEXT,
          "description" TEXT
        );
      `);
  }
}
