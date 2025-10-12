import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { LucideAngularModule } from 'lucide-angular'
import { AuthService } from '../../service/auth/auth.service'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class AppHeaderComponent implements OnInit {
  searchQuery: string = ''
  isAuth$: Observable<boolean> | undefined

  constructor(
    private router: Router,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.isAuth$ = this.auth.isAuthenticated$
  }

  handleSearch(event: Event): void {
    event.preventDefault()
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery.trim() } })
    }
  }

  logout(): void {
    this.auth.logout()
    this.router.navigate(['/'])
  }

  goToPreferences(): void {
    this.router.navigate(['/preferences'])
  }
}
