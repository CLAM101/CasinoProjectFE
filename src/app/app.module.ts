import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CasinohomeComponent } from './components/casinohome/casinohome.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { StartgameComponent } from './components/startgame/startgame.component';
import { MatMenuModule } from '@angular/material/menu';
import { GamestartedmodalComponent } from './components/gamestartedmodal/gamestartedmodal.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers/reducers';
import { ActiveGameComponentComponent } from './components/active-game-component/active-game-component.component';
import { JoinGameComponentComponent } from './components/join-game-component/join-game-component.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

@NgModule({
  declarations: [
    AppComponent,
    CasinohomeComponent,
    HeaderComponent,
    StartgameComponent,
    GamestartedmodalComponent,
    ActiveGameComponentComponent,
    JoinGameComponentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ casinoState: reducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: true, // Restrict extension to log-only mode
      trace: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
