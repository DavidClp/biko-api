import { emitService } from "../../emitService"

export const afterSaveTransaction = async (data: any) => {
    emitService(`${data?.provider_id}-wallet`, {})
  }