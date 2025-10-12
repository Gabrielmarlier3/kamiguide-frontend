import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient)
  private apiURl = environment.userApiUrl
  constructor() {}

  requestRefactorToken(email: string) {
    return this.http.post<{ message: string; status: number }>(`${this.apiURl}/refactor-token`, {
      email,
    })
  }

  changePassword(email: string, token: string, newPassword: string) {
    return this.http.patch<{ message: string; status: number }>(`${this.apiURl}/change-password`, {
      email,
      token,
      newPassword,
    })
  }

  sendVerificationCode(email: string) {
    return this.http.post<{ message: string }>(`${this.apiURl}/verification-token`, { email })
  }

  registerUser(payload: { firstName: string; token: string; email: string; password: string }) {
    return this.http.post<{ message: string; statusCode: number }>(
      `${this.apiURl}/register`,
      payload,
    )
  }
}
