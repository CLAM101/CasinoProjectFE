import { Component, HostListener, OnInit } from '@angular/core';

import { ChildActivationStart, OnSameUrlNavigation } from '@angular/router';
import { EthersService } from 'src/app/services/ethersService/ethersService';
import { ethers } from 'ethers';

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

  constructor(private ethersService: EthersService) {}

  async ngOnInit() {
    this.provider = this.ethersService.getProvider();
    if (await this.checkConnection()) {
      await this.connectContracts();
      const supply = await this.tokenMethodCaller.getCurrentSupply();
      const convertedSupply = ethers.utils.formatUnits(supply, 18);

      console.log('supply', convertedSupply);
    } else {
      alert('please connect wallet');
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
      const conenctResponse = await this.provider.send(
        'eth_requestAccounts',
        []
      );

      this.walletConnected = true;

      return conenctResponse;
    } catch (err) {
      alert('Pleae connect Wallet');
      this.walletConnected = false;
      return undefined;
    }
  }

  async connectWallet() {
    debugger;
    const walletConenctResponse = await this.provider.send(
      'eth_requestAccounts',
      []
    );

    if (walletConenctResponse.length) {
      this.walletConnected = true;
    }
  }
}
