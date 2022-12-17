export enum BookCategoryEnum {
    DOK = 'DOK',
    MYTH = 'MYTH'
}
export interface BookModel {
    id?: number;
    title?: string;
    year?: number;
    category: BookCategoryEnum;
}