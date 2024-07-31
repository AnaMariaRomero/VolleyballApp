export interface Statistics {
    id: string,
    playerId: string,
    setId: string,
    serve: number[],
    block: number[],
    set: number[],
    reception: number[],
    defense: number[]
}