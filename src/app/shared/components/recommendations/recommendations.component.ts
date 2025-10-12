import { Component, inject } from '@angular/core'
import { AnimeService } from '../../service/anime/anime.service'
import { PopularDto } from '../../service/anime/dto/popular.dto'
import { RouterLink } from '@angular/router'
import { LucideAngularModule } from 'lucide-angular'
import { CommonModule } from '@angular/common'
import { StaffDto } from '../../service/anime/dto/staff-recommendation.dto'

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './recommendations.component.html',
  styleUrl: './recommendations.component.css',
})
export class RecommendationsComponent {
  private animeService = inject(AnimeService)

  staffRecommendation: StaffDto[] = []
  loading = true

  ngOnInit(): void {
    this.animeService.getStaffRecommendations().subscribe({
      next: (res) => {
        this.staffRecommendation = res.payload
        this.loading = false
      },
      error: (err) => {
        console.error(err)
        this.loading = false
      },
    })
  }
}
