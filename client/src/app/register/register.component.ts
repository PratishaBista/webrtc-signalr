import { Component, inject, signal } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../models/api-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email!: string;
  password!: string;
  userName!: string;
  fullName!: string;
  profilePicture: string = "https://randomuser.me/api/portraits/lego/1.jpg";
  profileImage: File | null = null;

  authService = inject(AuthServiceService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  hide = signal(false);

  togglePassword(event: MouseEvent) {
    this.hide.set(!this.hide());
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.profileImage = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePicture = e.target!.result as string;
        console.log(e.target?.result);
      }
      reader.readAsDataURL(file);
      console.log(this.profilePicture);
    }
  }
  register() {
    const formData = new FormData();
    formData.append("email", this.email);
    formData.append("password", this.password);
    formData.append("fullName", this.fullName);
    formData.append("userName", this.userName);
    if (this.profileImage) {
      formData.append("profileImage", this.profileImage);
    }

    this.authService.register(formData).subscribe({
      next: () => {
        this.snackBar.open("Registration successful", "Close");
        this.router.navigate(['/']);
      },
      error: (error: HttpErrorResponse) => {
        const err = error.error as ApiResponse<string>;
        this.snackBar.open(err.error || "Registration failed", "Close");
      }
    });
  }
}
