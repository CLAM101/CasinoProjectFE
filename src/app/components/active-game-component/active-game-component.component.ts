import { Component, OnInit } from '@angular/core';
import { EthersService } from 'src/app/services/ethersService/ethersService';
import { Observable, Subscription } from 'rxjs';
import { CasinoEvent, ActiveGameData } from 'types/general';
import { ActivegameserviceService } from 'src/app/services/activegameservice/activegameservice.service';
import {
  selectGameId,
  selectMaxPlayers,
  selectEntryFee,
  selectPlayerAddress,
  selectRequestId,
  selectWinnerAddress,
} from 'src/app/reducers/selectors';
import { Store } from '@ngrx/store';
import { CasinoState } from 'src/app/reducers/reducers';
import { ethers } from 'ethers';
import { Router } from '@angular/router';

@Component({
  selector: 'app-active-game-component',
  templateUrl: './active-game-component.component.html',
  styleUrls: ['./active-game-component.component.css'],
})
export class ActiveGameComponentComponent implements OnInit {
  eventSubscription: Subscription;
  eventData: CasinoEvent;
  provider: any;
  activeGameData: ActiveGameData;
  currentGameId: string;

  casinoContract: any;
  casinoMethodCaller: any;
  signer: any;
  latestJoinedPlayer: string;
  currentEntryFee: string;
  currentMaxPlayers: string;
  currentRequestId: string;
  currentWinnerAddress: string;
  currentPlayers: Array<string>;
  currentGameStatus: boolean;
  currentPot: string;
  gameId$: Observable<string>;
  maxPlayers$: Observable<string>;
  entryFee$: Observable<string>;
  playerAddress$: Observable<string>;
  requestId$: Observable<string>;
  winnerAddress$: Observable<string>;
  private subscriptions: Subscription[] = [];

  constructor(
    private ethersService: EthersService,
    private activeGameService: ActivegameserviceService,
    private store: Store<CasinoState>,
    private router: Router
  ) {}

  async ngOnInit() {
    this.provider = this.ethersService.getProvider();
    this.signer = await this.createContracts();
    this.activeGameService.listenForCasinoContractEvents();
    this.initializeActiveGameState();

    if (!this.currentGameId) {
      this.router.navigate(['/joingame']);
    }
    await this.getGameData();
  }

  async initializeActiveGameState() {
    this.gameId$ = this.store.select(selectGameId);
    this.maxPlayers$ = this.store.select(selectMaxPlayers);
    this.entryFee$ = this.store.select(selectEntryFee);
    this.playerAddress$ = this.store.select(selectPlayerAddress);
    this.requestId$ = this.store.select(selectRequestId);
    this.winnerAddress$ = this.store.select(selectWinnerAddress);
    this.subscriptions.push(
      this.gameId$.subscribe((gameIdValue: string) => {
        if (!gameIdValue) return;
        this.currentGameId = gameIdValue;
      })
    );
    this.subscriptions.push(
      this.maxPlayers$.subscribe((maxPlayersValue: string) => {
        if (!maxPlayersValue) return;
        this.currentMaxPlayers = maxPlayersValue;
      })
    );
    this.subscriptions.push(
      this.entryFee$.subscribe((entryFeeValue: string) => {
        if (!entryFeeValue) return;
        this.currentEntryFee = entryFeeValue;
      })
    );
    this.subscriptions.push(
      this.playerAddress$.subscribe(async (playerAddressValue: string) => {
        this.latestJoinedPlayer = playerAddressValue;
        if (!playerAddressValue) return;

        alert('Player Joined' + this.latestJoinedPlayer);
        await this.getGameData();
      })
    );

    this.subscriptions.push(
      this.winnerAddress$.subscribe(async (winnerAddressValue: string) => {
        if (!winnerAddressValue) return;
        this.currentWinnerAddress = winnerAddressValue;

        await this.getGameData();
      })
    );
  }

  async createContracts() {
    this.signer = await this.provider.getSigner();
    this.casinoContract = this.ethersService.getCasinoContract(this.provider);
    this.casinoMethodCaller = this.casinoContract.connect(this.signer);
  }

  async getGameData() {
    this.activeGameData = await this.casinoMethodCaller.checkForActiveSession(
      this.currentGameId
    );

    this.currentMaxPlayers = ethers.utils.formatUnits(
      this.activeGameData.maxPlayers,
      0
    );

    this.currentGameId = ethers.utils.formatUnits(
      this.activeGameData.gameId,
      0
    );
    this.currentEntryFee = ethers.utils.formatUnits(
      this.activeGameData.entryFee,
      18
    );

    this.currentPot = ethers.utils.formatUnits(
      this.activeGameData.currentPot,
      18
    );

    this.currentPlayers = this.activeGameData.players;

    this.currentGameStatus = this.activeGameData.isActive;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
