import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EthersService } from 'src/app/services/ethersService/ethersService';
import { Router } from '@angular/router';
import { ethers } from 'ethers';
import { casino } from 'src/app/services/ethersService/contracts';
import { initializeGame } from 'src/app/reducers/actions';
import { Store } from '@ngrx/store';
import { selectGameId } from 'src/app/reducers/selectors';
import { Observable } from 'rxjs';
import { CasinoState } from 'src/app/reducers/reducers';
import { GeneralutilsService } from 'src/app/services/generalutils/generalutils.service';

@Component({
  selector: 'app-join-game-component',
  templateUrl: './join-game-component.component.html',
  styleUrls: ['./join-game-component.component.css'],
})
export class JoinGameComponentComponent implements OnInit {
  provider: any;
  casinoContract: any;
  signer: any;
  casinoMethodCaller: any;
  tokenMethodCaller: any;
  gameFound = false;
  foundGameEntryFee: string;
  foundGameEntryFeeConverted: string;
  foundGameGameId: string;
  tokenApproved: boolean;
  tokenContract: any;
  gameId$: Observable<string>;
  currentGameId: string;
  count = 0;

  constructor(
    private formBuilder: FormBuilder,
    private ethersService: EthersService,
    public router: Router,
    private store: Store<CasinoState>,
    private changeDetector: ChangeDetectorRef,
    private generalUtils: GeneralutilsService
  ) {}

  async ngOnInit(): Promise<void> {
    this.provider = this.ethersService.getProvider();
    await this.connectContracts();

    this.gameId$ = this.store.select(selectGameId);

    this.gameId$.subscribe((gameIdValue: string) => {
      this.currentGameId = gameIdValue;
      this.changeDetector.detectChanges();
    });
  }
  joinGameForm = this.formBuilder.group({
    gameId: this.formBuilder.control<string>('', Validators.required),
    entryFee: this.formBuilder.control<string>('', Validators.required),
  });

  async joinGame() {
    try {
      const joinGameTx = await this.casinoMethodCaller.joinGame(
        this.foundGameEntryFee,
        this.foundGameGameId
      );
      await joinGameTx.wait();

      this.initializeGameInStore(this.foundGameGameId);

      this.router.navigate(['/activegame']);
    } catch (err) {
      console.log('Join Game error', err);
      if (err.reason?.includes('Game is not active'))
        this.generalUtils.openSnackBar(
          'There is no active game for your provided Id'
        );
      if (err.reason.includes('Maximum players already joined'))
        this.generalUtils.openSnackBar('Sorry max players have already joined');
      if (err.reason.includes('Bet amount does not equal entry fee'))
        this.generalUtils.openSnackBar('Please provide the correct entry fee');
      else
        this.generalUtils.openSnackBar(
          'Transaction Failed without reason, try again or contact support'
        );
    }
  }

  findGameForm = this.formBuilder.group({
    gameId: this.formBuilder.control<string>('', Validators.required),
  });

  async findGame() {
    try {
      const findGameTx = await this.casinoMethodCaller.checkForActiveSession(
        this.findGameForm.value.gameId
      );

      if (!findGameTx.isActive) {
        this.generalUtils.openSnackBar(
          'Sorry this game is no longer active anymore or does not exist'
        );

        return;
      }

      if (this.isPlayerInGame(findGameTx.players)) {
        this.initializeGameInStore(this.findGameForm.value.gameId);
        this.router.navigate(['/activegame']);
        return;
      }

      this.foundGameEntryFee = findGameTx.entryFee;
      this.foundGameEntryFeeConverted = ethers.utils.formatUnits(
        this.foundGameEntryFee,
        18
      );
      this.foundGameGameId = ethers.utils.formatUnits(findGameTx.gameId, 0);

      const currentPlayerAllowance = await this.tokenMethodCaller.allowance(
        window.ethereum.selectedAddress,
        casino
      );

      if (currentPlayerAllowance >= this.foundGameEntryFee)
        this.tokenApproved = true;

      this.gameFound = true;
    } catch (err) {
      this.generalUtils.openSnackBar(
        'sorry we had some trouble finding your game, try again or contact support'
      );
    }
  }

  isPlayerInGame(foundGamePlayers: any) {
    const convertedPlayerAddresses = foundGamePlayers.map((player: string) =>
      player.toLowerCase()
    );

    if (convertedPlayerAddresses.includes(window.ethereum.selectedAddress)) {
      return true;
    }

    return false;
  }

  initializeGameInStore(gameId: string) {
    this.store.dispatch(initializeGame({ gameId: gameId }));
  }

  async approveSpend() {
    try {
      const approvalTx = await this.tokenMethodCaller.approve(
        casino,
        this.foundGameEntryFee
      );

      await approvalTx.wait();

      this.generalUtils.openSnackBar('Tokens Approved');

      this.tokenApproved = true;
    } catch (err) {
      this.generalUtils.openSnackBar(
        'There was an error please try again or contact support'
      );
    }
  }

  async connectContracts() {
    this.signer = await this.provider.getSigner();

    this.casinoContract = this.ethersService.getCasinoContract(this.provider);
    this.casinoMethodCaller = this.casinoContract.connect(this.signer);

    this.tokenContract = this.ethersService.getTokenContract(this.provider);
    this.tokenMethodCaller = this.tokenContract.connect(this.signer);
  }
}
