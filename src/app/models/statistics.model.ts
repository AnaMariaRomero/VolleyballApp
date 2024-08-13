//staticsList es un array de largo 6: cada elemento corresponde a: Saque, Recepcion, Defensa, Aramdo, Bloqueo, Ataque
export interface Statistics {
    playerId: string,
    setId: string,
    statisticsPositiveList: number[],
    statisticsNegativeList: number[],
}