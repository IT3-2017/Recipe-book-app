import { Observable, Subscription } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShoppingListService } from '../services/shoppinglist.service';
import { Ingredient } from '../shared/ingredient.model';

import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as ShoppingListActions from '../actions/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  //ingredients!: Ingredient[];
  ingredients: Observable<{ingredients: Ingredient[]}>;
  private igChangeSub!: Subscription;

                                                                //ovo je ngRx dodatak u odnosu na Redux, gde se ubacuje STORE kao dependenz+cy injection da bismo lakse mogli da pristupamo sacuvanom state-u i podacima
  constructor(private shoppingLisService:ShoppingListService, private store: Store<fromApp.AppState>) { }

  ngOnDestroy(): void {
    //this.igChangeSub.unsubscribe();
  }

  ngOnInit(): void {

    this.ingredients = this.store.select('shoppingList'); // samo ngRx se brine o unsuscribe, samom subscriptionu
    //shoppingList je deo STORE-a koji nam treba, posto je to veliki objekat podeljen  na celine

/*     this.ingredients = this.shoppingLisService.getIngredients();
    this.igChangeSub = this.shoppingLisService.ingredientsChanged.subscribe(
      (changedIngredients: Ingredient[]) =>{
        this.ingredients = changedIngredients;
      }
    ); */
  }

  onEditItem(index: number){
    //this.shoppingLisService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

}
