import { Decimal, JsonValue } from "@prisma/client/runtime/library";

export type IPermissions = 'UNLIMITED-REQUESTS' | 'PORTFOLIO-PHOTOS-5' | 'PORTFOLIO-PHOTOS-10' | 
'MAX-PROFILE-CITY-5' | 'UNLIMITED-PROFILE-CITY' | 'BASIC-DASHBOARD' | 'UNLIMITED-DASHBOARD' | 'PROFILE-PREMIUM';

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
