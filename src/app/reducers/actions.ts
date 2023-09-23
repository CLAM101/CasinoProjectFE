// wallet.actions.ts

import { createAction } from '@ngrx/store';

export const connectWallet = createAction('[Wallet] Connect');
export const disconnectWallet = createAction('[Wallet] Disconnect');
