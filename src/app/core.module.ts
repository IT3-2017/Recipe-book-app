import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthIntercepterService } from './auth/auth-interceptor.service';
import { RecipeService } from './services/recipe.service';
import { ShoppingListService } from './services/shoppinglist.service';

@NgModule({
  providers: [
    ShoppingListService,
    RecipeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthIntercepterService,
      multi: true,
    },
  ]
})
export class CoreModule {}
