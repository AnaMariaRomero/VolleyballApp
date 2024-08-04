import { SetGame } from "./set-game.model";


export interface Match {
    id: string,
    team: string,
    date: string,
    playersId: string[],
    sets: SetGame[]
}


