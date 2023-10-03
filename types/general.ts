export interface CasinoEvent {
  gameId: string;
  playerAddress?: string;
  winnerAddress?: string;
  maxPlayers?: string;
  entryFee?: string;
}

export interface ActiveGameData {
  gameId: string;
  playerAddress?: string;
  winnerAddress?: string;
  maxPlayers?: string;
  entryFee?: string;
  eventType: string;
  currentPot: string;
  isActive: boolean;
  players: Array<string>;
}
