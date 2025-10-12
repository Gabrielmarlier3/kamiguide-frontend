import { Flower, Ghost, Heart, Music, Sparkles, Trophy, User, Zap } from 'lucide-angular'
import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { LucideAngularModule } from 'lucide-angular'
import { AnimeService } from '../../shared/service/anime/anime.service'
import { AppHeaderComponent } from '../../shared/components/header/header.component'
import { FooterComponent } from '../../shared/components/footer/footer.component'
import { ExploreListResponse, ExploreResponseDto } from '../../shared/service/anime/dto/explore.dto'

@Component({
  selector: 'app-explore-genres',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, AppHeaderComponent, FooterComponent],
  templateUrl: './explore-genres.component.html',
})
export class ExploreGenresComponent implements OnInit {
  genres: ExploreResponseDto[] = []
  loading = true
  // explore.component.ts
  iconMap: Record<string, string> = {
    Action: 'swords',
    Adventure: 'map',
    'Award Winning': 'trophy',
    Comedy: 'laugh',
    Drama: 'drama',
    Fantasy: 'wand',
    Gourmet: 'utensils',
    Horror: 'skull',
    Mystery: 'search',
    Romance: 'heart',
    'Sci-Fi': 'microscope',
    'Slice of Life': 'coffee',
    Sports: 'dumbbell',
    Supernatural: 'moon-star',
    Suspense: 'hourglass',
    Detective: 'hat-glasses',
    Historical: 'landmark',
    Isekai: 'earth',
    'Martial Arts': 'hand-fist',
    Mecha: 'cpu',
    Medical: 'stethoscope',
    Military: 'shield',
    Music: 'music',
    Mythology: 'crown',
    Psychological: 'brain',
    Racing: 'flag',
    Reincarnation: 'refresh-ccw',
    Samurai: 'sword',
    School: 'graduation-cap',
    Space: 'rocket',
    Survival: 'axe',
    'Time Travel': 'clock',
    Vampire: 'droplet',
    'Video Game': 'gamepad-2',
    Villainess: 'gamepad-2', //todo: trocar esse
    Josei: 'user',
    Kids: 'baby',
    Seinen: 'users',
    Shoujo: 'sparkles',
    Shounen: 'flame',
  }

  constructor(
    private animeService: AnimeService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
  ) {}

  ngOnInit(): void {
    this.animeService.getExplore().subscribe({
      next: (res: ExploreListResponse) => {
        // garante que a atualização roda dentro da Zone
        this.zone.run(() => {
          this.genres = res.payload
          this.loading = false
          this.cdr.markForCheck()
        })
      },
      error: () => {
        this.zone.run(() => {
          this.loading = false
          this.cdr.markForCheck()
        })
      },
    })
  }
}
