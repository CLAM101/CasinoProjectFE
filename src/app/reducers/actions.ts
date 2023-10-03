import { createAction, props } from '@ngrx/store';

export const initializeGame = createAction(
  '[Casino] Initialize Game',
  props<{ gameId: string }>()
);

export const gameStarted = createAction(
  '[Casino] Game Started',
  props<{ gameId: string; maxPlayers: string; entryFee: string }>()
);

export const playerJoined = createAction(
  '[Casino] Player Joined',
  props<{ gameId: string; playerAddress: string }>()
);

export const requestFulfilled = createAction(
  '[Casino] Request Fulfilled',
  props<{ requestId: string; randomWords: string[]; gameId: string }>()
);

export const gameEnded = createAction(
  '[Casino] Game Ended',
  props<{ gameId: string; winnerAddress: string }>()
);
