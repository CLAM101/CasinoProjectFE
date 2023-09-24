import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-gamestartedmodal',
  templateUrl: './gamestartedmodal.component.html',
  styleUrls: ['./gamestartedmodal.component.css'],
})
export class GamestartedmodalComponent implements OnInit {
  @Input() gameId: string;
  @Input() maxPlayers: string;
  @Input() showModal: boolean;

  @Output() closeEvent = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  goToGame() {}

  closeModal() {
    this.closeEvent.emit(false);
  }
}
