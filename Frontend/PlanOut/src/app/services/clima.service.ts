import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Clima } from '../models/clima.models';

@Injectable({
  providedIn: 'root'
})
export class ClimaService {

  apiUrl = "http://localhost:3000/api/clima";

  tokenName = "TOKEN";

  constructor(private http: HttpClient) { }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  TraerClima(city: string, year: number, month: number, day: number): Observable<Clima> {
    let headers = this.headers;
    const token: string = localStorage.getItem(this.tokenName) as string;
    headers = headers.append("authorization", token);

    const url = `${this.apiUrl}/prediccion/${city}/${year}/${month}/${day}`;
    return this.http.get<Clima>(url, { headers });
  }
}
