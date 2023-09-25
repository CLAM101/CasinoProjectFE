import { Attribute, Injectable } from '@angular/core';
import { ethers, BigNumber } from 'ethers';
import { casinoAbi, tokenAbi } from './allAbi';
import { casino, token } from './contracts';
import { Provider } from '@ethersproject/providers';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { connectWallet, disconnectWallet } from 'src/app/reducers/actions';
import { leftPad } from 'web3-utils';
interface CasinoEvent {
  gameId: BigNumber; // Adjust the type as needed
  player: string; // Address of the player
  // Add other event parameters here
}
@Injectable({
  providedIn: 'root',
})
export class EthersService {
  private eventSubject: Subject<Event> = new Subject<Event>();

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

  private listenForCasinoContractEvents() {
    let provider = this.getProvider();

    let contract = this.getCasinoContract(provider);

    contract.on(
      'GameStarted(uint256 gameId, uint256 maxPlayers, uint256 entryfee)',
      (gameId, maxPlayers, entryFee) => {
        let convertedGameId = ethers.utils.formatUnits(gameId, 0);
        let convertedMaxPlayers = ethers.utils.formatUnits(maxPlayers, 0);
        let convertedEntryFee = ethers.utils.formatUnits(entryFee, 18);
        console.log('converted event', convertedGameId);
        console.log('other log', convertedMaxPlayers);
        console.log('other log', convertedEntryFee);
      }
    );

    contract.on(
      'PlayerJoined(uint gameId, address player)',
      (gameId, address) => {
        let convertedGameId = ethers.utils.formatUnits(gameId, 0);
        console.log('converted event', convertedGameId);
        console.log('other log', address);
      }
    );
  }

  handleEvents(eventArgs: any) {
    console.log('event fired', eventArgs);

    if (eventArgs.event === 'event PlayerJoined(uint gameId, address player)') {
      this.eventSubject.next(eventArgs);
      // Handle EventA data here
    } else if (
      eventArgs.event === 'event GameEnded(uint gameId, address winner)'
    ) {
      this.eventSubject.next(eventArgs);
      // Handle EventB data here
    }
  }

  getContractEventObservable(): Observable<Event> {
    this.listenForCasinoContractEvents();
    return this.eventSubject.asObservable();
  }
}
