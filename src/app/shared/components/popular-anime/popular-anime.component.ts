import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'

import { RouterModule } from '@angular/router'
import { PopularResponseDto } from '../../service/anime/dto/popular.dto'
import { AnimeService } from '../../service/anime/anime.service'

@Component({
  selector: 'app-popular-anime',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './popular-anime.component.html',
})
export class PopularAnimeComponent implements OnInit {
  animeList: PopularResponseDto['payload'] = []

  constructor(private animeService: AnimeService) {}

  ngOnInit(): void {
    this.animeService.getPopular().subscribe((res) => {
      this.animeList = res.payload
    })
  }
}
