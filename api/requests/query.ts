import { Query } from "../../core/utils/abstract.ts";

export type RequestStatus = ('draft' | 'pending' | 'in_review' | 'approved' | 'paid' | 'rejected' | 'cancelled');

type RequestData = {
    id: number;
    doctor_id: number;
    company_id: number;
    total_amount: number;
    fee_rate: number;
    net_amount: number;
    status: string;
    created_at: string;
    updated_at: string;
    approved_at?: string;
    approved_by?: number;
    paid_at?: string;
    paid_by?: number;
    notes?: string;
}

type RequestCreate = Omit<RequestData, "id" | "created_at" | "updated_at" | "approved_at" | "approved_by" | "paid_at" | "paid_by">;

type ShiftCreate = {
    company_id: number;
    shift_date: string;
    start_time: string;
    end_time: string;
    hours: number;
    location: string;
    amount: number;
    status?: "pending" | "validated" | "rejected";
};

type RequestFilters = {
    doctor_id?: number;
    status?: RequestStatus;
};

export type RequestWithRelations = RequestData & {
    doctor_name: string;
    company_name: string;
    contract_file_path?: string | null;
    contract_signed_at?: string | null;
};

export type StatusHistoryData = {
    id: number;
    request_id: number;
    old_status: string | null;
    new_status: string;
    changed_by: number | null;
    changed_at: string;
    notes: string | null;
};

export type ShiftData = {
    id: number;
    request_id: number;
    company_id: number;
    shift_date: string;
    start_time: string;
    end_time: string;
    hours: number;
    location: string;
    amount: number;
    status: "pending" | "validated" | "rejected";
    created_at: string;
    updated_at: string;
};

export type ContractData = {
    id: number;
    request_id: number;
    contract_number: string;
    contract_text: string;
    signed_at: string | null;
    signature_ip: string | null;
    file_path: string | null;
    generated_pdf_path: string | null;
    signed_pdf_path: string | null;
    created_at: string;
};

export type PendingContractSignatureData = {
    request_id: number;
    contract_id: number;
    contract_number: string;
    contract_created_at: string;
    doctor_id: number;
    doctor_name: string;
    company_id: number;
    company_name: string;
    net_amount: number;
    request_created_at: string;
};

export class RequestsQuery extends Query {
    insertRequest({
        doctor_id,
        company_id,
        total_amount,
        fee_rate,
        net_amount,
        status,
        notes,
    }: RequestCreate){
        return this.db.query(
            /*sql*/
            `
            INSERT INTO "requests" (doctor_id, company_id, total_amount, fee_rate, net_amount, status, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?);
            `,
        ).run(
            doctor_id,
            company_id,
            total_amount,
            fee_rate,
            net_amount,
            status,
            notes ?? null,
        ); 
    };

        doctorExists(id: number) {
            const row = this.db
                .query(
                    /*sql*/
                    `
                    SELECT 1 AS found
                    FROM doctors
                    WHERE id = ?
                    LIMIT 1;
                    `,
                )
                .get(id) as { found: number } | undefined;

            return Boolean(row?.found);
        }

        companyExists(id: number) {
            const row = this.db
                .query(
                    /*sql*/
                    `
                    SELECT 1 AS found
                    FROM companies
                    WHERE id = ?
                    LIMIT 1;
                    `,
                )
                .get(id) as { found: number } | undefined;

            return Boolean(row?.found);
        }

        insertShift(request_id: number, shift: ShiftCreate) {
            return this.db
                .query(
                    /*sql*/
                    `
                    INSERT INTO "shifts" (request_id, company_id, shift_date, start_time, end_time, hours, location, amount, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
                    `,
                )
                .run(
                    request_id,
                    shift.company_id,
                    shift.shift_date,
                    shift.start_time,
                    shift.end_time,
                    shift.hours,
                    shift.location,
                    shift.amount,
                    shift.status || "pending",
                );
        }

        getRequests(filters: RequestFilters = {}) {
            const clauses: string[] = [];
            const params: Array<string | number> = [];

            if (filters.doctor_id) {
                clauses.push("r.doctor_id = ?");
                params.push(filters.doctor_id);
            }

            if (filters.status) {
                clauses.push("r.status = ?");
                params.push(filters.status);
            }

            const whereSql = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

            return this.db
                .query(
                    /*sql*/
                    `
                    SELECT
                        r.*,
                        d.full_name AS doctor_name,
                        c.name AS company_name,
                        ct.file_path AS contract_file_path,
                        ct.signed_at AS contract_signed_at
                    FROM requests r
                    INNER JOIN doctors d ON d.id = r.doctor_id
                    INNER JOIN companies c ON c.id = r.company_id
                    LEFT JOIN contracts ct ON ct.request_id = r.id
                    ${whereSql}
                    ORDER BY r.created_at DESC, r.id DESC;
                    `,
                )
                .all(...params) as RequestWithRelations[];
        }

        getRequestById(id: number) {
            return this.db
                .query(
                    /*sql*/
                    `
                    SELECT
                        r.*,
                        d.full_name AS doctor_name,
                        c.name AS company_name,
                        ct.file_path AS contract_file_path,
                        ct.signed_at AS contract_signed_at
                    FROM requests r
                    INNER JOIN doctors d ON d.id = r.doctor_id
                    INNER JOIN companies c ON c.id = r.company_id
                    LEFT JOIN contracts ct ON ct.request_id = r.id
                    WHERE r.id = ?
                    LIMIT 1;
                    `,
                )
                .get(id) as RequestWithRelations | undefined;
        }

