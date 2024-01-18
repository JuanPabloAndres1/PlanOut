import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoginGuardService {
  private backendUrl = "http://localhost:3000/confrimToken";

  constructor(private http: HttpClient) {}

  verifyTokenValidity(token: string): Observable<any> {
    // Verificar la validez del token en el backend
    return this.http.post(`${this.backendUrl}/verificationT`, { token });
  }
}