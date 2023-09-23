import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gamestartedmodal',
  templateUrl: './gamestartedmodal.component.html',
  styleUrls: ['./gamestartedmodal.component.css'],
})
export class GamestartedmodalComponent implements OnInit {
  @Input() gameId: string;
  @Input() maxPlayers: string;

  ngOnInit(): void {}

  goToGame() {}

  constructor() {}
}
