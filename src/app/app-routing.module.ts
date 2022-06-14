import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipe', pathMatch: 'full' },
  { path: 'recipe', loadChildren: () => import('./recipes/recipes.module').then( loadedModule => loadedModule.RecipesModule)},
  { path: 'shopping-list', loadChildren: ()=> import('./shopping-list/shopping-list.module').then( loadedModule => loadedModule.ShoppingListModule)},
  { path: 'auth', loadChildren: ()=> import('./auth/auth.module').then(loadedModule => loadedModule.AuthModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})], //definise da se moduli preloaduju pre upotrebe, da bi se obrzo ucitali kada nam trebaju
  exports: [RouterModule],
})
export class AppRoutingModule {}
