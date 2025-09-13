import { io } from "../infra/http/express/app"

export const emitService = (event: string, data: any) => {
    io.emit(event, data)
}