import { createReducer, on, Action } from '@ngrx/store';
import * as CasinoActions from './actions';

export interface CasinoState {
  gameId: string | null;
  maxPlayers: string | null;
  entryFee: string | null;
  playerAddress: string | null;
  requestId: string | null;
  randomWords: string[] | null;
  winnerAddress: string | null;
  choosingWinner: boolean;
}

export const initialState: CasinoState = {
  gameId: null,
  maxPlayers: null,
  entryFee: null,
  playerAddress: null,
  requestId: null,
  randomWords: null,
  winnerAddress: null,
  choosingWinner: false,
};

const reducer = createReducer(
  initialState,
  on(CasinoActions.initializeGame, (state, { gameId }) => ({
    ...state,
    gameId,
  })),
  on(CasinoActions.gameStarted, (state, { gameId, maxPlayers, entryFee }) => {
    return {
      ...state,
      gameId,
      maxPlayers,
      entryFee,
    };
  }),
  on(CasinoActions.playerJoined, (state, { gameId, playerAddress }) => ({
    ...state,
    gameId,
    playerAddress,
  })),
  on(
    CasinoActions.requestFulfilled,
    (state, { requestId, randomWords, gameId }) => ({
      ...state,
      requestId,
      randomWords,
      gameId,
    })
  ),
  on(CasinoActions.gameEnded, (state, { gameId, winnerAddress }) => ({
    ...state,
    gameId,
    winnerAddress,
    choosingWinner: false,
  })),

  on(CasinoActions.requestSent, (state, { requestId, numWords, gameId }) => ({
    ...state,
    choosingWinner: true,
  }))
);

export function reducers(state: CasinoState | undefined, action: Action) {
  return reducer(state, action);
}
