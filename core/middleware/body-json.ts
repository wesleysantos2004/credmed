import type { Middleware } from '../router.ts';
import { RouteError } from '../utils/route-error.ts';

export const bodyJson: Middleware = async (req, res) => {
  const contentType = String(req.headers['content-type'] || '').toLowerCase();
  if (!contentType.includes('application/json')) {
    return;
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString('utf-8');
  if (body === '') {
    req.body = {};
    return;
  }

  try {
    req.body = JSON.parse(body);
  } catch {
    throw new RouteError(400, 'json inválido');
  }
};
