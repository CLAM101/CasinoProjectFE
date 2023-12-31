import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CasinohomeComponent } from './components/casinohome/casinohome.component';
import { StartgameComponent } from './components/startgame/startgame.component';
import { JoinGameComponentComponent } from './components/join-game-component/join-game-component.component';
import { ActiveGameComponentComponent } from './components/active-game-component/active-game-component.component';

const routes: Routes = [
  { path: 'casinohome', component: CasinohomeComponent },
  { path: 'startgame', component: StartgameComponent },
  { path: 'joingame', component: JoinGameComponentComponent },
  { path: 'activegame', component: ActiveGameComponentComponent },
  {
    path: '',
    redirectTo: 'casinohome',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
