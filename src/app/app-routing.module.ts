import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CasinohomeComponent } from './components/casinohome/casinohome.component';

const routes: Routes = [
  { path: 'casinohome', component: CasinohomeComponent },
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
