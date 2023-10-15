import { Component, OnInit } from '@angular/core';
import { EthersService } from 'src/app/services/ethersService/ethersService';
import { Router } from '@angular/router';
import { GeneralutilsService } from 'src/app/services/generalutils/generalutils.service';

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

  constructor(
    private ethersService: EthersService,
    public router: Router,
    private generalUtils: GeneralutilsService
  ) {}
  async ngOnInit(): Promise<void> {
    this.provider = this.ethersService.getProvider();
    this.onNetworkChanged();
    if (window.ethereum.selectedAddress && window.ethereum.isConnected()) {
      await this.connectContracts();
    } else {
      this.generalUtils.openSnackBar('Please connect wallet');
    }
  }

  async connectContracts() {
    this.tokenContract = this.ethersService.getTokenContract(this.provider);
    this.signer = await this.provider.getSigner();
    this.tokenMethodCaller = this.tokenContract.connect(this.signer);
  }

  //capture the event emitted when suer changes network and log which network user changed to
  async onNetworkChanged() {
    window.ethereum.on('chainChanged', (chainId) => {
      chainId = parseInt(chainId, 16);

      if (chainId !== 1337) {
        this.generalUtils.openSnackBar('Please change to the correct network');
        this.changeNetwork();
      }
    });
  }

  //promt user to change networks if they are not on the correct network
  async changeNetwork() {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x539' }],
    });
  }

  async claimAllocation() {
    if (window.ethereum.selectedAddress) {
      try {
        const tx = await this.tokenMethodCaller.claimAllocation();

        await tx.wait();

        this.generalUtils.openSnackBar('Claim Successful, go join a game!');
      } catch (err) {
        if (err.reason?.includes('Already Claimed')) {
          this.generalUtils.openSnackBar(
            'Sorry you have already claimed you greedy bastard!!!'
          );
        } else {
          this.generalUtils.openSnackBar(
            'your transactions has failed please try again or contact us for support'
          );
        }
      }
    } else {
      this.generalUtils.openSnackBar('Please connect wallet');
    }
  }

  async connectWallet() {
    this.ethersService.connectWallet();
  }
}
