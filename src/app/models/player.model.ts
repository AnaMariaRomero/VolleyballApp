import { Category } from "./category.model";
import { Statistics } from "./statistics.model";

export interface Player {
    id: string,
    numberPlayer: number,
    name: string,
    categories: Category[],
    staticsPlayer: Statistics[]
}