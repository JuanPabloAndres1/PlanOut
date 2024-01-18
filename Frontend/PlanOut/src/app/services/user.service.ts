import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, Token } from "../models/users.models"
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = "http://localhost:3000/users";
  tokenName = "TOKEN";

  constructor(private http: HttpClient) { }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  register(user: User): Observable<Token | { error: string }> {
    return this.http.post<Token>(`${this.apiUrl}/singupUsers`, user, { headers: this.headers });
  }

  login(user: User): Observable<{ token: string } | { error: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/loginUsers`, JSON.stringify(user), { headers: this.headers });
  }

  isLogged(): boolean {
    return localStorage.getItem(this.tokenName) ? true : false;
  }

  saveToken(token: string): void {
    if (token) {
      localStorage.setItem(this.tokenName, token);
    } else {
      localStorage.removeItem(this.tokenName);
    }
  }


  Profile(user: User): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem(this.tokenName)}`,
      'Content-Type': 'application/json' // Assuming JSON data
    });

    return this.http.get<User>(this.apiUrl + '/getUsers', { headers });
  }

  editUsername(user: User) {
    let headers = this.headers;
    const token: string = localStorage.getItem(this.tokenName) as string;
    headers = headers.append("Authorization", token);
    return this.http.put(this.apiUrl + "/editUsername", JSON.stringify(user), { headers: headers });
  }

  getCurrentUser(): Observable<User | null> {
    return this.http.get<User>(this.apiUrl + '/users/current')
      .pipe(
        map(user => user || null) // Handle potential null response
      );
  }
}