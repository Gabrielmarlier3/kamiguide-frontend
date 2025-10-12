export interface GenreDto {
  mal_id: number
  type: string
  name: string
}

export interface StaffDto {
  mal_id: number
  image_url: string
  title: string
  year: string
  score: string
  episodes: string
  sinopses: string
  genres: GenreDto[]
}

export interface StaffRecomendationResponseDto {
  payload: StaffDto[]
  fetchedAt: string
}
