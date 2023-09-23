import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer, createReducer, on } from '@ngrx/store';
import { connectWallet, disconnectWallet } from './actions';

export interface WalletState {
  isConnected: boolean;
}

export const initialWalletState: WalletState = {
  isConnected: false,
};

export const walletReducer = createReducer(
  initialWalletState,
  on(connectWallet, (state) => ({ ...state, isConnected: true })),
  on(disconnectWallet, (state) => ({ ...state, isConnected: false }))
);
