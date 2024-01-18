import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable ,Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User, Token } from "../models/users.models"
import { Chatgpt } from '../models/chatgpt.models';


@Injectable({
  providedIn: 'root'
})
export class ChatGptService {

  apiUrl = "http://localhost:3000/api/chatgpt"

  tokenName = "TOKEN"

  constructor(private http:HttpClient) { }

  headers:HttpHeaders = new HttpHeaders({
    "Content-Type":"application/json"
  })

  CrearPlan(chatgpt: Chatgpt):Observable<Chatgpt>{
    let headers = this.headers;
    const token:string = localStorage.getItem(this.tokenName) as string
    headers = headers.append("authorization", token)    
    return this.http.post<Chatgpt>(this.apiUrl+"/crearplan", JSON.stringify(chatgpt),{ headers: headers })
   
  }
  isLogged():boolean{
    return localStorage.getItem(this.tokenName) ? true : false;
  }


}