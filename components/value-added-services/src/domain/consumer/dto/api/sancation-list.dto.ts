import { IsEnum, IsOptional, IsString } from "class-validator";
import { SanctionType } from "../../types/sanction-list.types";

export class NotifySanctionListDto {
    @IsString()
    originalName: string;

    @IsOptional()
    @IsString()
    nationalId?: string;

    @IsEnum(SanctionType)
    sanctionType: SanctionType;
}