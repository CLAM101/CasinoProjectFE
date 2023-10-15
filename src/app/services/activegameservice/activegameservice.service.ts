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
  requestSent,
} from 'src/app/reducers/actions';
import { GeneralutilsService } from '../generalutils/generalutils.service';
@Injectable({
  providedIn: 'root',
})
export class ActivegameserviceService {
  private eventSubject: Subject<CasinoEvent> = new Subject<CasinoEvent>();

  constructor(
    private ethersService: EthersService,
    private store: Store,
    private generalUtils: GeneralutilsService
  ) {}

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
      (requestId, numwords, gameId) => {
        if (ethers.utils.formatUnits(gameId, 0) == this.currentGameId) {
          this.generalUtils.openSnackBar(
            'Max Players Reached, A winner is being chosen'
          );

          const convertedNumwords = ethers.utils.formatUnits(numwords, 0);
          const convertedRequestId = ethers.utils.formatUnits(requestId, 0);

          const args = {
            gameId: ethers.utils.formatUnits(gameId, 0),
            numWords: convertedNumwords,
            requestId: convertedRequestId,
          };

          this.store.dispatch(requestSent(args));
        }
      }
    );

    contract.on(
      'RequestFulfilled(uint256 requestId, uint256[] randomWords, uint256 gameId)',
      (requestId, randomWords, gameId) => {
        const convertedRandomWords = randomWords.map((word) => {
          return ethers.utils.formatUnits(word, 0);
        });

        const convertedRequestId = ethers.utils.formatUnits(requestId, 0);

        const args = {
          gameId: ethers.utils.formatUnits(gameId, 0),
          randomWords: convertedRandomWords,
          requestId: convertedRequestId,
        };

        this.store.dispatch(requestFulfilled(args));
      }
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
