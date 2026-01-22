export const authTables =
  /*sql*/

  `CREATE TABLE IF NOT EXISTS users (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL COLLATE NOCASE UNIQUE,
    "password_hash" TEXT NOT NULL UNIQUE,
    "role" TEXT NOT NULL CHECK (role IN ('doctor', 'admin')),
    "status" TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
) STRICT;
`;
