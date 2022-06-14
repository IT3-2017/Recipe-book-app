import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListRouting } from './shopping-list-routing';
import { ShoppingListComponent } from './shopping-list.component';

@NgModule({
  declarations: [ShoppingListComponent, ShoppingEditComponent],
  imports: [ SharedModule, FormsModule, ShoppingListRouting]
})
export class ShoppingListModule {}
