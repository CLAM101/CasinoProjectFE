import { Component, OnInit } from '@angular/core';
import { EthersService } from 'src/app/services/ethersService/ethersService';
import { ethers } from 'ethers';
import { Router } from '@angular/router';

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

  constructor(private ethersService: EthersService, public router: Router) {}
  async ngOnInit(): Promise<void> {
    this.provider = this.ethersService.getProvider();
    if (window.ethereum.selectedAddress && window.ethereum.isConnected()) {
      await this.connectContracts();
      const supply = await this.tokenMethodCaller.getCurrentSupply();
      const convertedSupply = ethers.utils.formatUnits(supply, 18);

      console.log('supply', convertedSupply);
    } else {
      alert('please connect wallet');
    }
  }

  async connectContracts() {
    this.tokenContract = this.ethersService.getTokenContract(this.provider);
    this.signer = await this.provider.getSigner();
    this.tokenMethodCaller = this.tokenContract.connect(this.signer);
  }

  async claimAllocation() {
    if (window.ethereum.selectedAddress) {
      try {
        let tx = await this.tokenMethodCaller.claimAllocation();

        let confirmation = await tx.wait();
        console.log('Confirmation', confirmation);
        alert('Claim Successful, go join a game!');
      } catch (err) {
        if (err.reason?.includes('Already Claimed')) {
          alert(
            'Sorry looks like you have already claimed you greedy bastard!!!'
          );
        } else {
          alert(
            'your transactions has failed please try again or contact us for support'
          );
        }
      }
    } else {
      alert('Please connect wallet');
    }
  }

  async connectWallet() {
    this.ethersService.connectWallet();
  }
}
