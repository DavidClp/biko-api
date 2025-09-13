import { ICreatePlanDTO } from "../../../../modules/plans/dtos/ICreatePlanDTO";
import { IUpdatePlansDTO } from "../../../../modules/plans/dtos/IUpdatePlansDTO";
import AppError from "../../../errors/AppError";
import { database } from "../../../infra/database";
import { gerencianet } from "../index";

export const cratePlanInGerecianet = async (data: ICreatePlanDTO) => {
    const { name, recurrence, frequency } = data

    try {
        const result = await gerencianet.createPlan({}, { name, repeats: recurrence, interval: frequency })
        return result
    } catch (err) {
        console.log(err)
        throw new AppError({
            title: 'Error to create plan in Gerencianet',
            detail: 'Error to create plan in Gerencianet',
            statusCode: 404,
        });
    }
}

export const updatePlanInGerecianet = async (data: IUpdatePlansDTO) => {
    const { id, name } = data

    const plan = await database.plans.findUnique(({
        where: {
            id
        }
    }))

    if (!plan?.gateway_id) {
        throw new AppError({
            title: 'Plan not found',
            detail: 'Plan not found',
            statusCode: 404,
        });
    } 

    const gateway_id = plan?.gateway_id

    try {
        const result = await gerencianet.updatePlan({ id: Number.parseInt(`${gateway_id}`) }, { name })
        return result
    } catch (err) {
        console.log({ err })
        throw new AppError({
            title: 'Error to update plan in Gerencianet',
            detail: 'Error to update plan in Gerencianet',
            statusCode: 400,
        });
    }
}