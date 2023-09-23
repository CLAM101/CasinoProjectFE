// wallet.selectors.ts

import { createSelector, createFeatureSelector } from '@ngrx/store';
import { WalletState } from './index';

export const selectWalletState = createFeatureSelector<WalletState>('wallet');

export const selectIsConnected = createSelector(
  selectWalletState,
  (state) => state.isConnected
);
