import { IProviderResponseDTO } from "@/modules/providers/dtos/IProviderResponseDTO"

export interface transactionsAttributes {
    id: string
    friendly_id: string
    gateway_id: string | null
    method: buy_payment_methods | "free" | "mxs"
    card_flag: string
    card_mask: string
    type: "increase" | "decrease"
    status: "new" | "waiting" | "paid-free" | "paid" | "unpaid" | "refunded" | "contested" | "canceled" | "settled" | "link" | "expired"
    value: number
    description: string
    provider_id: string
    subscription_id: string
    query_id: string
    credit_card_id: string
    contract_id: string
    createdAt?: Date
    updatedAt?: Date
    subscription?: subscriptionsAttributes
    credit_card?: creditCardsAttributes
}


export interface subscriptionsAttributes {
    id: string
    gateway_id: string
    card_flag: string
    card_mask: string
    status: "new" | "active" | "new_charge" | "canceled" | "expired"
    value: number
    plan_id: string
    next_execution: string
    next_expire_at: string
    credit_card_id: string
    plan?: plansAttributes
    transactions?: transactionsAttributes[]
    provider?: IProviderResponseDTO
    credit_card?: creditCardsAttributes
    updatedAt?: Date
    createdAt?: Date
}

export interface creditCardsAttributes {
    id: string
    card_flag: string
    card_mask: string
    payment_token: string
    customer: string
    billing_address: string
    bus_id: string
}

export interface plansAttributes {
    id: string
    is_test_free: boolean
    gateway_id: string
    icon: string
    active: boolean
    name: string
    description: string
    value: number
    frequency: number
    recurrence: number | null
    pj_unit_value: number
    pf_unit_value: number
    doc_unit_value: number
    permissions: string | string[]
    contract_templates_limit: number
    users_limit: number
    cloud_limit: number
    createdAt?: Date
    updatedAt?: Date
}



export type buy_payment_methods = "credit_card" | "pix" | "banking_billet";


