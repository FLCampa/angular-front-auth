import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url: string = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) {}

  public signin(payload: { email: string; password: string }): Observable<any> {
    return this.http
      .post<{ token: string }>(`${this.url}/signin`, payload)
      .pipe(
        map((res) => {
          localStorage.removeItem('access_token');
          // armazenanndo token
          localStorage.setItem('access_token', res.token);
          return this.router.navigate(['admin']);
        }),
        catchError((error) => {
          if (error.error.message) return throwError(() => error.error.message);

          // qnd o servidor estiver off
          return throwError(() => 'Erro ao validar os dados!');
        })
      );
  }

  public logout() {
    localStorage.removeItem('access_token');
    return this.router.navigate(['']);
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');

    if (!token) return false;

    const jtwHelper = new JwtHelperService();
    return !jtwHelper.isTokenExpired(token);
  }
}
