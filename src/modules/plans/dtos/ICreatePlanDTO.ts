

export interface ICreatePlanDTO {
    name: string,
    gateway_id?: number,
    icon: string,
    value: number,
    recurrence: number,
    frequency: number,
    permissions: string[],
    description: string,
}
