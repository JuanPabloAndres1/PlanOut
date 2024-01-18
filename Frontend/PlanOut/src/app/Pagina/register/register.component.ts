import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/users.models';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  rutaImagen = 'assets/logo.png';

  constructor(private userService: UserService, private router: Router) {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

  onSubmit() {
    const emailControl = this.registerForm.get('email');
    const passwordControl = this.registerForm.get('password');

    if (emailControl && passwordControl) {
      const email = emailControl.value;
      const password = passwordControl.value;

      if (!this.customEmailValidator(email)) {
        console.log('Correo electrónico no válido');
        return;
      }

      if (!this.passwordValidator(password)) {
        console.log('Contraseña no válida. Debe tener al menos 8 caracteres y contener al menos un carácter especial.');
        return;
      }
    } else {
      console.error('No se pudo obtener el control de correo electrónico o contraseña.');
      return;
    }

    if (!this.registerForm.valid) {
      console.log('Formulario no válido');
      return;
    }

    const newUser: User = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.userService.register(newUser).subscribe({
      next: (user) => {
        console.log(user);
        this.router.navigate(['']);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  customEmailValidator(email: string): boolean {
    const emailControl = this.registerForm?.get('email');
  
    if (!emailControl) {
      console.error('No se pudo obtener el control de correo electrónico.');
      return false;
    }
  
    const isValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
  
    if (!isValid) {
      emailControl.setErrors({ 'email': true });
      return false;
    }
  
    const atIndex = email.indexOf('@');
    const dotIndex = email.indexOf('.', atIndex);
  
    if (dotIndex === -1 || dotIndex <= atIndex) {
      emailControl.setErrors({ 'dotAfterAt': true });
      return false;
    }
  
    return true;
  }
  
  passwordValidator(password: string): boolean {
    const passwordControl = this.registerForm?.get('password');
  
    if (!passwordControl) {
      console.error('No se pudo obtener el control de la contraseña.');
      return false;
    }
  
    const isValid = password.length >= 8 && /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);
  
    if (!isValid) {
      passwordControl.setErrors({ 'invalidPassword': true });
      return false;
    }
  
    return true;
  }
}