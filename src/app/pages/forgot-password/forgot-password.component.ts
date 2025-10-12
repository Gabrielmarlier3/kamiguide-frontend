import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AppHeaderComponent } from '../../shared/components/header/header.component'
import { FooterComponent } from '../../shared/components/footer/footer.component'
import { UserService } from '../../shared/service/user/user.service'

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, AppHeaderComponent, FooterComponent, RouterLink],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  email = ''
  isLoading = false
  error = ''
  info = ''

  constructor(
    private user: UserService,
    private router: Router,
  ) {}

  submit() {
    if (!this.email.trim()) return
    this.error = ''
    this.info = ''
    this.isLoading = true

    this.user.requestRefactorToken(this.email.trim()).subscribe({
      next: () => {
        this.isLoading = false
        // feedback amigável (sem vazar se o e-mail existe ou não)
        this.info = 'If the email is registered, a code has been sent.'
        // navega para a segunda etapa levando o e-mail
        this.router.navigate(['/reset-password'], { queryParams: { email: this.email.trim() } })
      },
      error: () => {
        this.isLoading = false
        // mantém mesma mensagem para evitar enumeration
        this.info = 'If the email is registered, a code has been sent.'
      },
    })
  }
}
