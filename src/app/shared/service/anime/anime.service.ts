import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { StaffRecomendationResponseDto } from './dto/staff-recommendation.dto'
import { AnimeDetailsResponseDto } from './dto/anime-details.dto'
import { PopularResponseDto } from './dto/popular.dto'
import { ExploreListResponse } from './dto/explore.dto'
import { GenreSearchResponseDto, GenreTabDto } from './dto/genre.dto'
import { SearchPaginatedResponseDto } from './dto/search.dto'
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class AnimeService {
  private apiUrl = environment.animeApiUrl

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

  getExplore(): Observable<ExploreListResponse> {
    return this.http.get<ExploreListResponse>(`${this.apiUrl}/explore`)
  }

  getByGenre(
    genre: string,
    page: number = 1,
    year?: number,
    min_score?: number,
    type?: 'series' | 'movie',
  ): Observable<GenreSearchResponseDto> {
    return this.http.get<GenreSearchResponseDto>(`${this.apiUrl}/explore/genre`, {
      params: {
        genre,
        page,
        ...(min_score ? { min_score } : {}),
        ...(type ? { type } : {}),
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
