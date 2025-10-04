import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../models/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  api = `${environment.api}/token/`;

  constructor(private clientHttp: HttpClient, private router: Router) { }

  login(data: Auth) {
    return this.clientHttp.post(this.api, data).subscribe({
        next: (res: any) => {
          localStorage.setItem('access_token', res.access);
          localStorage.setItem('refresh_token', res.refresh);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Usuário ou senha incorretos!'
          })
        }
      });;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/auth']);
  }

  refreshToken(refresh: string) {
    return this.clientHttp.post(`${this.api}refresh/`, {refresh});
  }
}
