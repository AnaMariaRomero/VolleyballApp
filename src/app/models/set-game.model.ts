import { Player } from "./player.model";

export interface SetGame {
    id: string,
    number: string,
    matchId: string,
    players: Player[],
    points: string
}