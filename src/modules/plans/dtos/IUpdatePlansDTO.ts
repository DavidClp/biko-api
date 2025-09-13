

export interface IUpdatePlansDTO {
    id: string;
    name: string,
    icon: string,
    value: number,
    recurrence: number,
    frequency: number,
    permissions: string[],
    description: string,
    active: boolean,
    is_test_free: boolean,
}
