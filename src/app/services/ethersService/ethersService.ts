import { Attribute, Injectable } from '@angular/core';
import { ethers, BigNumber } from 'ethers';
import { casinoAbi, tokenAbi } from './allAbi';
import { casino, token } from './contracts';
import { Provider } from '@ethersproject/providers';
import { Observable, Subject } from 'rxjs';
import { CasinoEvent } from 'types/general';
import { GeneralutilsService } from '../generalutils/generalutils.service';

@Injectable({
  providedIn: 'root',
})
export class EthersService {
  constructor(private generalUtils: GeneralutilsService) {}

  getProvider(): Provider {
    return new ethers.providers.Web3Provider(window.ethereum);
  }

  getCasinoContract(provider: any) {
    return new ethers.Contract(casino, casinoAbi, provider);
  }

  getTokenContract(provider: any) {
    return new ethers.Contract(token, tokenAbi, provider);
  }

  async connectWallet() {
    let provider: any = this.getProvider();
    try {
      await provider.send('eth_requestAccounts', []);
    } catch (err) {
      this.generalUtils.openSnackBar('Please connect wallet');
    }
  }
}
