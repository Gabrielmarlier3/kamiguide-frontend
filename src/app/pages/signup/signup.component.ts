import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import {Router, RouterLink} from '@angular/router'
import { UserService } from '../../shared/service/user/user.service'
import { AppHeaderComponent } from '../../shared/components/header/header.component'
import { FooterComponent } from '../../shared/components/footer/footer.component'
import { LucideAngularModule } from 'lucide-angular'

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, AppHeaderComponent, FooterComponent, LucideAngularModule, RouterLink],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  firstName = ''
  email = ''
  token = ''
  password = ''

  isLoading = false
  isSendingCode = false
  codeSent = false
  resendIn = 0 // segs
  error = ''
  info = ''

  private resendTimer?: any

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  onTokenInput(v: string) {
    this.token = v.replace(/\D/g, '').slice(0, 5)
  }

  sendCode() {
    if (!this.email) {
      this.error = 'Please enter your email first'
      return
    }
    this.error = ''
    this.info = ''
    this.isSendingCode = true

    this.userService.sendVerificationCode(this.email.trim()).subscribe({
      next: () => {
        this.isSendingCode = false
        this.codeSent = true
        this.info = 'Verification code sent to your email'
        this.startResendCountdown(60) // 60s
      },
      error: (err) => {
        this.isSendingCode = false
        const msg = err?.error?.message || 'Failed to send verification code. Please try again.'
        this.error = msg
      },
    })
  }

  private startResendCountdown(seconds: number) {
    this.clearTimer()
    this.resendIn = seconds
    this.resendTimer = setInterval(() => {
      this.resendIn--
      if (this.resendIn <= 0) this.clearTimer()
    }, 1000)
  }

  private clearTimer() {
    if (this.resendTimer) {
      clearInterval(this.resendTimer)
      this.resendTimer = undefined
      this.resendIn = 0
    }
  }

  canSubmit(): boolean {
    const passOk = this.password.length >= 8 && this.password.length <= 20
    const tokenOk = /^\d{5}$/.test(this.token)
    return !!this.firstName && !!this.email && passOk && tokenOk && !this.isLoading
  }

  submit() {
    if (!this.canSubmit()) return
    this.error = ''
    this.info = ''
    this.isLoading = true

    this.userService
      .registerUser({
        firstName: this.firstName.trim(),
        email: this.email.trim(),
        token: this.token.trim(),
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.isLoading = false
          // registro não retorna tokens; após criar conta, manda pro login
          this.router.navigate(['/login'], {
            queryParams: { registered: '1' },
          })
        },
        error: (err) => {
          this.isLoading = false
          const msg =
            err?.status === 400
              ? 'Invalid token'
              : err?.status === 429
                ? 'Too many attempts, please request a new token.'
                : err?.error?.message || 'Failed to create account. Please try again.'
          this.error = msg
        },
      })
  }
}
