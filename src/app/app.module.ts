import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header/header.component';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';

import { StoreModule } from '@ngrx/store';
import * as fromApp from '../app/store/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffect } from './effects/auth.effects';

import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {StoreRouterConnectingModule} from '@ngrx/router-store';
import { environment } from 'src/environments/environment';
import { RecipeEffects } from './effects/recipe.effects';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    //RecipesModule, ovako importujemo eager, dakle odmah po pokretanju app a tamo smo podesili da je lazy loading
    //ShoppingListModule, 
    StoreModule.forRoot(fromApp.appReducer), //property name je na nama da dodelimo ali je bitan reducer da se odabere koji postoji i ovim smo u stvari dali opis strukture samog STORE objekta, kako on moze imati vise celine/delova i svaki se definise svojim nazivom i odgovarajucim reducer-om
    EffectsModule.forRoot([AuthEffect, RecipeEffects]),
    StoreDevtoolsModule.instrument({logOnly: environment.production}), //stavili smo da nam loguje akcije samo kada smo u produkciji
    StoreRouterConnectingModule.forRoot(),
    SharedModule,
    CoreModule, 
    //AuthModule
    BrowserAnimationsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
