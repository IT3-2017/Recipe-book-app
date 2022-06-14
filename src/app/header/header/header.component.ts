import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { map, Subscription , pipe} from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';

import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from '../../actions/auth.actions';
import * as RecipeActions from '../../actions/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() optionSelected = new EventEmitter<string>();

  collapsed = true;
  private userSubscription!: Subscription;
  loggedUser = false;
  constructor(private dataStorage: DataStorageService, private authService:AuthService, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.userSubscription = this.store.select('auth').pipe(
      map( stateData => {
        return stateData.user;
      })
    )
    .subscribe(
    //this.userSubscription = this.authService.user.subscribe( *
      user =>{
        this.loggedUser = !!user;
      }
    );
  }

  ngOnDestroy(){
    this.userSubscription.unsubscribe();  }

  onSelect(selectedOption:string){
    console.log(selectedOption);
    this.optionSelected.emit(selectedOption);
  }

  onSaveData(){
    this.store.dispatch(new RecipeActions.StoreRecipes());
    //this.dataStorage.saveRecipies();*
  }

  onFetchData(){
    this.store.dispatch(new RecipeActions.FetchRecipes());
    //this.dataStorage.fetchRecipies().subscribe(); *
  }

  onLogout(){
    //this.authService.logout();
    this.store.dispatch(new AuthActions.Logout());
  }
}
