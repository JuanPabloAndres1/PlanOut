import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule,FormsModule, Validators} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../../models/users.models';
import { Token } from '@angular/compiler';
import { EmailService } from '../../services/email.service';
import { response } from 'express';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  userEmail: string = '';
  rutaImagen = 'assets/logo.png';
  credentialsError: boolean = false;
  errorMessage: string = '';
  emailSentSuccess: boolean = false;
  successMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private emailService: EmailService,
    private zone: NgZone
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const user: User = {
        password: this.loginForm.value.password,
        email: this.loginForm.value.email,
      };

      this.userService.login(user).subscribe(
        (response: { token: string } | { error: string }) => {
          if ('token' in response) {
            // Es un Token
            const token = response.token as string;
            this.userService.saveToken(token);
            // Redirigir solo si las credenciales son correctas
            this.router.navigate(['/home']);
          } else {
            // Es un objeto con error
            this.credentialsError = true;
            this.errorMessage = response.error || 'Credenciales incorrectas';
          }
        },
        (error: any) => {
          console.log('Error en la autenticación', error);
          this.errorMessage = 'Error en la autenticación. Por favor, intenta nuevamente más tarde.';
          this.credentialsError = true;
        }
      );
    }
  }

  sendEmail() {
    if (!this.userEmail) {
      console.log("El email no existe");
      return;
    }

    this.emailService.sendEmail(this.userEmail).subscribe({
      next: (response) => {
        console.log(response);
        this.emailSentSuccess = true;
        this.successMessage = 'Si su correo es correcto, revise su bandeja de entrada.';
        // Puedes manejar la respuesta del servidor si es necesario
        this.zone.run(() => { }); // Actualizamos la vista en el contexto de Angular
      },
      error: (error) => {
        console.error(error);
        // Puedes manejar errores si es necesario
      }
    });
  }

  validateEmail() {
    const emailControl = this.loginForm.get('email');

    if (emailControl != null && emailControl.valid) {
      this.credentialsError = false; // Restablecer mensaje de credenciales incorrectas
      console.log('Correo electrónico válido');
    } else {
      this.credentialsError = true; // Mostrar mensaje de credenciales incorrectas
      console.log('Correo electrónico no válido');
    }
  }
}



