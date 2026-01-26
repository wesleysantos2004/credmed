import { Query } from "../../core/utils/abstract.ts";

declare global {
  type UserRole = "doctor" | "admin";
  type UserStatus = "active" | "inactive" | "blocked";
  type UserData = {
    id: number;
    email: string;
    password_hash: string;
    role: UserRole;
    status: UserStatus;
    created_at: string;
    updated_at: string;
  };

  type UserCreate = Omit<UserData, "id" | "created_at" | "updated_at">;

  type DoctorData = {
    id: number;
    user_id: number;
    cpf: string;
    crm: string;
    crm_state: string;
    full_name: string;
    phone: string;
    birth_date: string;
    pix_key: string;
    pix_key_type: string;
    bank_name: string;
    //bank_account: string;
    id_document_photo: string;
    selfie_with_document: string;
    kyc_verified: number;
    kyc_verified_at: string;
    kyc_verified_by: number;
    status: string;
    created_at: string;
    updated_at: string;
  };

  type DoctorCreate = Omit<
    DoctorData,
    | "id"
    | "user_id"
    | "created_at"
    | "updated_at"
    | "kyc_verified"
    | "kyc_verified_at"
    | "kyc_verified_by"
    | "status"
  >;
}

export class UserQuery extends Query {
  insertUser({ email, password_hash, role, status }: UserCreate) {
    return this.db
      .query(
        /*sql*/
        `
            INSERT OR IGNORE INTO "users" (email, password_hash, role, status)
            VALUES (?, ?, ?, ?);
            `,
      )
      .run(email, password_hash, role, status);
  }

  insertDoctor({
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
  }: DoctorCreate & { password_hash: string; email: string }) {
    const user_id = this.insertUser({
      email,
      password_hash,
      role: "doctor",
      status: "active",
    });

    console.log("Usuário criado com ID:", user_id.lastInsertRowid);

    var crm_state = "active";

    return this.db
      .query(
        /*sql*/
        `
            INSERT OR IGNORE INTO "doctors" (user_id, cpf, crm, crm_state, full_name, phone, pix_key, pix_key_type, birth_date, bank_name, /*bank_account,*/ id_document_photo, selfie_with_document)
            VALUES ((SELECT "id" FROM "users" WHERE "email" = ?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `,
      )
      .run(
        email,
        cpf,
        crm,
        crm_state,
        full_name,
        phone,
        pix_key,
        pix_key_type,
        birth_date,
        bank_name,
        //bank_account,
        id_document_photo,
        selfie_with_document,
      );
  }
}
