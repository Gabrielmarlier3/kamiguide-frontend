import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { StaffRecomendationResponseDto } from './dto/staff-recommendation.dto'
import { AnimeDetailsResponseDto } from './dto/anime-details.dto'
import { PopularResponseDto } from './dto/popular.dto'
import { ExploreListResponseDto } from './dto/explore.dto'
import { GenreTabDto } from './dto/genre.dto'
import { SearchPaginatedResponseDto } from './dto/search.dto'

@Injectable({
  providedIn: 'root',
})
export class AnimeService {
  private apiUrl = 'http://localhost:3000/anime'

  constructor(private http: HttpClient) {}

  getStaffRecommendations(): Observable<StaffRecomendationResponseDto> {
    return this.http.get<StaffRecomendationResponseDto>(`${this.apiUrl}/staff-recomendation`)
  }

  getAnimeDetails(id: number): Observable<AnimeDetailsResponseDto> {
    return this.http.get<AnimeDetailsResponseDto>(`${this.apiUrl}/details/${id}`)
  }

  getPopular(): Observable<PopularResponseDto> {
    return this.http.get<PopularResponseDto>(`${this.apiUrl}/popular`)
  }

  getExplore(): Observable<ExploreListResponseDto> {
    return this.http.get<ExploreListResponseDto>(`${this.apiUrl}/explore`)
  }

  getByGenre(genre: string, page: number = 1, year?: number): Observable<GenreTabDto> {
    return this.http.get<GenreTabDto>(`${this.apiUrl}/explore/genre`, {
      params: {
        genre,
        page,
        ...(year ? { year } : {}),
      },
    })
  }

  searchAnime(name: string, page: number = 1): Observable<SearchPaginatedResponseDto> {
    return this.http.get<SearchPaginatedResponseDto>(`${this.apiUrl}/search`, {
      params: { name, page },
    })
  }
}
