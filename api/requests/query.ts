import { Query } from "../../core/utils/abstract.ts";

type RequestStatus = ('draft' | 'pending' | 'in_review' | 'approved' | 'paid' | 'rejected' | 'cancelled');

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
        return this.db.prepare(
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
            notes,
        ); 
    };
}