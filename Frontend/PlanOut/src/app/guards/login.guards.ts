import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { LoginGuardService } from "../services/loginGuard.service.js";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class LoginGuard implements CanActivate {
  constructor(private loginGuardService: LoginGuardService, private router: Router) {}

  canActivate(): boolean | Observable<boolean> {
    const token = localStorage.getItem("TOKEN");

    if (token) {
      // Verificar la validez del token utilizando el servicio
      return this.loginGuardService.verifyTokenValidity(token).pipe(
        catchError(_ => {
          // El token no es válido, redirigir al usuario a la página de inicio de sesión
          this.router.navigate([""]);
          return of(false);
        })
      );
    } else {
      // No hay token, redirigir al usuario a la página de inicio de sesión
      this.router.navigate([""]);
      return false;
    }
  }
}