        getShiftsByRequestId(request_id: number) {
            return this.db
                .query(
                    /*sql*/
                    `
                    SELECT *
                    FROM shifts
                    WHERE request_id = ?
                    ORDER BY shift_date ASC, start_time ASC;
                    `,
                )
                .all(request_id) as ShiftData[];
        }

        getStatusHistoryByRequestId(request_id: number) {
            return this.db
                .query(
                    /*sql*/
                    `
                    SELECT *
                    FROM status_history
                    WHERE request_id = ?
                    ORDER BY changed_at DESC, id DESC;
                    `,
                )
                .all(request_id) as StatusHistoryData[];
        }

        getContractByRequestId(request_id: number) {
            return this.db
                .query(
                    /*sql*/
                    `
                    SELECT *
                    FROM contracts
                    WHERE request_id = ?
                    LIMIT 1;
                    `,
                )
                .get(request_id) as ContractData | undefined;
        }

        getPendingContractSignatures() {
            return this.db
                .query(
                    /*sql*/
                    `
                    SELECT
                        r.id AS request_id,
                        ct.id AS contract_id,
                        ct.contract_number,
                        ct.created_at AS contract_created_at,
                        r.doctor_id,
                        d.full_name AS doctor_name,
                        r.company_id,
                        c.name AS company_name,
                        r.net_amount,
                        r.created_at AS request_created_at
                    FROM contracts ct
                    INNER JOIN requests r ON r.id = ct.request_id
                    INNER JOIN doctors d ON d.id = r.doctor_id
                    INNER JOIN companies c ON c.id = r.company_id
                                        WHERE r.status IN ('pending', 'in_review')
                                            AND ct.file_path = 'released'
                      AND ct.signed_at IS NULL
                    ORDER BY ct.created_at DESC, ct.id DESC;
                    `,
                )
                .all() as PendingContractSignatureData[];
        }

        insertContract({
            request_id,
            contract_number,
            contract_text,
            workflow_state,
        }: {
            request_id: number;
            contract_number: string;
            contract_text: string;
            workflow_state?: string;
        }) {
            return this.db
                .query(
                    /*sql*/
                    `
                    INSERT INTO contracts (request_id, contract_number, contract_text, file_path)
                    VALUES (?, ?, ?, ?);
                    `,
                )
                .run(request_id, contract_number, contract_text, workflow_state ?? "generated");
        }

        updateContractWorkflowState(request_id: number, workflow_state: string) {
            return this.db
                .query(
                    /*sql*/
                    `
                    UPDATE contracts
                    SET file_path = ?
                    WHERE request_id = ?;
                    `,
                )
                .run(workflow_state, request_id);
        }

        updateContractGeneratedPdfPath(request_id: number, generated_pdf_path: string) {
            return this.db
                .query(
                    /*sql*/
                    `
                    UPDATE contracts
                    SET generated_pdf_path = ?
                    WHERE request_id = ?;
                    `,
                )
                .run(generated_pdf_path, request_id);
        }

        updateContractSignedPdfPath(request_id: number, signed_pdf_path: string) {
            return this.db
                .query(
                    /*sql*/
                    `
                    UPDATE contracts
                    SET signed_pdf_path = ?
                    WHERE request_id = ?;
                    `,
                )
                .run(signed_pdf_path, request_id);
        }

        signContract(request_id: number, signature_name?: string) {
            return this.db
                .query(
                    /*sql*/
                    `
                    UPDATE contracts
                    SET
                        signed_at = CURRENT_TIMESTAMP,
                        signature_ip = ?,
                        file_path = 'signed'
                    WHERE request_id = ?;
                    `,
                )
                .run(signature_name ?? "assinatura_eletronica", request_id);
        }

        addStatusHistory({
            request_id,
            old_status,
            new_status,
            changed_by,
            notes,
        }: {
            request_id: number;
            old_status: string | null;
            new_status: string;
            changed_by?: number;
            notes?: string;
        }) {
            return this.db
                .query(
                    /*sql*/
                    `
                    INSERT INTO status_history (request_id, old_status, new_status, changed_by, notes)
                    VALUES (?, ?, ?, ?, ?);
                    `,
                )
                .run(request_id, old_status, new_status, changed_by ?? null, notes ?? null);
        }

        updateStatus({
            id,
            new_status,
            notes,
            approved_by,
            paid_by,
        }: {
            id: number;
            new_status: RequestStatus;
            notes?: string;
            approved_by?: number;
            paid_by?: number;
        }) {
            const shouldSetApproved = new_status === "approved";
            const shouldSetPaid = new_status === "paid";

            return this.db
                .query(
                    /*sql*/
                    `
                    UPDATE requests
                    SET
                        status = ?,
                        notes = COALESCE(?, notes),
                        approved_at = CASE WHEN ? THEN CURRENT_TIMESTAMP ELSE approved_at END,
                        approved_by = CASE WHEN ? THEN ? ELSE approved_by END,
                        paid_at = CASE WHEN ? THEN CURRENT_TIMESTAMP ELSE paid_at END,
                        paid_by = CASE WHEN ? THEN ? ELSE paid_by END
                    WHERE id = ?;
                    `,
                )
                .run(
                    new_status,
                    notes ?? null,
                    shouldSetApproved ? 1 : 0,
                    shouldSetApproved ? 1 : 0,
                    approved_by ?? null,
                    shouldSetPaid ? 1 : 0,
                    shouldSetPaid ? 1 : 0,
                    paid_by ?? null,
                    id,
                );
        }
}