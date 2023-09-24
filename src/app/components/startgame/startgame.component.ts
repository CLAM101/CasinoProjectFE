import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { GamestartedmodalComponent } from '../gamestartedmodal/gamestartedmodal.component';
import { EthersService } from 'src/app/services/ethersService/ethersService';
import { Router } from '@angular/router';
import { ethers } from 'ethers';
import { Form, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-startgame',
  templateUrl: './startgame.component.html',
  styleUrls: ['./startgame.component.css'],
})
export class StartgameComponent implements OnInit {
  @ViewChild(GamestartedmodalComponent)
  gameStartedModal: GamestartedmodalComponent;

  confirmedGameGameId: string;
  confirmedGameMaxPlayers: string;
  confirmedGameEntryFee: string;
  showModal = false;
  provider: any;
  casinoContract: any;

  signer: any;
  casinoMethodCaller: any;

  constructor(
    private formBuilder: FormBuilder,
    private ethersService: EthersService,
    public router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.provider = this.ethersService.getProvider();
    await this.connectContracts();
  }

  startGameForm = this.formBuilder.group({
    maxPlayers: this.formBuilder.control<string>('', Validators.required),
    entryFee: this.formBuilder.control<string>('', Validators.required),
  });

  async connectContracts() {
    this.casinoContract = this.ethersService.getCasinoContract(this.provider);
    this.signer = await this.provider.getSigner();
    this.casinoMethodCaller = this.casinoContract.connect(this.signer);
  }

  closeModal(event: boolean) {
    this.showModal = event;
  }

  async startGame() {
    try {
      const startGameTx = await this.casinoMethodCaller.startGame(
        this.startGameForm.value.maxPlayers,
        this.startGameForm.value.entryFee
      );

      const gameStartedConfirmation = await startGameTx.wait();

      this.confirmedGameGameId = ethers.utils.formatUnits(
        gameStartedConfirmation.events[0].args.gameId,
        0
      );
      this.confirmedGameMaxPlayers = ethers.utils.formatUnits(
        gameStartedConfirmation.events[0].args.maxPlayers,
        0
      );

      this.confirmedGameEntryFee = ethers.utils.formatUnits(
        gameStartedConfirmation.events[0].args.entryfee,
        0
      );

      this.showModal = true;
    } catch (err) {
      alert('transaction Failed please try again or contact support');
    }
  }
}
