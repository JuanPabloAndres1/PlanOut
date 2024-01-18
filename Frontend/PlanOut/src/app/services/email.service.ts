import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class EmailService {
    private apiUrl = 'http://localhost:3000/sendmail/send-email'; // Reemplazar con la URL correcta
  
    constructor(private http: HttpClient) {}
  
    sendEmail(email: string): Observable<any> {
      return this.http.post(this.apiUrl, { to: email });
    }

    
  }
