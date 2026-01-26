import { AuthApi } from "./api/auth/index.ts";
import { CompaniesApi } from "./api/companies/index.ts";
import { Core } from "./core/core.ts";
import { logger } from "./core/middleware/logger.ts";

const core = new Core();

core.router.use([logger]);

new AuthApi(core).init();
new CompaniesApi(core).init();

core.init();
