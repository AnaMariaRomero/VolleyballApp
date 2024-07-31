import { Player } from "./player.model";
import { SetGame } from "./set-game.model";


export interface Match {
    id: string,
    team: string,
    date: string,
    players: Player[],
    set: SetGame[]
}


