import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../Componentes/navbar/navbar.component';
import { FooterComponent } from '../../Componentes/footer/footer.component';
import { CalendarComponent } from '../../Componentes/calendar/calendar.component';
import { MapaComponent } from '../../Componentes/mapa/mapa.component';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/users.models';
import { Chatgpt } from '../../models/chatgpt.models';
import { ChatGptService } from '../../services/chatgpt.service';
import { HttpClientModule } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { ClimaService } from '../../services/clima.service';


@Component({
  selector: 'app-page-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule, FormsModule, MapaComponent, NavbarComponent, FooterComponent, CalendarComponent],
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.css']
})


export class PageHomeComponent {
  preferencesForm: FormGroup;

  Temp?: string ;
  year: string = "";
  month: string = "";   
  day: string = "";  
  chatptDetails: string = ''; 
  isModalShown: boolean = false;



  constructor(private ChatGptService: ChatGptService,private ClimaService: ClimaService, private router: Router) {
    this.preferencesForm = new FormGroup({
      location: new FormControl('', Validators.required),
      peopleCount: new FormControl('', Validators.required),
      planType: new FormControl('', Validators.required),
      activityType: new FormControl('', Validators.required),
      additionalPreferences: new FormControl('', Validators.required)
    });
    this.generateCalendar();
  }

  
  months: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  currentDate: Date = new Date();
  calendar: Array<number | null>[] = [];
  selectedDay: number | null = null;

  generateCalendar(): void {
    const daysInMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay();
    
    let dateCounter = 1;
    let week: Array<number | null> = [];
    this.calendar = [];

    for (let i = 0; i < firstDay; i++) {
      week.push(null);
    }

    for (let i = 0; i < daysInMonth; i++) {
      week.push(dateCounter);
      dateCounter++;
      if (week.length === 7) {
        this.calendar.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      this.calendar.push(week);
    }
  }

  prevMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  selectDate(day: number | null): void {
    this.selectedDay = day;
    if (day !== null) {
      this.year = (this.currentDate.getFullYear()).toString();
      this.month = (this.currentDate.getMonth() + 1).toString();
      this.day = (day).toString();
      console.log(`Fecha seleccionada: ${day}/${this.currentDate.getMonth() + 1}/${this.currentDate.getFullYear()}`);
    }
  }
  onSubmit() {
    console.log(this);
    console.log('-----');
    
    
    if (!this.preferencesForm.valid) {
      return;
    }
    
    // console.log(this.month)  
    // console.log(this.year) 
    // console.log(this.day)  
                

    this.ClimaService.TraerClima(this.preferencesForm.value.location, parseInt(this.year), parseInt(this.month), parseInt(this.day)).subscribe({
      next: (clima) => {
        
        this.Temp=clima.temperatura_predicha
        console.log(this.Temp)
        const newChatgpt: Chatgpt = {
          TipoPlan: this.preferencesForm.value.planType,
          NumeroPersonas: this.preferencesForm.value.peopleCount,
          Ciudad: this.preferencesForm.value.location,
          Actividad: this.preferencesForm.value. activityType,
          Adicionales: this.preferencesForm.value.additionalPreferences,
          Temp: this.Temp  
    
          };
          
          console.log(this.Temp )
      
          this.ChatGptService.CrearPlan(newChatgpt).subscribe({
            next: (chatpt) => {

              if (chatpt.message) {
                this.chatptDetails = chatpt.message.replace(/\n/g, '<br>');
            } else {

                this.chatptDetails = 'Mensaje no disponible';
            }
              console.log(this.chatptDetails)

              this.showModal(); //
              this.router.navigate(['/home']);
            },
            error: (error) => {
              console.error(error);
              // Handle registration error
            }
          });
        
        
      },
      error: (error) => {
        console.error(error);
        // Handle registration error
      }
    })


   

    // console.log('Form Data:', this.preferencesForm.value);
  }
  showModal() {
    this.isModalShown = true;
  }

  hideModal() {
    this.isModalShown = false;
  }

}