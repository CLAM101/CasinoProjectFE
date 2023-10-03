import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, take } from 'rxjs';
import { CasinoEvent } from 'types/general';
import { EthersService } from '../ethersService/ethersService';
import { ethers } from 'ethers';
import { map, mergeMap, tap } from 'rxjs/operators';
import { selectGameId } from 'src/app/reducers/selectors';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  gameStarted,
  playerJoined,
  requestFulfilled,
  gameEnded,
} from 'src/app/reducers/actions';
@Injectable({
  providedIn: 'root',
})
export class ActivegameserviceService {
  private eventSubject: Subject<CasinoEvent> = new Subject<CasinoEvent>();

  constructor(private ethersService: EthersService, private store: Store) {}

  gameId$;
  currentGameId: string;

  public listenForCasinoContractEvents() {
    this.gameId$ = this.store.select(selectGameId);
    this.gameId$.subscribe((gameIdValue) => {
      this.currentGameId = gameIdValue;
    });

    let provider = this.ethersService.getProvider();

    let contract = this.ethersService.getCasinoContract(provider);

    contract.on(
      'GameStarted(uint256 gameId, uint256 maxPlayers, uint256 entryfee)',
      (gameId, maxPlayers, entryFee) => {
        const args = {
          gameId: ethers.utils.formatUnits(gameId, 0),
          maxPlayers: ethers.utils.formatUnits(maxPlayers, 0),
          entryFee: ethers.utils.formatUnits(entryFee, 18),
        };

        if (args.gameId == this.currentGameId) {
          this.store.dispatch(gameStarted(args));
        }
      }
    );

    contract.on(
      'PlayerJoined(uint gameId, address player)',
      (gameId, playerAddress) => {
        const args = {
          gameId: ethers.utils.formatUnits(gameId, 0),
          playerAddress,
        };

        if (args.gameId == this.currentGameId) {
          this.store.dispatch(playerJoined(args));
        }
      }
    );

    contract.on(
      'RequestSent(uint256 requestId, uint32 numwords, uint256 gameId)',
      (requestId, numwords, gameId) => {}
    );

    contract.on(
      'RequestFulfilled(uint256 requestId, uint256[] randomWords, uint256 gameId)',
      (requestId, randomWords, gameId) => {}
    );

    contract.on(
      'GameEnded(uint gameId, address winner)',
      (gameId, winnerAddress) => {
        const args = {
          gameId: ethers.utils.formatUnits(gameId, 0),
          winnerAddress,
        };
        if (args.gameId == this.currentGameId) {
          this.store.dispatch(gameEnded(args));
        }
      }
    );
  }
}
