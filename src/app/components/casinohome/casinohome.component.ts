import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EthersService } from 'src/app/services/ethersService/ethersService';
import { ethers } from 'ethers';
import { GeneralutilsService } from 'src/app/services/generalutils/generalutils.service';

declare global {
  interface Window {
    ethereum: any;
  }
}
@Component({
  selector: 'app-casinohome',
  templateUrl: './casinohome.component.html',
  styleUrls: ['./casinohome.component.scss'],
})
export class CasinohomeComponent implements OnInit {
  provider: any;
  tokenMethodCaller: any;
  casinoMethodCaller: any;
  casinoContract: any;
  tokenContract: any;
  signer: any;
  wallet: any;
  accounts: Array<string>;
  walletConnected: boolean;

  constructor(
    private ethersService: EthersService,
    private generalUtils: GeneralutilsService
  ) {}

  async ngOnInit() {
    this.provider = this.ethersService.getProvider();
    if (await this.checkConnection()) {
      await this.connectContracts();
    } else {
      this.generalUtils.openSnackBar('Please connect wallet');
    }
  }

  async connectContracts() {
    this.casinoContract = this.ethersService.getCasinoContract(this.provider);
    this.tokenContract = this.ethersService.getTokenContract(this.provider);
    this.signer = await this.provider.getSigner();
    this.tokenMethodCaller = this.tokenContract.connect(this.signer);
    this.casinoMethodCaller = this.casinoContract.connect(this.signer);
  }

  async claimAllocation() {
    if (await this.checkConnection()) {
      let tx = await this.tokenMethodCaller.claimAllocation();
    }
  }

  async checkConnection() {
    try {
      const connectResponse = await this.provider.send(
        'eth_requestAccounts',
        []
      );

      this.walletConnected = true;

      return connectResponse;
    } catch (err) {
      this.generalUtils.openSnackBar('Please connect wallet');
      this.walletConnected = false;
      return undefined;
    }
  }

  async connectWallet() {
    const walletConnectResponse = await this.provider.send(
      'eth_requestAccounts',
      []
    );

    if (walletConnectResponse.length) {
      this.walletConnected = true;
    }
  }
}
