import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { AuthRouting } from "./auth-routing.module";
import { AuthComponent } from "./auth.component";

@NgModule({
    declarations:[AuthComponent],
    imports:[CommonModule, SharedModule, AuthRouting, FormsModule]
})
export class AuthModule{

}