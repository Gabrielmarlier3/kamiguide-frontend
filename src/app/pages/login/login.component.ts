import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthService } from '../../shared/service/auth/auth.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = ''
  password = ''
  isLoading = false
  error = ''

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
    this.auth.initFromStorage()
  }

  submit(): void {
    if (!this.email || !this.password) return
    this.error = ''
    this.isLoading = true
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.isLoading = false
        this.router.navigate(['/'])
      },
      error: () => {
        this.isLoading = false
        this.error = 'Failed to login. Please try again.'
      },
    })
  }
}
