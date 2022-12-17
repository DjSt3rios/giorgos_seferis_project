export enum LinkCategoryEnum {
    GENERAL = 'GENERAL',
    ERT = 'ERT',
}
export interface LinkModel {
    id?: number;
    link?: string;
    additionalInfo?: string;
    category?: LinkCategoryEnum;
}