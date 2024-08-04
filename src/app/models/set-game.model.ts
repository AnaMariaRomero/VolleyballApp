import { Player } from "./player.model";

export interface SetGame {
    id: string,
    number: number,
    matchId: string,
    players: Player[],
    points: number
}