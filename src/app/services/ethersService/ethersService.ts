import { Attribute, Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { casinoAbi, tokenAbi } from './allAbi';
import { casino, token } from './contracts';
import { Provider } from '@ethersproject/providers';

@Injectable({
  providedIn: 'root',
})
export class EthersService {
  constructor() {}

  getProvider(): Provider {
    return new ethers.providers.Web3Provider(window.ethereum);
  }

  getCasinoContract(provider: any) {
    return new ethers.Contract(casino, casinoAbi, provider);
  }

  getTokenContract(provider: any) {
    return new ethers.Contract(token, tokenAbi, provider);
  }
}
