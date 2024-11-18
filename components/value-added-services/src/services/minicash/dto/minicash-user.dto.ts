import { MinicashUser } from "../types/minicash-user.type"

export class GetMinicashUserResponseDTO {
    Message: string
    Status: boolean
    Data: MinicashUser
}