import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';

const dbPath = '/Users/wesleyalves/Documents/credmed/credmed/db_credmed.sqlite';

if (!fs.existsSync(dbPath)) {
  console.log('DB não existe, nada para limpar.');
  process.exit(0);
}

const db = new DatabaseSync(dbPath);
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
BEGIN TRANSACTION;
DELETE FROM status_history;
DELETE FROM documents;
DELETE FROM contracts;
DELETE FROM shifts;
DELETE FROM requests;
DELETE FROM audit_logs;
DELETE FROM companies;
DELETE FROM doctors;
COMMIT;
`);

const count = (table) => db.prepare(`SELECT COUNT(*) AS c FROM ${table}`).get().c;

const result = {
  users: count('users'),
  doctors: count('doctors'),
  companies: count('companies'),
  requests: count('requests'),
  shifts: count('shifts'),
  status_history: count('status_history'),
  documents: count('documents'),
  contracts: count('contracts'),
  audit_logs: count('audit_logs'),
};

console.log('Limpeza concluída. Contagens atuais:');
console.log(JSON.stringify(result, null, 2));
