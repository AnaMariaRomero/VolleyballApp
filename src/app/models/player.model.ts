import { Category } from "./category.model";

export interface Player {
    id: string,
    name: string,
    imagen: string,
    categories: Category[]
}