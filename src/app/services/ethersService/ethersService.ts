import { Attribute, Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { casinoAbi, tokenAbi } from './allAbi';
import { casino, token } from './contracts';
import { Provider } from '@ethersproject/providers';
import { Store } from '@ngrx/store';
import { connectWallet, disconnectWallet } from 'src/app/reducers/actions';

@Injectable({
  providedIn: 'root',
})
export class EthersService {
  constructor(private store: Store) {}

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
      alert('Failed To Connect Wallet');
    }
  }
}
