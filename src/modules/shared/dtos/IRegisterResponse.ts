import { IClientResponseDTO } from "@/modules/clients/dtos/IClientResponseDTO";
import { IProviderResponseDTO } from "@/modules/providers/dtos/IProviderResponseDTO";
import { Role } from "@prisma/client"

export interface IRegisterResponse {
    user: {
        id: string;
        email: string;
        password: string;
        role: Role;
        createdAt?: Date;
        updatedAt?: Date;
        client?: IClientResponseDTO | null;
        provider?: IProviderResponseDTO | null;
    }
    token: string;
}
