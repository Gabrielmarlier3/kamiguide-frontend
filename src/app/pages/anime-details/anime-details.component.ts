import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { CommonModule } from '@angular/common'
import { AppHeaderComponent } from '../../shared/components/header/header.component'
import { FooterComponent } from '../../shared/components/footer/footer.component'
import { AnimeService } from '../../shared/service/anime/anime.service'
import {
  AnimeDetailsDto,
  AnimeDetailsResponseDto,
} from '../../shared/service/anime/dto/anime-details.dto'

@Component({
  selector: 'app-anime-details',
  standalone: true,
  imports: [CommonModule, AppHeaderComponent, FooterComponent],
  templateUrl: './anime-details.component.html',
})
export class AnimeDetailsComponent implements OnInit {
  anime: AnimeDetailsDto | null = null
  loading = true
  isFavorited = false
  showAllGenres = false

  constructor(
    private route: ActivatedRoute,
    private animeService: AnimeService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    if (!id) {
      this.loading = false
      return
    }
    this.animeService.getAnimeDetails(id).subscribe({
      next: (res: AnimeDetailsResponseDto) => {
        this.anime = res.payload
        this.loading = false
      },
      error: () => {
        this.loading = false
      },
    })
  }

  toggleFavorite() {
    this.isFavorited = !this.isFavorited
  }

  get displayedGenres() {
    if (!this.anime) return []
    return this.showAllGenres ? this.anime.genres : this.anime.genres.slice(0, 20)
  }

  get remainingGenresCount() {
    if (!this.anime) return 0
    return Math.max(this.anime.genres.length - 20, 0)
  }
}
