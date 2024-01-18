import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/newpass/reset-password';

  constructor(private http: HttpClient) { }

  resetPassword(newPassword: string, resetToken: string): Observable<any> {
    const data = { newPassword, resetToken };
    return this.http.post<any>(this.apiUrl, data);
  }
}