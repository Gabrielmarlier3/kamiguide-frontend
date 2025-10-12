import { Routes } from '@angular/router'
import { ExploreGenresComponent } from './pages/explore-genres/explore-genres.component'
import { HomeComponent } from './pages/home/home.component'
import { GenreDetailsComponent } from './pages/genre-details/genre-details.component'
import { AnimeDetailsComponent } from './pages/anime-details/anime-details.component'
import { AboutComponent } from './pages/about/about.component'
import { SearchComponent } from './pages/search/search.component'
import { HelpPageComponent } from './pages/help/help.component'
import { ReportPageComponent } from './pages/report/report.component'
import { LoginComponent } from './pages/login/login.component'
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component'
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component'
import { SignupComponent } from './pages/signup/signup.component'

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'explore',
    component: ExploreGenresComponent,
  },
  {
    path: 'explore/:genre',
    component: GenreDetailsComponent,
  },
  {
    path: 'anime/:id',
    component: AnimeDetailsComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'help',
    component: HelpPageComponent,
  },
  {
    path: 'report',
    component: ReportPageComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
]
