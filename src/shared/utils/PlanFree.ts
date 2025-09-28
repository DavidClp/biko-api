import { IPlanDTO } from "@/modules/plans/dtos/IPlanDTO"
import { Decimal } from "@prisma/client/runtime/library"

const PlanFree: IPlanDTO = {
    id: 'free',
    name: 'Free',
    description: 'Free plan',
    value: Decimal(0),
    permissions: [],
    recurrence: 0,
    frequency: 0
}

export default PlanFree