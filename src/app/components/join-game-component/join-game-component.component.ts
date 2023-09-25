import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, Validators } from '@angular/forms';
import { EthersService } from 'src/app/services/ethersService/ethersService';
import { Router } from '@angular/router';
import { ethers } from 'ethers';
import { casino } from 'src/app/services/ethersService/contracts';

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

  constructor(
    private formBuilder: FormBuilder,
    private ethersService: EthersService,
    public router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.provider = this.ethersService.getProvider();
    await this.connectContracts();
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
      const confirmedGameJoin = await joinGameTx.wait();

      console.log('join game success confirmation', confirmedGameJoin);

      this.router.navigate(['/activegame']);
    } catch (err) {
      console.log('Join Game error', err);
      if (err.reason?.includes('Game is not active')) {
        alert('There is no active game for your provided Id');
      } else if (err.reason.includes('Maximum players already joined')) {
        alert('Sorry max players have already joined');
      } else if (err.reason.includes('Bet amount does not equal entry fee')) {
        alert('Please provide the correct entry fee');
      } else {
        alert(
          'Transaction Failed without reason, try again or contact support'
        );
      }
    }
  }

  findGameForm = this.formBuilder.group({
    gameId: this.formBuilder.control<string>('', Validators.required),
  });

  async findGame() {
    console.log('game id in arg', this.findGameForm.value.gameId);
    try {
      const findGameTx = await this.casinoMethodCaller.checkForActiveSession(
        this.findGameForm.value.gameId
      );

      if (!findGameTx.isActive) {
        alert('Sorry this game is no longer active');

        return;
      }

      if (this.isPlayerInGame(findGameTx.players)) {
        this.router.navigate(['/activegame']);
        return;
      }

      this.foundGameEntryFee = findGameTx.entryFee;
      this.foundGameEntryFeeConverted = ethers.utils.formatUnits(
        this.foundGameEntryFee,
        18
      );
      this.foundGameGameId = ethers.utils.formatUnits(findGameTx.gameId, 0);
      this.gameFound = true;
    } catch (err) {
      alert(
        'sorry we had some trouble finding your game, try again or contact support'
      );
      console.log('find game error', err);
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

  async approveSpend() {
    try {
      const approvalTx = await this.tokenMethodCaller.approve(
        casino,
        this.foundGameEntryFee
      );

      await approvalTx.wait();

      alert('Tokens Approved');

      this.tokenApproved = true;
    } catch (err) {
      console.log('error', err);
      alert('There was an error please try again or contact support');
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
