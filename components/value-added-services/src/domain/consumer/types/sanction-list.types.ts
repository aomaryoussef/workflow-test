
export enum SanctionType {
    SanctionsList = "SANCTION_LIST",
    TerroristsList = "TERRORIST_LIST",
}
export const SanctionTypeArabicText = {
    [SanctionType.SanctionsList]: "مكافحة غسيل الأموال",
    [SanctionType.TerroristsList]: "مكافحة الإرهاب"
}