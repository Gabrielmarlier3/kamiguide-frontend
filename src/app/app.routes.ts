import {Routes} from '@angular/router'
import {ExploreGenresComponent} from './pages/explore-genres/explore-genres.component'
import {HomeComponent} from './pages/home/home.component'
import {GenreDetailsComponent} from './pages/genre-details/genre-details.component'
import {AnimeDetailsComponent} from './pages/anime-details/anime-details.component';

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
    component: AnimeDetailsComponent
  }
]
