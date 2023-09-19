import { Component, OnInit } from '@angular/core';
import { EthersService } from 'src/app/services/ethersService/ethersService';
import { ethers } from 'ethers';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  provider: any;
  tokenMethodCaller: any;
  tokenContract: any;
  signer: any;
  accounts: Array<string>;
  walletConnected: boolean;

  constructor(private ethersService: EthersService) {}
  async ngOnInit(): Promise<void> {
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

  async connectContracts() {
    this.tokenContract = this.ethersService.getTokenContract(this.provider);
    this.signer = await this.provider.getSigner();
    this.tokenMethodCaller = this.tokenContract.connect(this.signer);
  }

  async claimAllocation() {
    if (await this.checkConnection()) {
      try {
        let tx = await this.tokenMethodCaller.claimAllocation();
        let confirmation = await tx.wait();

        console.log('tx confirmed', confirmation);
      } catch (err) {
        if (err.reason.includes('Already Claimed')) {
          alert('Sorry looks like youve already claimed you greedy bastard!!!');
        }
      }
    }
  }

  async connectWallet() {
    const walletConenctResponse = await this.provider.send(
      'eth_requestAccounts',
      []
    );

    if (walletConenctResponse.length) {
      this.walletConnected = true;
    }
  }
}
