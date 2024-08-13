import { Category } from "./category.model";
import { Position } from "./position.model";
import { Statistics } from "./statistics.model";

export interface Player {
    id: string,
    image: string,
    numberPlayer: number,
    name: string,
    categories: Category[],
    positions: Position[],
    staticsPlayer: Statistics[],
    
}