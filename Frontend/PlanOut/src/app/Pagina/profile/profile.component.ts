import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { NavbarComponent } from '../../Componentes/navbar/navbar.component';
import { FooterComponent } from '../../Componentes/footer/footer.component';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/users.models';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, HttpClientModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profileForm: FormGroup ;
  user: User | null = null;

  constructor(private userService: UserService, private router: Router) {
    this.profileForm = new FormGroup({
      nombre: new FormControl(),
      email: new FormControl()

    });
    this.userService.Profile({}).subscribe(user => {
      this.user = user;
      this.profileForm.patchValue({ nombre: user.name }); // Update the form
      console.log(this.user)
    });

  }


   onSubmit() {
    if (!this.profileForm.valid) {
      return;
    }

    const user:User = {
      name: this.profileForm.value.nombre,
      }
      console.log(name)
    console.log(this.profileForm.value);
    this.userService.editUsername(user).subscribe({
      next:(data) =>{
        console.log(data);

      },

      error:(error) =>{
        console.log(error);

      }
    })
  }

}