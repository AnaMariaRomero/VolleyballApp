import { Player } from "./player.model";

export interface SetGame {
    id: string,
    number: number,
    matchId: string,
    players: Player[],
    pointsFavor: number,
    pointsAgainst: number,
    setFinish: boolean
}