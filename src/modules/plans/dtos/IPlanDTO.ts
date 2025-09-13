import { Decimal, JsonValue } from "@prisma/client/runtime/library";

export interface IPlanDTO {
    id: string,
    gateway_id?: number | null,
    name?: string,
    icon?: string,
    active?: boolean,
    is_test_free?: boolean,
    value?: Decimal,
    recurrence: number | null,
    frequency: number,
    permissions?: string[] | null | JsonValue,
    description?: string,
}
