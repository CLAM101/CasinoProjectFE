import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CasinoState } from './reducers';

export const casinoState = createFeatureSelector<CasinoState>('casinoState');

// Select the gameId from state
export const selectGameId = createSelector(
  casinoState,
  (state: CasinoState) => state.gameId
);

// Select the maxPlayers from state
export const selectMaxPlayers = createSelector(
  casinoState,
  (state: CasinoState) => state.maxPlayers
);

// Select the entryFee from state
export const selectEntryFee = createSelector(
  casinoState,
  (state: CasinoState) => state.entryFee
);

// Select the playerAddress from state
export const selectPlayerAddress = createSelector(
  casinoState,
  (state: CasinoState) => state.playerAddress
);

// Select the requestId from state
export const selectRequestId = createSelector(
  casinoState,
  (state: CasinoState) => state.requestId
);

// Select the randomWords from state
export const selectRandomWords = createSelector(
  casinoState,
  (state: CasinoState) => state.randomWords
);

// Select the winnerAddress from state
export const selectWinnerAddress = createSelector(
  casinoState,
  (state: CasinoState) => state.winnerAddress
);

// Select the choosingWinner from state
export const selectChoosingWinner = createSelector(
  casinoState,
  (state: CasinoState) => state.choosingWinner
);
