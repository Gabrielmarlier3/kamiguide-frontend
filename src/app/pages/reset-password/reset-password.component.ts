import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { AuthService } from '../../shared/service/auth/auth.service'
import { AppHeaderComponent } from '../../shared/components/header/header.component'
import { FooterComponent } from '../../shared/components/footer/footer.component'
import { UserService } from '../../shared/service/user/user.service'

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, AppHeaderComponent, FooterComponent, RouterLink],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  email = ''
  token = ''
  newPassword = ''
  confirmPassword = ''
  isLoading = false
  error = ''
  info = ''

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private user: UserService,
  ) {
    const qpEmail = this.route.snapshot.queryParamMap.get('email')
    if (qpEmail) this.email = qpEmail
  }

  passwordsMatch(): boolean {
    return this.newPassword.length > 0 && this.newPassword === this.confirmPassword
  }

  submit() {
    if (!this.email.trim() || !this.token.trim() || !this.passwordsMatch()) return

    this.error = ''
    this.info = ''
    this.isLoading = true

    this.user.changePassword(this.email.trim(), this.token.trim(), this.newPassword).subscribe({
      next: () => {
        this.isLoading = false
        this.info = 'Password changed successfully.'
        this.router.navigate(['/login'])
      },
      error: (err) => {
        this.isLoading = false
        const msg = err?.error?.message || 'Error changing password.'
        this.error = msg
      },
    })
  }
}
