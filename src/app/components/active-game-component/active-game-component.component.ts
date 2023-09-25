import { Component, OnInit } from '@angular/core';
import { EthersService } from 'src/app/services/ethersService/ethersService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-active-game-component',
  templateUrl: './active-game-component.component.html',
  styleUrls: ['./active-game-component.component.css'],
})
export class ActiveGameComponentComponent implements OnInit {
  eventSubscription: Subscription;
  eventData: Event;

  constructor(private ethersService: EthersService) {}

  ngOnInit() {
    // Subscribe to the contract event observable
    this.eventSubscription = this.ethersService
      .getContractEventObservable()
      .subscribe((eventData) => {
        console.log('event data', eventData);

        this.eventData = eventData;
      });
  }

  ngOnDestroy() {
    // Clean up the subscription when the component is destroyed
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }
}
