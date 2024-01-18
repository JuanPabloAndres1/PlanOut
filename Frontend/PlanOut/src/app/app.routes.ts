import { PrincipalComponent } from './Pagina/principal/principal.component';
import {LoginComponent} from './Pagina/login/login.component';
import {PageHomeComponent} from './Pagina/page-home/page-home.component';
import {ProfileComponent} from './Pagina/profile/profile.component';
import {RegisterComponent } from './Pagina/register/register.component';
import { ForgetComponent } from './Pagina/forget/forget.component';
import {CalendarioComponent } from './Pagina/calendario/calendario.component';
import { Routes } from '@angular/router';
import { LoginGuard } from './guards/login.guards';

export const routes: Routes = [ 
    {path: "", component: PrincipalComponent},
    {path: "login", component: LoginComponent },
    {path: "register", component: RegisterComponent},
    {path: "forget/:token", component: ForgetComponent},  
    {path: "profile", component: ProfileComponent, canActivate:[LoginGuard]},    
    {path: "home", component: PageHomeComponent,canActivate:[LoginGuard]},
    {path: "calendario", component: CalendarioComponent, canActivate:[LoginGuard]}, 
 ]