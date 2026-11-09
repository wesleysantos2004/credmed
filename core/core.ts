import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
  type Server,
} from "node:http";
import { Router } from "./router.ts";
import { customRequest } from "./http/custom-request.ts";
import { customResponse } from "./http/custom-response.ts";
import { bodyJson } from "./middleware/body-json.ts";
import { cors } from "./middleware/cors.ts";
import { RouteError } from "./utils/route-error.ts";
import { Database } from "./database.ts";

export class Core {
  router: Router;
  server: Server;
  db: Database;
  port: number;
  constructor() {
    this.router = new Router();
    this.router.use([cors, bodyJson]);
    const dbPath = process.env.DB_PATH || "./db_credmed.sqlite";
    this.port = Number(process.env.PORT || 3000);
    this.db = new Database(dbPath);
    this.server = createServer(this.handler);
  }
  handler = async (request: IncomingMessage, response: ServerResponse) => {
    try {
      const req = await customRequest(request);
      const res = customResponse(response);

      for (const middleware of this.router.middlewares) {
        await middleware(req, res);
        if (response.writableEnded) {
          return;
        }
      }

      const matched = this.router.find(req.method || "", req.pathname);
      if (!matched) {
        throw new RouteError(404, "nao encontrada");
      }
      const { route, params } = matched;
      req.params = params;

      for (const middleware of route.middlewares) {
        await middleware(req, res);
        if (response.writableEnded) {
          return;
        }
      }

      await route.handler(req, res);
    } catch (error) {
      if (error instanceof RouteError) {
        console.error(
          `${error.status} ${error.message} | ${request.method} ${request.url}`,
        );
        response.statusCode = error.status;
        response.setHeader("content-type", "application/problem+json");
        response.end(
          JSON.stringify({ status: response.statusCode, title: error.message }),
        );
      } else {
        console.error(error);
        response.statusCode = 500;
        response.setHeader("content-type", "application/problem+json");
        response.end(
          JSON.stringify({ status: response.statusCode, title: "error" }),
        );
      }
    }
  };
  init() {
    this.server.listen(this.port, () => {
      console.log(`Server: http://localhost:${this.port}`);
    });
  }
}
