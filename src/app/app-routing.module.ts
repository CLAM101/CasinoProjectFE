import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CasinohomeComponent } from './components/casinohome/casinohome.component';
import { StartgameComponent } from './components/startgame/startgame.component';

const routes: Routes = [
  { path: 'casinohome', component: CasinohomeComponent },
  { path: 'startgame', component: StartgameComponent },
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
