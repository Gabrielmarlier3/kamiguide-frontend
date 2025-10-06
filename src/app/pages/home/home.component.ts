import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AppHeaderComponent } from '../../shared/components/header/header.component'
import { RecommendationsComponent } from '../../shared/components/recommendations/recommendations.component'
import { PopularAnimeComponent } from '../../shared/components/popular-anime/popular-anime.component'
import {FooterComponent} from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, AppHeaderComponent, RecommendationsComponent, PopularAnimeComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
