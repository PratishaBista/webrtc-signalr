import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../models/api-response';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/account';
  private token = 'token';
  private httpClient = inject(HttpClient);

  register(data: FormData): Observable<ApiResponse<string>> {
    return this.httpClient.post<ApiResponse<string>>(`${this.baseUrl}/register`, data).pipe(tap((response) => {
      localStorage.setItem(this.token, response.data!);
    }));
  }

  login(email: string, password: string): Observable<ApiResponse<string>> {
    return this.httpClient.post<ApiResponse<string>>(`${this.baseUrl}/login`, {
      email,
      password

    })
      .pipe(tap((response) => {
        if (response.isSuccess) {
          console.log("Access token received: ", response.data);
          localStorage.setItem(this.token, response.data);
        } else {
          console.error("Login failed: ", response.error);
        }
        return response;
      }))

  }

  me(): Observable<ApiResponse<User>> {
    return this.httpClient.get<ApiResponse<User>>(`${this.baseUrl}/me`, {
      headers: {
        "Authorization": `Bearer ${this.getAccessToken}`,
      },
    })
      .pipe(tap((response) => {
        if (response.isSuccess) {
          // only for debugging purpose, this is not a good practice, remove after debug
          console.log("User details fetched successfully: ", response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        } else {
          console.error("Error fetching user details: ", response.error);
        }

      }))

  }

  get getAccessToken(): string {
    const token = localStorage.getItem(this.token);
    if (!token) throw new Error("Access token not found.");
    return token;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.token);
  }

}
